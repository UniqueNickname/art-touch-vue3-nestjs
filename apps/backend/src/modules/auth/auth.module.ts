import { Module } from '@nestjs/common'
import { JuryModule } from './jury/jury.module'
import { ParticipantsModule } from './participants/participants.module'
import { AdminModule } from './admin/admin.module'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_KEY || '_34fhR/fhR3-',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    JuryModule,
    ParticipantsModule,
    AdminModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
