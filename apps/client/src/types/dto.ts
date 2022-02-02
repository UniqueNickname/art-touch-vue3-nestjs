import type { ISO } from 'src/types'

export type AltNamesObject = Partial<Record<ISO, string>>

export interface CreateAltNameDto {
  entityId: number
  iso: string
  value: string
}

export interface CreateCityDto {
  name: string
}

export interface GetCityDto {
  id: number
  name: string
  altNames: AltNamesObject
}
