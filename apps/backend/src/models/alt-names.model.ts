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
import { ISO } from '@art-touch/common/dist/enums/iso.enum'

interface AltNamesCreationAttrs {
  entityId: number
  value: string
  iso: ISO
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
    example: ISO.ru,
    description: 'ISO',
    uniqueItems: true,
  })
  @Column({ type: DataType.STRING, allowNull: false })
  iso: ISO

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
