/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs'
import * as path from 'path'
import type { Express, Request } from 'express'
import * as express from 'express'
import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'
import { createServer as createViteServer } from 'vite'
import { ISO } from '../../../packages/common/src/enums/iso.enum'
import { PrepareTemplateByUrl, Tegs, RenderFunction, Manifest } from './types'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

const isTest =
  process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD || false

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const resolve = (relativePath: string) =>
  path.resolve(__dirname, '..', relativePath)

const requireWithDefault = <T>(pathToFile: string, defaultValue: T): T => {
  let data: T

  try {
    data = isProd ? require(pathToFile) : defaultValue
  } catch (error) {
    data = defaultValue
  }

  return data
}

const getManifest = (): Manifest =>
  requireWithDefault<Manifest>('./dist/client/ssr-manifest.json', {})

const setTegsToTemplate = (
  template: string,
  tegs: Tegs,
  language: ISO,
): string => {
  const html = template
    .replace(`<!--preload-links-->`, tegs.preloadLinks)
    .replace(`<!--app-html-->`, tegs.appHtml)
    .replace(`<!--head-tags-->`, tegs.headTags)
    .replace(`<html lang="en">`, `<html lang="${language}">`)

  return html
}

const prepareTemplateForDev = async (
  app: Express,
): Promise<PrepareTemplateByUrl> => {
  const viteDevServer = await createViteServer({
    root: process.cwd(),
    logLevel: isTest ? 'error' : 'info',
    server: {
      middlewareMode: 'ssr',
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  })
  app.use(viteDevServer.middlewares)

  return async (url: string, language: ISO): Promise<string> => {
    const template = fs.readFileSync(resolve('index.html'), 'utf-8')
    const transformedTemplate = await viteDevServer.transformIndexHtml(
      url,
      template,
    )

    const render = (
      await viteDevServer.ssrLoadModule('/server/entry-server.ts')
    ).render as RenderFunction

    if (!render || typeof render !== 'function') {
      throw new Error(`Couldn't get a render function. Try rerun the server.`)
    }

    const tegs: Tegs = await render(url, getManifest(), language)

    return setTegsToTemplate(transformedTemplate, tegs, language)
  }
}

const prepareTemplateForProd = async (
  app: Express,
): Promise<PrepareTemplateByUrl> => {
  app.use(require('compression')())
  app.use(
    require('serve-static')(resolve('dist/client'), {
      index: false,
    }),
  )

  return async (url, language): Promise<string> => {
    const template =
      fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') || ''

    const render = requireWithDefault<{ render: RenderFunction | null }>(
      resolve('./dist/server/entry-server.js'),
      { render: null },
    ).render

    if (!render || typeof render !== 'function') {
      throw new Error(`Couldn't get a render function. Try rerun the server.`)
    }

    const tegs: Tegs = await render(url, getManifest(), language)
    return setTegsToTemplate(template, tegs, language)
  }
}

const prepareTemplate = (app: Express): Promise<PrepareTemplateByUrl> => {
  if (isDev) {
    return prepareTemplateForDev(app)
  } else {
    return prepareTemplateForProd(app)
  }
}

const getLanguage = (headers: Request['headers']): ISO => {
  const langsFromHeaders = headers['accept-language']?.split(';')[0].split(',')

  const language = langsFromHeaders?.find(lang => lang.length === 5) as
    | ISO
    | undefined

  return language || ISO.en
}

const createServer = async () => {
  const app = express()

  app.use(cookieParser())

  const prepareTemplateByUrl = await prepareTemplate(app)

  app.get(`*`, async (req, res) => {
    try {
      const { originalUrl, headers, cookies } = req

      const language =
        (cookies.i18n_redirected as ISO | undefined) || getLanguage(headers)

      const html: string = await prepareTemplateByUrl(originalUrl, language)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app }
}

if (!isTest) {
  const PORT = process.env.PORT || 80
  const HOST = process.env.HOST || 'http://localhost'

  createServer().then(({ app }) =>
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`
      Client: ${HOST}:${PORT}
      `)
    }),
  )
}

exports.createServer = createServer
