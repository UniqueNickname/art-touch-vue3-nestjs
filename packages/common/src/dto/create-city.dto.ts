import { ApiProperty } from '@nestjs/swagger'

export class CreateCityDto {
  @ApiProperty({
    example: 'New York',
    description: 'Name of the city',
    uniqueItems: true,
  })
  readonly name: string
}
