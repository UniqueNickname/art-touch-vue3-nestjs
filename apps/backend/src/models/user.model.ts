import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
} from 'sequelize-typescript'
import { Role } from '@art-touch/common/dist/enums/role.enum'
import { Teacher } from './teacher.model'

interface UserCreationAttrs {
  email: string
  password: string
  phone: string
  fullName: string
  role: Role
}

interface ParticipantCreationAttrs extends UserCreationAttrs {
  role: Role.participant
  teacherId: number
}

@Table({ tableName: 'participants' })
export class Participant extends Model<Participant, ParticipantCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string

  @Column({ type: DataType.STRING, allowNull: false })
  password: string

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  phone: string

  @Column({ type: DataType.STRING, allowNull: false })
  fullName: string

  @ForeignKey(() => Teacher)
  @Column({ type: DataType.INTEGER })
  teacherId: number

  @BelongsTo(() => Teacher)
  teacher: Teacher
}
