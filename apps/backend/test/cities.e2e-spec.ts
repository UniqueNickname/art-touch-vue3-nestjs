import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { CitiesModule } from 'src/modules/cities/cities.module'
import { HttpStatus, INestApplication, VersioningType } from '@nestjs/common'
import { DatabaseModule } from 'src/modules/database/database.module'
import { CreateCityDto } from '@art-touch/common/dist/dto/create-city.dto'
import { GetCityDto } from '@art-touch/common/dist/dto/get-city.dto'
import { City } from 'src/models/city.model'

describe('Cities', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, CitiesModule],
    }).compile()

    app = moduleRef.createNestApplication()

    app.setGlobalPrefix('/api')
    app.enableVersioning({
      type: VersioningType.URI,
    })

    await app.init()
  })

  const createDtoFirst: CreateCityDto = {
    name: 'New York',
  }

  const createDtoSecond: CreateCityDto = {
    name: 'Los Angeles',
  }

  const getDtoFirst: GetCityDto = {
    id: 1,
    name: createDtoFirst.name,
    altNames: {},
  }
  const getDtoSecond: GetCityDto = {
    id: 2,
    name: createDtoSecond.name,
    altNames: {},
  }

  it(`/GET cities (empty database)`, () => {
    return request(app.getHttpServer())
      .get(`/api/v1/cities`)
      .expect(HttpStatus.OK)
      .expect([])
  })

  it(`/GET city by id (empty database)`, () => {
    return request(app.getHttpServer())
      .get(`/api/v1/cities/2`)
      .expect(HttpStatus.NOT_FOUND)
  })

  it(`/Post cities (first)`, () => {
    return request(app.getHttpServer())
      .post(`/api/v1/cities`)
      .send(createDtoFirst)
      .expect(HttpStatus.CREATED)
      .expect(getDtoFirst)
  })

  it(`/Post cities (second)`, () => {
    return request(app.getHttpServer())
      .post(`/api/v1/cities`)
      .send(createDtoSecond)
      .expect(HttpStatus.CREATED)
      .expect(getDtoSecond)
  })

  it(`/Post cities (with exist name)`, () => {
    return request(app.getHttpServer())
      .post(`/api/v1/cities`)
      .send(createDtoSecond)
      .expect(HttpStatus.BAD_REQUEST)
      .expect({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `City with name '${createDtoSecond.name}' already exists`,
      })
  })

  it(`/GET cities (full database)`, () => {
    return request(app.getHttpServer())
      .get(`/api/v1/cities`)
      .expect(HttpStatus.OK)
      .expect([getDtoFirst, getDtoSecond])
  })

  it(`/GET city by id (full database)`, () => {
    return request(app.getHttpServer())
      .get(`/api/v1/cities/2`)
      .expect(HttpStatus.OK)
      .expect(getDtoSecond)
  })

  afterAll(async () => {
    await City.drop()
    await app.close()
  })
})
