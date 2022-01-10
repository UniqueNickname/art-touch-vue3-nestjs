import { Column, DataType, Model, Table } from 'sequelize-typescript'

interface CityCreationAttrs {
  name: string
}

@Table({ tableName: 'cities' })
export class City extends Model<City, CityCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  name: string
}
