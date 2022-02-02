import type { ISO } from 'src/types'

export interface Manifest {
  [key: string]: string[]
}

export interface Tegs {
  appHtml: string
  preloadLinks: string
  headTags: string
}

export interface Context {
  modules: Set<string>
}

export type PrepareTemplateByUrl = (
  url: string,
  language: ISO,
) => Promise<string>

export type RenderFunction = (
  url: string,
  manifest: Manifest,
  language: ISO,
) => Promise<Tegs>
