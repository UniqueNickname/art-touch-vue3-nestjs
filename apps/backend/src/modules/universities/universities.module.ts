import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { University } from 'src/models/university.model'

@Module({
  imports: [SequelizeModule.forFeature([University])],
})
export class UniversitiesModule {}
