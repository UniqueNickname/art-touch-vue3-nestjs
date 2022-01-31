export interface TokenPayload {
  readonly id: string

  readonly fullName: string

  readonly role: 'admin' | 'jury' | 'participant'
}

export interface Tokens {
  access: string

  refresh: string
}

export type Role = TokenPayload['role'] | 'authorized' | 'unauthorized' | 'all'
