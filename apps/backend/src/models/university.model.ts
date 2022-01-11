import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript'
import { UniversityAltName } from './alt-names.model'
import { City } from './city.model'
import { Teacher } from './teacher.model'

interface UniversityCreationAttrs {
  name: string
  cityId: number
}

@Table({ tableName: 'universities' })
export class University extends Model<University, UniversityCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  name: string

  @ForeignKey(() => City)
  @Column({ type: DataType.INTEGER })
  cityId: number

  @BelongsTo(() => City)
  city: City

  @HasMany(() => Teacher)
  universities: Teacher[]

  @HasMany(() => UniversityAltName)
  altNames: UniversityAltName[]
}
