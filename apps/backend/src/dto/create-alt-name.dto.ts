import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsEnum, MinLength } from 'class-validator'
import type { ISO } from 'src/types'

const isoEnum: Record<ISO, ISO> = {
  'en-US': 'en-US',
  'ru-RU': 'ru-RU',
}

export class CreateAltNameDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the main element',
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  readonly entityId: number

  @ApiProperty({
    example: 'ru-RU',
    description: 'ISO',
    enum: isoEnum,
  })
  @IsString()
  @IsEnum(isoEnum)
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
