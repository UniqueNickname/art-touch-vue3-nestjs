export type ISO = 'en-US' | 'ru-RU'

export type Role = 'admin' | 'jury' | 'participant'

export type User = {
  id: string
  fullName: string
  role: Role
}

export type Tokens = {
  access: string
  refresh: string
}

export type AccessType = Role | 'authorized' | 'unauthorized' | 'all'
