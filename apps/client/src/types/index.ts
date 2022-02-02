export type Role = 'admin' | 'jury' | 'participant'

export interface TokenPayload {
  id: string
  fullName: string
  role: Role
}

export interface Tokens {
  access: string
  refresh: string
}

export type AccessType = Role | 'authorized' | 'unauthorized' | 'all'
