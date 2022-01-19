import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as path from 'path'
import { FilesService } from './files.service'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '../../static'),
    }),
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
