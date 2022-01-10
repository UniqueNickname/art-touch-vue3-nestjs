import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const PORT = process.env.PORT || 5000

  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('/api')
  app.enableVersioning({
    type: VersioningType.URI,
  })

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Art touch')
    .setDescription('Art touch core service swagger')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  const docUrl = '/'
  SwaggerModule.setup(docUrl, app, document)

  await app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`
    Server: http://localhost:${PORT}

    Docs: http://localhost:${PORT}${docUrl}
    `)
  })
}
bootstrap()
