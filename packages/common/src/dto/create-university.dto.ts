import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, MinLength } from 'class-validator'

export class CreateUniversityDto {
  @ApiProperty({
    example: 'Columbia University',
    description: 'Name of the university',
    uniqueItems: true,
  })
  @IsString()
  @MinLength(6)
  readonly name: string

  @ApiProperty({
    example: 1,
    description: 'Id of a city',
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  readonly cityId: number
}
