import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Teacher } from 'src/models/teacher.model'
import { TeachersService } from './teachers.service'
import { TeachersController } from './teachers.controller'
import { UniversitiesModule } from '../universities/universities.module'
import { JwtRegistrationModule } from '../auth/jwt/jwt-registrarion.module'

@Module({
  imports: [
    SequelizeModule.forFeature([Teacher]),
    JwtRegistrationModule,
    UniversitiesModule,
  ],
  providers: [TeachersService],
  exports: [TeachersService],
  controllers: [TeachersController],
})
export class TeachersModule {}
