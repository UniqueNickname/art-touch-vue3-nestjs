import { Module } from '@nestjs/common'
import { CitiesModule } from './modules/cities/cities.module'
import { DatabaseModule } from './modules/database/database.module'
import { AltNamesModule } from './modules/alt-names/alt-names.module'
import { UniversitiesModule } from './modules/universities/universities.module'

@Module({
  imports: [DatabaseModule, CitiesModule, AltNamesModule, UniversitiesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
