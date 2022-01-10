import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { CityAltName, UniversityAltName } from 'src/models/alt-names.model'
import { City } from 'src/models/city.model'
import { University } from 'src/models/university.model'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [City, CityAltName, University, UniversityAltName],
      autoLoadModels: true,
    }),
  ],
})
export class DatabaseModule {}
