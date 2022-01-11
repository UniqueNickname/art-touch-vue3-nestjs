import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  CityAltName,
  TeacherAltName,
  UniversityAltName,
} from 'src/models/alt-names.model'
import { City } from 'src/models/city.model'
import { Teacher } from 'src/models/teacher.model'
import { University } from 'src/models/university.model'
import { Participant } from 'src/models/user.model'

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
      models: [
        City,
        CityAltName,
        University,
        UniversityAltName,
        Teacher,
        TeacherAltName,
        Participant,
      ],
      autoLoadModels: true,
    }),
  ],
})
export class DatabaseModule {}
