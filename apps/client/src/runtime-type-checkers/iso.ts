import type { ISO } from 'src/types'

const availableISO = ['en-US', 'ru-RU']

export const checkISOType = (string: string): boolean =>
  availableISO.includes(string)

export const getValidISO = (string: string, defaultISO: ISO = 'en-US'): ISO =>
  checkISOType(string) ? (string as ISO) : defaultISO
