import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Participant } from 'src/models/user.model'

@Module({
  imports: [SequelizeModule.forFeature([Participant])],
})
export class ParticipantsModule {}
