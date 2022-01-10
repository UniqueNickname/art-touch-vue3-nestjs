import { ApiProperty } from '@nestjs/swagger'
import { ISO } from '../enums/iso.enum'

export class GetAltNamesDTO implements Record<ISO, string> {
  @ApiProperty({
    example: 'Нью Йорк',
    description: 'Name of the city for Russian',
    uniqueItems: true,
  })
  readonly 'ru-RU': string

  @ApiProperty({
    example: 'New York',
    description: 'Name of the city for United States',
    uniqueItems: true,
  })
  readonly 'en-US': string
}
