declare type Role = 'admin' | 'jury' | 'participant'

declare interface TokenPayload {
  id: string
  fullName: string
  role: Role
}

declare interface Tokens {
  access: string
  refresh: string
}

declare type AccessType = Role | 'authorized' | 'unauthorized' | 'all'
