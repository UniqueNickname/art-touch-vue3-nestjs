import type { ISO } from 'src/types'

const availableISO = ['en-US', 'ru-RU']

export const checkISOType = (value: unknown): boolean => {
  if (typeof value !== 'string') return false
  return availableISO.includes(value)
}

export const getValidISO = (value: unknown, defaultISO: ISO = 'en-US'): ISO =>
  checkISOType(value) ? (value as ISO) : defaultISO
