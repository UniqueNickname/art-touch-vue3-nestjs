import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { University } from 'src/models/university.model'
import { UniversitiesService } from './universities.service'

@Module({
  imports: [SequelizeModule.forFeature([University])],
  providers: [UniversitiesService],
  exports: [UniversitiesService],
})
export class UniversitiesModule {}
