import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as bcrypt from 'bcryptjs'
import { Admin } from './models/user.model'

const addDefaultAdmin = async () => {
  const admin = await Admin.findOne({
    where: { email: process.env.ADMIN_EMAIL },
  })

  if (admin) {
    return
  }

  await Admin.create({
    email: process.env.ADMIN_EMAIL || '',
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD || '', 10),
    fullName: process.env.ADMIN_FULLNAME || '',
  })
}

const addAppConfigs = (app: INestApplication) => {
  app.setGlobalPrefix('/api')
  app.enableVersioning({
    type: VersioningType.URI,
  })

  app.useGlobalPipes(new ValidationPipe())
}

const addSwaggerConfigs = (app: INestApplication): string => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Art touch')
    .setDescription('Art touch core service swagger')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  const docUrl = '/'
  SwaggerModule.setup(docUrl, app, document)

  return docUrl
}

export const initDefaultConfig = async (app: INestApplication) => {
  addAppConfigs(app)
  const docUrl = addSwaggerConfigs(app)
  await addDefaultAdmin()

  return {
    docUrl,
  }
}
