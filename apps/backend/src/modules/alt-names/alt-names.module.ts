import { Module } from '@nestjs/common'
import { AltNamesService } from './alt-names.service'
import { AltNamesController } from './alt-names.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { CityAltName } from 'src/models/alt-names.model'

@Module({
  imports: [SequelizeModule.forFeature([CityAltName])],
  providers: [AltNamesService],
  controllers: [AltNamesController],
})
export class AltNamesModule {}
