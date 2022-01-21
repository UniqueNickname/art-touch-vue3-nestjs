import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
} from 'sequelize-typescript'
import { Teacher } from './teacher.model'

interface UserCreationAttrs {
  email: string
  password: string
  fullName: string
}

interface ParticipantCreationAttrs extends UserCreationAttrs {
  phone: string
  teacherId: number
}

interface JuryCreationAttrs extends UserCreationAttrs {
  photo: string
}

type AdminAttrs = UserCreationAttrs

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

@Table({ tableName: 'jury' })
export class Jury extends Model<Jury, JuryCreationAttrs> {
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

  @Column({ type: DataType.STRING, allowNull: false })
  fullName: string

  @Column({ type: DataType.STRING, allowNull: false })
  photo: string
}

@Table({ tableName: 'admins' })
export class Admin extends Model<Admin, AdminAttrs> {
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

  @Column({ type: DataType.STRING, allowNull: false })
  fullName: string
}
