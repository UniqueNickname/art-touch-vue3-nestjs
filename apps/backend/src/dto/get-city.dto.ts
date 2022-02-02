import { ApiProperty } from '@nestjs/swagger'
import { GetAltNamesDto } from './get-alt-name.dto'

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

  @ApiProperty({
    example: {
      'ru-RU': 'Нью Йорк',
    },
    description: 'Alternative names of the city',
    uniqueItems: true,
  })
  readonly altNames: GetAltNamesDto
}
