import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, MinLength } from 'class-validator'

export class CreateTeacherDto {
  @ApiProperty({
    example: 'Nicholas Bartlett',
    description: 'Full name of the teacher',
  })
  @IsString()
  @MinLength(6)
  readonly name: string

  @ApiProperty({
    example: 1,
    description: 'Id of a university',
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  readonly universityId: number
}
