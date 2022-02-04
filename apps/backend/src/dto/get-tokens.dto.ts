import type { Role } from 'src/types'
import { ApiProperty } from '@nestjs/swagger'

export class TokenPayload {
  @ApiProperty({
    example: 1,
    description: 'Id of the user',
    uniqueItems: true,
  })
  readonly id: string

  @ApiProperty({
    example: 'Paul Kreitman',
    description: 'Full name of the user',
  })
  readonly fullName: string

  @ApiProperty({
    example: 'Jury',
    description: 'Role of the user',
  })
  readonly role: Role
}

export class Tokens {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Access token',
    uniqueItems: true,
  })
  readonly access: string

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Id of a city',
    uniqueItems: true,
  })
  readonly refresh: string
}
