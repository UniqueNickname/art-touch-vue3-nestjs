import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Jury } from 'src/models/user.model'
import { JuryService } from './jury.service'
import { FilesModule } from 'src/modules/files/files.module'

@Module({
  imports: [SequelizeModule.forFeature([Jury]), FilesModule],
  providers: [JuryService],
  exports: [JuryService],
})
export class JuryModule {}
