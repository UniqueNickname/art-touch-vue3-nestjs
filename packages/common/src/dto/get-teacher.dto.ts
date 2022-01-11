import { ApiProperty } from '@nestjs/swagger'
import { GetAltNamesDTO } from './get-alt-name.dto'

export class GetTeacherDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the teacher',
    uniqueItems: true,
  })
  readonly id: number

  @ApiProperty({
    example: 1,
    description: 'Id of a university',
    uniqueItems: true,
  })
  readonly universityId: number

  @ApiProperty({
    example: 'Nicholas Bartlett',
    description: 'Full name of the teacher',
  })
  readonly name: string

  @ApiProperty({
    example: {
      'ru-ru': 'Николас Бартлет',
    },
    description: 'Alternative names of the teacher',
    uniqueItems: true,
  })
  readonly altNames: GetAltNamesDTO
}
