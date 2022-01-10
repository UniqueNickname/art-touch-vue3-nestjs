import { Module } from '@nestjs/common'
import { AltNamesService } from './alt-names.service'
import { AltNamesController } from './alt-names.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { CityAltName, UniversityAltName } from 'src/models/alt-names.model'
import { CitiesModule } from '../cities/cities.module'
import { UniversitiesModule } from '../universities/universities.module'

@Module({
  imports: [
    SequelizeModule.forFeature([CityAltName, UniversityAltName]),
    CitiesModule,
    UniversitiesModule,
  ],
  providers: [AltNamesService],
  controllers: [AltNamesController],
  exports: [AltNamesService],
})
export class AltNamesModule {}
