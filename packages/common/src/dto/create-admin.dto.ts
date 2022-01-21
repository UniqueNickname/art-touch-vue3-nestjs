import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class CreateAdminDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email',
    uniqueItems: true,
  })
  @IsString()
  @IsEmail()
  readonly email: string

  @ApiProperty({ example: '_ss23G*;J345-09_', description: 'Password' })
  @IsString()
  @MinLength(8)
  readonly password: string

  @ApiProperty({
    example: 'Paul Kreitman',
    description: 'Full name of the user',
  })
  @IsString()
  @MinLength(8)
  readonly fullName: string
}
