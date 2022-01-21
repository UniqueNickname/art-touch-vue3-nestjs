import { Module } from '@nestjs/common'
import { JuryModule } from './jury/jury.module'
import { ParticipantsModule } from './participants/participants.module'

@Module({
  imports: [JuryModule, ParticipantsModule],
})
export class AuthModule {}
