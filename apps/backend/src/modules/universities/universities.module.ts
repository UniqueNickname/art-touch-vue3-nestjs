import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { University } from 'src/models/university.model'
import { UniversitiesService } from './universities.service'
import { UniversitiesController } from './universities.controller'

@Module({
  imports: [SequelizeModule.forFeature([University])],
  providers: [UniversitiesService],
  exports: [UniversitiesService],
  controllers: [UniversitiesController],
})
export class UniversitiesModule {}
