import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { CitiesModule } from 'src/modules/cities/cities.module'
import { HttpStatus, INestApplication, VersioningType } from '@nestjs/common'
import { DatabaseModule } from 'src/modules/database/database.module'
import { CreateCityDto } from '@art-touch/common/dist/dto/create-city.dto'
import { GetCityDto } from '@art-touch/common/dist/dto/get-city.dto'
import { City } from 'src/models/city.model'
import { CityAltName } from 'src/models/alt-names.model'
import { ISO } from '@art-touch/common/dist/enums/iso.enum'
import { CreateAltNameDto } from '@art-touch/common/dist/dto/create-alt-name.dto'
import { AltNamesModule } from 'src/modules/alt-names/alt-names.module'

describe('App', () => {
  let app: INestApplication

  const prepare = async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, CitiesModule, AltNamesModule],
    }).compile()

    app = moduleRef.createNestApplication()

    app.setGlobalPrefix('/api')
    app.enableVersioning({
      type: VersioningType.URI,
    })

    await app.init()
  }

  const end = async () => {
    await CityAltName.drop()
    await City.drop()
    await app.close()
  }

  const clearDatabase = async () => {
    await prepare()
    await end()
  }

  beforeAll(async () => {
    await clearDatabase()
    await prepare()
  })

  const createCityDtoFirst: CreateCityDto = {
    name: 'New York',
  }

  const createCityDtoSecond: CreateCityDto = {
    name: 'Los Angeles',
  }

  const getCityDtoFirst: GetCityDto = {
    id: 1,
    name: createCityDtoFirst.name,
    altNames: {},
  }

  const getCityDtoSecond: GetCityDto = {
    id: 2,
    name: createCityDtoSecond.name,
    altNames: {},
  }

  const createCityAltNameRu: CreateAltNameDto = {
    entityId: getCityDtoFirst.id,
    iso: ISO.ru,
    value: 'Нью Йорк',
  }

  const createCityAltNameEn: CreateAltNameDto = {
    entityId: getCityDtoFirst.id,
    iso: ISO.en,
    value: 'New York',
  }

  describe('Cities', () => {
    it(`/GET /api/v1/cities (empty database)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/cities`)
        .expect(HttpStatus.OK)
        .expect([])
    })

    it(`/GET /api/v1/cities/2 (empty database)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/cities/2`)
        .expect(HttpStatus.NOT_FOUND)
    })

    it(`/POST /api/v1/cities (first)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/cities`)
        .send(createCityDtoFirst)
        .expect(HttpStatus.CREATED)
        .expect(getCityDtoFirst)
    })

    it(`/POST /api/v1/cities (second)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/cities`)
        .send(createCityDtoSecond)
        .expect(HttpStatus.CREATED)
        .expect(getCityDtoSecond)
    })

    it(`/POST /api/v1/cities (with exist name)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/cities`)
        .send(createCityDtoSecond)
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `City with name '${createCityDtoSecond.name}' already exists`,
        })
    })

    it(`/GET /api/v1/cities (full database)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/cities`)
        .expect(HttpStatus.OK)
        .expect([getCityDtoFirst, getCityDtoSecond])
    })

    it(`/GET /api/v1/cities/${getCityDtoFirst.id} (full database)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/cities/${getCityDtoFirst.id}`)
        .expect(HttpStatus.OK)
        .expect(getCityDtoFirst)
    })
  })

  describe('Cities alt names', () => {
    it(`/POST /api/v1/cities/alt-names (ru-RU)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/cities/alt-names`)
        .send(createCityAltNameRu)
        .expect(HttpStatus.CREATED)
        .expect({
          id: 1,
          entityId: createCityAltNameRu.entityId,
          iso: createCityAltNameRu.iso,
          value: createCityAltNameRu.value,
        } as CityAltName)
    })

    it(`/POST /api/v1/cities/alt-names (en-US)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/cities/alt-names`)
        .send(createCityAltNameEn)
        .expect(HttpStatus.CREATED)
        .expect({
          id: 2,
          entityId: createCityAltNameEn.entityId,
          iso: createCityAltNameEn.iso,
          value: createCityAltNameEn.value,
        } as CityAltName)
    })

    it(`/GET city by id (with alt names)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/cities/${getCityDtoFirst.id}`)
        .expect(HttpStatus.OK)
        .expect(
          Object.assign(getCityDtoFirst, {
            altNames: {
              'ru-RU': createCityAltNameRu.value,
              'en-US': createCityAltNameEn.value,
            },
          }),
        )
    })

    it(`/POST /api/v1/cities/alt-names (for not exist city)`, () => {
      const entityId = 4
      return request(app.getHttpServer())
        .post(`/api/v1/cities/alt-names`)
        .send(Object.assign(createCityAltNameEn, { entityId }))
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `City with id '${entityId}' does not exist`,
        })
    })
  })

  afterAll(async () => {
    await end()
  })
})
