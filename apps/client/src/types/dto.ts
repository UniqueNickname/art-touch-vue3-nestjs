import type { ISO } from 'src/types'

export type AltNamesObject = Partial<Record<ISO, string>>

export type CreateAltNameDto = {
  entityId: number
  iso: string
  value: string
}

export type CreateCityDto = {
  name: string
}

export type GetCityDto = {
  id: number
  name: string
  altNames: AltNamesObject
}

export type CreateUniversityDto = {
  name: string
  cityId: number
}

export type GetUniversityDto = {
  id: number
  cityId: number
  name: string
  altNames: AltNamesObject
}

export type CreateTeacherDto = {
  name: string
  universityId: number
}

export type GetTeacherDto = {
  id: number
  universityId: number
  name: string
  altNames: AltNamesObject
}

export type LoginDto = {
  email: string
  password: string
}

export type CreateParticipantDto = {
  email: string
  password: string
  phone: string
  fullName: string
  teacherId: number
}
