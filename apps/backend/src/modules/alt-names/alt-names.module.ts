import { Module } from '@nestjs/common'
import { AltNamesService } from './alt-names.service'
import { AltNamesController } from './alt-names.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import {
  CityAltName,
  TeacherAltName,
  UniversityAltName,
} from 'src/models/alt-names.model'
import { CitiesModule } from '../cities/cities.module'
import { UniversitiesModule } from '../universities/universities.module'
import { TeachersModule } from '../teachers/teachers.module'

@Module({
  imports: [
    SequelizeModule.forFeature([
      CityAltName,
      UniversityAltName,
      TeacherAltName,
    ]),
    CitiesModule,
    UniversitiesModule,
    TeachersModule,
  ],
  providers: [AltNamesService],
  controllers: [AltNamesController],
  exports: [AltNamesService],
})
export class AltNamesModule {}
