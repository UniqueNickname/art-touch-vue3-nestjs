import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { University } from 'src/models/university.model'
import { UniversitiesService } from './universities.service'
import { UniversitiesController } from './universities.controller'
import { CitiesModule } from '../cities/cities.module'
import { JwtRegistrationModule } from '../auth/jwt/jwt-registrarion.module'

@Module({
  imports: [
    SequelizeModule.forFeature([University]),
    JwtRegistrationModule,
    CitiesModule,
  ],
  providers: [UniversitiesService],
  exports: [UniversitiesService],
  controllers: [UniversitiesController],
})
export class UniversitiesModule {}
