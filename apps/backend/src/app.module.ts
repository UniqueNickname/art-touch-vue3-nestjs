import { Module } from '@nestjs/common'
import { CitiesModule } from './modules/cities/cities.module'
import { DatabaseModule } from './modules/database/database.module'
import { AltNamesModule } from './modules/alt-names/alt-names.module'

@Module({
  imports: [DatabaseModule, CitiesModule, AltNamesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
