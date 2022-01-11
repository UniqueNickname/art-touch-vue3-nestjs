import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript'
import { TeacherAltName } from './alt-names.model'
import { University } from './university.model'

interface TeacherCreationAttrs {
  name: string
  universityId: number
}

@Table({ tableName: 'teachers' })
export class Teacher extends Model<Teacher, TeacherCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING, allowNull: true })
  name: string

  @ForeignKey(() => University)
  @Column({ type: DataType.INTEGER })
  universityId: number

  @BelongsTo(() => University)
  university: University

  @HasMany(() => TeacherAltName)
  altNames: TeacherAltName[]
}
