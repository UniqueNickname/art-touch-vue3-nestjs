import { ApiProperty } from '@nestjs/swagger'
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import { City } from 'src/models/city.model'
import { University } from './university.model'
import { Teacher } from './teacher.model'

interface AltNamesCreationAttrs {
  entityId: number
  value: string
  iso: string
}

abstract class BaseAltName extends Model<BaseAltName, AltNamesCreationAttrs> {
  @ApiProperty({
    example: 1,
    description: 'Id of the alternative name',
    uniqueItems: true,
  })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @ApiProperty({
    example: 'ru-RU',
    description: 'ISO',
    uniqueItems: true,
  })
  @Column({ type: DataType.STRING, allowNull: false })
  iso: string

  @ApiProperty({
    example: 'Нью Йорк',
    description: 'Alternative name',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  value: string
}

@Table({ tableName: 'alt-names-city', createdAt: false, updatedAt: false })
export class CityAltName extends BaseAltName {
  @ApiProperty({
    example: 1,
    description: 'Id of the city',
    uniqueItems: true,
  })
  @ForeignKey(() => City)
  @Column({ type: DataType.INTEGER })
  entityId: number

  @BelongsTo(() => City)
  entity: City
}

@Table({
  tableName: 'alt-names-university',
  createdAt: false,
  updatedAt: false,
})
export class UniversityAltName extends BaseAltName {
  @ApiProperty({
    example: 1,
    description: 'Id of the university',
    uniqueItems: true,
  })
  @ForeignKey(() => University)
  @Column({ type: DataType.INTEGER })
  entityId: number

  @BelongsTo(() => University)
  entity: University
}

@Table({ tableName: 'alt-names-teacher', createdAt: false, updatedAt: false })
export class TeacherAltName extends BaseAltName {
  @ApiProperty({
    example: 1,
    description: 'Id of the professor',
    uniqueItems: true,
  })
  @ForeignKey(() => Teacher)
  @Column({ type: DataType.INTEGER })
  entityId: number

  @BelongsTo(() => Teacher)
  entity: Teacher
}
