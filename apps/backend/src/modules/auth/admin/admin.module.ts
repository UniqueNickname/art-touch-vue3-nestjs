import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Admin } from 'src/models/user.model'
import { AdminService } from './admin.service'

@Module({
  imports: [SequelizeModule.forFeature([Admin])],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
