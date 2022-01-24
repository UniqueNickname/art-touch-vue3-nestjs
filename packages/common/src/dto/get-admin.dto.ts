import { ApiProperty } from '@nestjs/swagger'

export class GetAdminDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the admin',
    uniqueItems: true,
  })
  readonly id: string

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email',
    uniqueItems: true,
  })
  readonly email: string

  @ApiProperty({
    example: 'Paul Kreitman',
    description: 'Full name of the admin',
  })
  readonly fullName: string
}
