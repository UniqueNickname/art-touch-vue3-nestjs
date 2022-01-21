import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Participant } from 'src/models/user.model'
import { ParticipantsService } from './participants.service'

@Module({
  imports: [SequelizeModule.forFeature([Participant])],
  providers: [ParticipantsService],
  exports: [ParticipantsService],
})
export class ParticipantsModule {}
