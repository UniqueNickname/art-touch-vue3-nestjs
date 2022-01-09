import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const PORT = process.env.PORT || 5000

  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('/api')
  app.enableVersioning({
    type: VersioningType.URI,
  })

  await app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`
    Server: http://localhost:${PORT}
    `)
  })
}
bootstrap()
