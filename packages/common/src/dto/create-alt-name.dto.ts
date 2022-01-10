import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsEnum, MinLength } from 'class-validator'
import { ISO } from '../enums/iso.enum'

export class CreateAltNameDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the main element',
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  readonly entityId: number

  @ApiProperty({
    example: ISO.ru,
    description: 'ISO',
    enum: ISO,
  })
  @IsString()
  @IsEnum(ISO)
  @MinLength(5)
  readonly iso: ISO

  @ApiProperty({
    example: 'Нью Йорк',
    description: 'Alternative name',
  })
  @IsString()
  @MinLength(3)
  readonly value: string
}
