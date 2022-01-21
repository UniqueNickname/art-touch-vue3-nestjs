import { Module } from '@nestjs/common'
import { JuryModule } from './jury/jury.module'
import { ParticipantsModule } from './participants/participants.module'
import { AdminModule } from './admin/admin.module'

@Module({
  imports: [JuryModule, ParticipantsModule, AdminModule],
})
export class AuthModule {}
