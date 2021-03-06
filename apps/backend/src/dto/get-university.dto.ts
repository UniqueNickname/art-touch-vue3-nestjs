import { ApiProperty } from '@nestjs/swagger'
import { GetAltNamesDto } from './get-alt-name.dto'

export class GetUniversityDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the university',
    uniqueItems: true,
  })
  readonly id: number

  @ApiProperty({
    example: 1,
    description: 'Id of a city',
    uniqueItems: true,
  })
  readonly cityId: number

  @ApiProperty({
    example: 'Columbia University',
    description: 'Name of the university',
    uniqueItems: true,
  })
  readonly name: string

  @ApiProperty({
    example: {
      'ru-Ru': 'Колумбийский университет',
    },
    description: 'Alternative names of the university',
    uniqueItems: true,
  })
  readonly altNames: GetAltNamesDto
}
