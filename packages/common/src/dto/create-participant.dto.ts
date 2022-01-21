import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator'
import { IsPhoneNumber } from '../validators/IsPhoneNumber.validator'

export class CreateParticipantDto {
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
    example: '+79998882233',
    description: 'Phone number',
    uniqueItems: true,
  })
  @IsString()
  @IsPhoneNumber()
  readonly phone: string

  @ApiProperty({
    example: 'Paul Kreitman',
    description: 'Full name of the user',
  })
  @IsString()
  @MinLength(8)
  readonly fullName: string

  @ApiProperty({
    example: 1,
    description: 'Id of a teacher',
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  readonly teacherId: number
}
