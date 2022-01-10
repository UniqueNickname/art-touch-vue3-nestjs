import { ApiProperty } from '@nestjs/swagger'
import { ISO } from '../enums/iso.enum'

export class GetAltNamesDTO implements Partial<Record<ISO, string>> {
  @ApiProperty({
    example: 'Нью Йорк',
    description: 'Name of the city for Russian',
    uniqueItems: true,
  })
  'ru-RU'?: string

  @ApiProperty({
    example: 'New York',
    description: 'Name of the city for United States',
    uniqueItems: true,
  })
  'en-US'?: string
}
