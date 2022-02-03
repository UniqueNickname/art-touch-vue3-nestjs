import { isSSR } from 'src/constants'

type TimeMark = 'y' | 'm' | 'd' | 'h' | 'min' | 's'
type TimeString = `${number}${TimeMark}`

interface CookieConfig {
  expires: TimeString | number | Date
  'max-age'?: number
  path: string
  domain: string
  secure: boolean
  sameSite: 'strict' | 'Lax'
}

const defaultConfig: CookieConfig = {
  expires: '1d',
  path: '/',
  domain: '',
  secure: false,
  sameSite: 'Lax',
}

interface CookieManager {
  config: (options: Partial<CookieConfig>) => void
  get: (keyName: string) => string | null
  set: (keyName: string, value: string, options?: Partial<CookieConfig>) => void
  remove: (keyName: string) => void
}

const config = (options: Partial<CookieConfig>): void => {
  for (const propertyName in defaultConfig) {
    defaultConfig[propertyName] = options[propertyName]
      ? options[propertyName]
      : defaultConfig[propertyName]
  }
}

const get: CookieManager['get'] = (keyName: string) => {
  if (isSSR) return null

  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        keyName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)',
    ),
  )
  return matches ? decodeURIComponent(matches[1]) : null
}

const timeString2Seconds = (string: TimeString): number => {
  const number = parseInt(string.substring(0, string.length - 1))
  const mark = string.substring(string.length - 1, string.length) as TimeMark

  const min = 60
  const hour = min * 24
  const day = hour * 24
  const month = day * 30
  const year = day * 365

  switch (mark) {
    case 'y':
      return year * number

    case 'm':
      return month * number

    case 'd':
      return day * number

    case 'h':
      return hour * number

    case 'min':
      return min * number

    case 's':
      return number

    default:
      return 0
  }
}

const set: CookieManager['set'] = (
  keyName: string,
  value: any,
  options: Partial<CookieConfig> = {},
): void => {
  if (isSSR) return

  const currentConfig: Omit<CookieConfig, 'expires'> & {
    expires: string | CookieConfig['expires']
  } = {
    ...defaultConfig,
    ...options,
  }

  currentConfig.expires =
    currentConfig.expires instanceof Date
      ? currentConfig.expires.toUTCString()
      : typeof currentConfig.expires === 'string'
      ? timeString2Seconds(currentConfig.expires as TimeString)
      : currentConfig.expires

  let updatedCookie =
    encodeURIComponent(keyName) + '=' + encodeURIComponent(value)

  for (const optionKey in currentConfig) {
    const optionValue = currentConfig[optionKey]
    if (!optionValue) continue

    updatedCookie += '; ' + optionKey

    if (optionValue !== true) {
      updatedCookie += '=' + optionValue
    }
  }

  document.cookie = updatedCookie
}

const remove: CookieManager['remove'] = (keyName: string) => {
  set(keyName, '', { 'max-age': -1 })
}

export const useCookies = (): CookieManager => {
  return {
    config,
    get,
    set,
    remove,
  }
}
