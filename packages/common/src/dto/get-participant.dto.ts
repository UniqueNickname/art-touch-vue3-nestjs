import { ApiProperty } from '@nestjs/swagger'

export class GetParticipantDto {
  @ApiProperty({
    example: 1,
    description: 'Id of the participant',
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
    example: '+79998882233',
    description: 'Phone number',
    uniqueItems: true,
  })
  readonly phone: string

  @ApiProperty({
    example: 'Paul Kreitman',
    description: 'Full name of the participant',
  })
  readonly fullName: string

  @ApiProperty({
    example: 1,
    description: 'Id of a teacher',
  })
  readonly teacherId: number
}
