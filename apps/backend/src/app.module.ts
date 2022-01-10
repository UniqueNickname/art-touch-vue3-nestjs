import { Module } from '@nestjs/common'
import { CitiesModule } from './modules/cities/cities.module'
import { DatabaseModule } from './modules/database/database.module'

@Module({
  imports: [DatabaseModule, CitiesModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
