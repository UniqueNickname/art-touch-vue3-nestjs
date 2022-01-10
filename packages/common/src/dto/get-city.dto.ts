import { ApiProperty } from '@nestjs/swagger'

export class GetCityDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the city',
    uniqueItems: true,
  })
  readonly id: number

  @ApiProperty({
    example: 'New York',
    description: 'Name of the city',
    uniqueItems: true,
  })
  readonly name: string
}
