import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { initDefaultConfig } from './config'

async function bootstrap() {
  const PORT = process.env.PORT || 5000

  const app = await NestFactory.create(AppModule)

  const { docUrl } = await initDefaultConfig(app)

  await app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`
    Server: http://localhost:${PORT}

    Docs: http://localhost:${PORT}${docUrl}
    `)
  })
}
bootstrap()
