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

export interface CreateUniversityDto {
  name: string
  cityId: number
}

export interface GetUniversityDto {
  id: number
  cityId: number
  name: string
  altNames: AltNamesObject
}
