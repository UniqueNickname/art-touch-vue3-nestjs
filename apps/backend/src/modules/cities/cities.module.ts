import { Module } from '@nestjs/common'
import { CitiesService } from './cities.service'
import { CitiesController } from './cities.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { City } from 'src/models/city.model'

@Module({
  imports: [SequelizeModule.forFeature([City])],
  providers: [CitiesService],
  controllers: [CitiesController],
  exports: [CitiesService],
})
export class CitiesModule {}
