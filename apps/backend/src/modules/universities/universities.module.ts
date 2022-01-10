import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { University } from 'src/models/university.model'
import { UniversitiesService } from './universities.service'
import { UniversitiesController } from './universities.controller'
import { CitiesModule } from '../cities/cities.module'

@Module({
  imports: [SequelizeModule.forFeature([University]), CitiesModule],
  providers: [UniversitiesService],
  exports: [UniversitiesService],
  controllers: [UniversitiesController],
})
export class UniversitiesModule {}
