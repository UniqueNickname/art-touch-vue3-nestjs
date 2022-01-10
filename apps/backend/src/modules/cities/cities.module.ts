import { Module } from '@nestjs/common'
import { CitiesService } from './cities.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { City } from 'src/models/city.model'

@Module({
  imports: [SequelizeModule.forFeature([City])],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
