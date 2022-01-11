import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Teacher } from 'src/models/teacher.model'
import { TeachersService } from './teachers.service'
import { UniversitiesModule } from '../universities/universities.module'

@Module({
  imports: [SequelizeModule.forFeature([Teacher]), UniversitiesModule],
  providers: [TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
