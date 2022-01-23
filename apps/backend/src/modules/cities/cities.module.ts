import { Module } from '@nestjs/common'
import { CitiesService } from './cities.service'
import { CitiesController } from './cities.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { City } from 'src/models/city.model'
import { JwtRegistrationModule } from '../auth/jwt/jwt-registrarion.module'

@Module({
  imports: [SequelizeModule.forFeature([City]), JwtRegistrationModule],
  providers: [CitiesService],
  controllers: [CitiesController],
  exports: [CitiesService],
})
export class CitiesModule {}
