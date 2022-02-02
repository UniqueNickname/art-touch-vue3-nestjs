import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail } from 'class-validator'

export class LoginUserDto {
  @ApiProperty({
    example: 'user@mail.ru',
    description: 'Email address',
    uniqueItems: true,
  })
  @IsString()
  @IsEmail()
  readonly email: string

  @ApiProperty({ example: '_ss23G*;J345-09_', description: 'Password' })
  @IsString()
  readonly password: string
}
