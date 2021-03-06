import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_KEY || '_34fhR/fhR3-',
    }),
  ],
  exports: [JwtModule],
})
export class JwtRegistrationModule {}
