import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { CitiesModule } from 'src/modules/cities/cities.module'
import {
  HttpStatus,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common'
import { DatabaseModule } from 'src/modules/database/database.module'
import { CreateCityDto } from '@art-touch/common/dist/dto/create-city.dto'
import { GetCityDto } from '@art-touch/common/dist/dto/get-city.dto'
import { City } from 'src/models/city.model'
import { CityAltName, UniversityAltName } from 'src/models/alt-names.model'
import { ISO } from '@art-touch/common/dist/enums/iso.enum'
import { CreateAltNameDto } from '@art-touch/common/dist/dto/create-alt-name.dto'
import { AltNamesModule } from 'src/modules/alt-names/alt-names.module'
import { UniversitiesModule } from 'src/modules/universities/universities.module'
import { University } from 'src/models/university.model'
import { CreateUniversityDto } from '@art-touch/common/dist/dto/create-university.dto'
import { GetUniversityDto } from '@art-touch/common/dist/dto/get-university.dto'

describe('Backend', () => {
  let app: INestApplication

  const prepare = async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CitiesModule,
        UniversitiesModule,
        AltNamesModule,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    app.setGlobalPrefix('/api')
    app.enableVersioning({
      type: VersioningType.URI,
    })

    app.useGlobalPipes(new ValidationPipe())

    await app.init()
  }

  const end = async () => {
    await UniversityAltName.drop()
    await University.drop()
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

  const createUniversityDto: CreateUniversityDto = {
    name: 'Columbia University',
    cityId: getCityDtoFirst.id,
  }

  const getUniversityDto: GetUniversityDto = {
    id: 1,
    name: createUniversityDto.name,
    cityId: createUniversityDto.cityId,
    altNames: {},
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

    it(`/POST /api/v1/cities (with empty DTO)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/cities`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: [
            'name must be longer than or equal to 3 characters',
            'name must be a string',
          ],
          error: 'Bad Request',
        })
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

    it(`/POST /api/v1/cities/alt-names (with empty DTO)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/cities/alt-names`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: [
            'entityId must be a number conforming to the specified constraints',
            'iso must be longer than or equal to 5 characters',
            'iso must be a valid enum value',
            'iso must be a string',
            'value must be longer than or equal to 3 characters',
            'value must be a string',
          ],
          error: 'Bad Request',
        })
    })
  })

  describe('Universities', () => {
    it(`/GET /api/v1/universities (empty database)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/universities`)
        .expect(HttpStatus.OK)
        .expect([])
    })

    it(`/GET /api/v1/universities/2 (empty database)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/universities/2`)
        .expect(HttpStatus.NOT_FOUND)
    })

    it(`/POST /api/v1/universities`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/universities`)
        .send(createUniversityDto)
        .expect(HttpStatus.CREATED)
        .expect(getUniversityDto)
    })

    it(`/POST /api/v1/universities (with exist name)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/universities`)
        .send(createUniversityDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `University with name '${createUniversityDto.name}' already exist`,
        })
    })

    it(`/POST /api/v1/universities (for not exist city)`, () => {
      const cityId = 4

      return request(app.getHttpServer())
        .post(`/api/v1/universities`)
        .send(Object.assign(createUniversityDto, { cityId }))
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `City with id '${cityId}' does not exist`,
        })
    })

    it(`/GET /api/v1/universities (full database)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/universities`)
        .expect(HttpStatus.OK)
        .expect([getUniversityDto])
    })

    it(`/GET /api/v1/universities/${getUniversityDto.id} (full database)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/universities/${getUniversityDto.id}`)
        .expect(HttpStatus.OK)
        .expect(getUniversityDto)
    })

    it(`/POST /api/v1/universities (with empty DTO)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/universities`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: [
            'name must be longer than or equal to 6 characters',
            'name must be a string',
            'cityId must be a number conforming to the specified constraints',
          ],
          error: 'Bad Request',
        })
    })
  })

  afterAll(async () => {
    await end()
  })
})
