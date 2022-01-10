import { Module } from '@nestjs/common'
import { AltNamesService } from './alt-names.service'
import { AltNamesController } from './alt-names.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { CityAltName } from 'src/models/alt-names.model'
import { CitiesModule } from '../cities/cities.module'

@Module({
  imports: [SequelizeModule.forFeature([CityAltName]), CitiesModule],
  providers: [AltNamesService],
  controllers: [AltNamesController],
  exports: [AltNamesService],
})
export class AltNamesModule {}
