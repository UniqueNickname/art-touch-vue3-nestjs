import { Module } from '@nestjs/common'
import { JuryModule } from './jury/jury.module'

@Module({
  imports: [JuryModule],
})
export class AuthModule {}
