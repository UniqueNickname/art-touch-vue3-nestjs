import { ApiProperty } from '@nestjs/swagger'

export class GetJuryDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the city',
    uniqueItems: true,
  })
  readonly id: string

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Email',
    uniqueItems: true,
  })
  readonly email: string

  @ApiProperty({
    example: 'Paul Kreitman',
    description: 'Full name of the jury',
  })
  readonly fullName: string

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Link to image',
  })
  readonly photo: string
}
