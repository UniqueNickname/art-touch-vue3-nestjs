import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class CreateCityDto {
  @ApiProperty({
    example: 'New York',
    description: 'Name of the city',
    uniqueItems: true,
  })
  @IsString()
  @MinLength(3)
  readonly name: string
}
