import { Module } from '@nestjs/common'
import { JuryModule } from './jury/jury.module'
import { ParticipantsModule } from './participants/participants.module'
import { AdminModule } from './admin/admin.module'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtRegistrationModule } from './jwt/jwt-registrarion.module'

@Module({
  imports: [JwtRegistrationModule, JuryModule, ParticipantsModule, AdminModule],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
