import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { CitiesModule } from 'src/modules/cities/cities.module'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { DatabaseModule } from 'src/modules/database/database.module'
import { CreateCityDto } from '@art-touch/common/dist/dto/create-city.dto'
import { GetCityDto } from '@art-touch/common/dist/dto/get-city.dto'
import { City } from 'src/models/city.model'
import {
  CityAltName,
  TeacherAltName,
  UniversityAltName,
} from 'src/models/alt-names.model'
import { ISO } from '@art-touch/common/dist/enums/iso.enum'
import { CreateAltNameDto } from '@art-touch/common/dist/dto/create-alt-name.dto'
import { AltNamesModule } from 'src/modules/alt-names/alt-names.module'
import { UniversitiesModule } from 'src/modules/universities/universities.module'
import { University } from 'src/models/university.model'
import { CreateUniversityDto } from '@art-touch/common/dist/dto/create-university.dto'
import { GetUniversityDto } from '@art-touch/common/dist/dto/get-university.dto'
import { Teacher } from 'src/models/teacher.model'
import { TeachersModule } from 'src/modules/teachers/teachers.module'
import { CreateTeacherDto } from '@art-touch/common/dist/dto/create-teacher.dto'
import { GetTeacherDto } from '@art-touch/common/dist/dto/get-teacher.dto'
import { Admin, Jury, Participant } from 'src/models/user.model'
import { FilesModule } from 'src/modules/files/files.module'
import { AuthModule } from 'src/modules/auth/auth.module'
import { initDefaultConfig } from 'src/config'
import { CreateAdminDto } from '@art-touch/common/dist/dto/create-admin.dto'

describe('Backend', () => {
  let app: INestApplication

  const prepare = async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CitiesModule,
        UniversitiesModule,
        TeachersModule,
        AltNamesModule,
        FilesModule,
        AuthModule,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    await initDefaultConfig(app)

    await app.init()
  }

  const end = async () => {
    await Participant.drop()
    await Jury.drop()
    await Admin.drop()
    await TeacherAltName.drop()
    await Teacher.drop()
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

  //+ City DTO
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

  //+ University DTO
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

  //+ Teacher DTO
  const createTeacherDto: CreateTeacherDto = {
    name: 'Nicholas Bartlett',
    universityId: getUniversityDto.id,
  }

  const getTeacherDto: GetTeacherDto = {
    id: 1,
    universityId: createTeacherDto.universityId,
    name: createTeacherDto.name,
    altNames: {},
  }

  let adminAccessToken: string

  describe('Auth Admin', () => {
    it('/POST /api/v1/auth/login (as default admin)', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/auth/login`)
        .send({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
        })
        .expect(HttpStatus.CREATED)

      adminAccessToken = response.text
    })

    it('/POST /api/v1/auth/registration/admin (with valid access token)', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/auth/registration/admin`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          email: 'example@mail.com',
          password: process.env.ADMIN_PASSWORD,
          fullName: process.env.ADMIN_FULLNAME,
        } as CreateAdminDto)
        .expect(HttpStatus.CREATED)
    })

    it('/POST /api/v1/auth/registration/admin (with valid access token & exist email)', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/auth/registration/admin`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          fullName: process.env.ADMIN_FULLNAME,
        } as CreateAdminDto)
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('/POST /api/v1/auth/registration/admin (without valid access token)', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/auth/registration/admin`)
        .send({
          email: 'example2@mail.com',
          password: process.env.ADMIN_PASSWORD,
          fullName: process.env.ADMIN_FULLNAME,
        } as CreateAdminDto)
        .expect(HttpStatus.UNAUTHORIZED)
    })
  })

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
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createCityDtoFirst)
        .expect(HttpStatus.CREATED)
        .expect(getCityDtoFirst)
    })

    it(`/POST /api/v1/cities (second)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/cities`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createCityDtoSecond)
        .expect(HttpStatus.CREATED)
        .expect(getCityDtoSecond)
    })

    it(`/POST /api/v1/cities (with exist name)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/cities`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
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
        .set('Authorization', `Bearer ${adminAccessToken}`)
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

    describe('Cities alt names', () => {
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

      const getCityDtoWithAltNames: GetCityDto = {
        id: getCityDtoFirst.id,
        name: getCityDtoFirst.name,
        altNames: {
          'ru-RU': createCityAltNameRu.value,
          'en-US': createCityAltNameEn.value,
        },
      }

      it(`/POST /api/v1/cities/alt-names (not admin)`, () => {
        return request(app.getHttpServer())
          .post(`/api/v1/cities/alt-names`)
          .send(createCityAltNameRu)
          .expect(HttpStatus.UNAUTHORIZED)
      })

      it(`/POST /api/v1/cities/alt-names (ru-RU)`, () => {
        return request(app.getHttpServer())
          .post(`/api/v1/cities/alt-names`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
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
          .set('Authorization', `Bearer ${adminAccessToken}`)
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
          .expect(getCityDtoWithAltNames)
      })

      it(`/POST /api/v1/cities/alt-names (for not exist city)`, () => {
        const entityId = 4
        return request(app.getHttpServer())
          .post(`/api/v1/cities/alt-names`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send({
            entityId,
            iso: createCityAltNameEn.iso,
            value: createCityAltNameEn.value,
          } as CreateAltNameDto)
          .expect(HttpStatus.BAD_REQUEST)
          .expect({
            statusCode: HttpStatus.BAD_REQUEST,
            message: `City with id '${entityId}' does not exist`,
          })
      })

      it(`/POST /api/v1/cities/alt-names (with empty DTO)`, () => {
        return request(app.getHttpServer())
          .post(`/api/v1/cities/alt-names`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
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
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createUniversityDto)
        .expect(HttpStatus.CREATED)
        .expect(getUniversityDto)
    })

    it(`/POST /api/v1/universities (with exist name)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/universities`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
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
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          cityId,
          name: createUniversityDto.name,
        } as CreateUniversityDto)
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

    it(`/GET universities by city id (for not exist city)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/universities/by-city/${7}`)
        .expect(HttpStatus.NOT_FOUND)
    })

    it(`/POST /api/v1/universities (with empty DTO)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/universities`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
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

    describe('Universities alt names', () => {
      const createUniversityAltNameRu: CreateAltNameDto = {
        entityId: getUniversityDto.id,
        iso: ISO.ru,
        value: 'Колумбийский университет',
      }

      const createUniversityAltNameEn: CreateAltNameDto = {
        entityId: getUniversityDto.id,
        iso: ISO.en,
        value: 'Columbia University',
      }

      const getUniversityWithAltNamesDto: GetUniversityDto = {
        id: getUniversityDto.id,
        name: getUniversityDto.name,
        cityId: getUniversityDto.cityId,
        altNames: {
          'ru-RU': createUniversityAltNameRu.value,
          'en-US': createUniversityAltNameEn.value,
        },
      }

      it(`/POST /api/v1/universities/alt-names (not admin)`, () => {
        return request(app.getHttpServer())
          .post(`/api/v1/universities/alt-names`)
          .send(createUniversityAltNameRu)
          .expect(HttpStatus.UNAUTHORIZED)
      })

      it(`/POST /api/v1/universities/alt-names (ru-RU)`, () => {
        return request(app.getHttpServer())
          .post(`/api/v1/universities/alt-names`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(createUniversityAltNameRu)
          .expect(HttpStatus.CREATED)
          .expect({
            id: 1,
            entityId: createUniversityAltNameRu.entityId,
            iso: createUniversityAltNameRu.iso,
            value: createUniversityAltNameRu.value,
          } as UniversityAltName)
      })

      it(`/POST /api/v1/universities/alt-names (en-US)`, () => {
        return request(app.getHttpServer())
          .post(`/api/v1/universities/alt-names`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(createUniversityAltNameEn)
          .expect(HttpStatus.CREATED)
          .expect({
            id: 2,
            entityId: createUniversityAltNameEn.entityId,
            iso: createUniversityAltNameEn.iso,
            value: createUniversityAltNameEn.value,
          } as UniversityAltName)
      })

      it(`/GET universities (with alt names)`, () => {
        return request(app.getHttpServer())
          .get(`/api/v1/universities`)
          .expect(HttpStatus.OK)
          .expect([getUniversityWithAltNamesDto])
      })

      it(`/GET universities by id (with alt names)`, () => {
        return request(app.getHttpServer())
          .get(`/api/v1/universities/${getUniversityDto.id}`)
          .expect(HttpStatus.OK)
          .expect(getUniversityWithAltNamesDto)
      })

      it(`/GET universities by city id (with alt names)`, () => {
        return request(app.getHttpServer())
          .get(`/api/v1/universities/by-city/${getUniversityDto.cityId}`)
          .expect(HttpStatus.OK)
          .expect([getUniversityWithAltNamesDto])
      })

      it(`/POST /api/v1/universities/alt-names (for not exist city)`, () => {
        const entityId = 4
        return request(app.getHttpServer())
          .post(`/api/v1/universities/alt-names`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send({
            entityId,
            iso: createUniversityAltNameEn.iso,
            value: createUniversityAltNameEn.value,
          } as CreateAltNameDto)
          .expect(HttpStatus.BAD_REQUEST)
          .expect({
            statusCode: HttpStatus.BAD_REQUEST,
            message: `University with id '${entityId}' does not exist`,
          })
      })

      it(`/POST /api/v1/universities/alt-names (with empty DTO)`, () => {
        return request(app.getHttpServer())
          .post(`/api/v1/universities/alt-names`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
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
  })

  describe('Teachers', () => {
    const getSameTeacherDto: GetTeacherDto = {
      id: 2,
      universityId: getTeacherDto.universityId,
      name: getTeacherDto.name,
      altNames: getTeacherDto.altNames,
    }

    it(`/GET /api/v1/teachers (empty database)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/teachers`)
        .expect(HttpStatus.OK)
        .expect([])
    })

    it(`/GET /api/v1/teachers/${getTeacherDto.id} (empty database)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/teachers/${getTeacherDto.id}`)
        .expect(HttpStatus.NOT_FOUND)
    })

    it(`/POST /api/v1/teachers`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/teachers`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createTeacherDto)
        .expect(HttpStatus.CREATED)
        .expect(getTeacherDto)
    })

    it(`/POST /api/v1/teachers (with exist name)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/teachers`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createTeacherDto)
        .expect(HttpStatus.CREATED)
        .expect(getSameTeacherDto)
    })

    it(`/POST /api/v1/teachers (with empty DTO)`, () => {
      return request(app.getHttpServer())
        .post(`/api/v1/teachers`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: [
            'name must be longer than or equal to 6 characters',
            'name must be a string',
            'universityId must be a number conforming to the specified constraints',
          ],
          error: 'Bad Request',
        })
    })

    it(`/GET /api/v1/teachers (full database)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/teachers`)
        .expect(HttpStatus.OK)
        .expect([getTeacherDto, getSameTeacherDto])
    })

    it(`/GET /api/v1/teachers/${getTeacherDto.id} (full database)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/teachers/${getTeacherDto.id}`)
        .expect(HttpStatus.OK)
        .expect(getTeacherDto)
    })

    it(`/GET /api/v1/teachers/by-university/${getTeacherDto.universityId} (full database)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/teachers/by-university/${getTeacherDto.universityId}`)
        .expect(HttpStatus.OK)
        .expect([getSameTeacherDto, getTeacherDto])
    })

    it(`/DELETE /api/v1/teachers/2`, () => {
      return request(app.getHttpServer())
        .delete(`/api/v1/teachers/2`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(HttpStatus.OK)
        .expect({})
    })

    it(`/GET /api/v1/teachers (after delete)`, () => {
      return request(app.getHttpServer())
        .get(`/api/v1/teachers`)
        .expect(HttpStatus.OK)
        .expect([getTeacherDto])
    })

    describe('Teachers alt names', () => {
      const createTeacherAltNameRu: CreateAltNameDto = {
        entityId: getTeacherDto.id,
        iso: ISO.ru,
        value: 'Николас Бартлет',
      }

      const createTeacherAltNameEn: CreateAltNameDto = {
        entityId: getTeacherDto.id,
        iso: ISO.en,
        value: 'Nicholas Bartlett',
      }

      const getTeacherWithAltNamesDto: GetTeacherDto = {
        id: getTeacherDto.id,
        name: getTeacherDto.name,
        universityId: getTeacherDto.universityId,
        altNames: {
          'ru-RU': createTeacherAltNameRu.value,
          'en-US': createTeacherAltNameEn.value,
        },
      }

      it(`/POST /api/v1/teachers/alt-names (not admin)`, () => {
        return request(app.getHttpServer())
          .post(`/api/v1/teachers/alt-names`)
          .send(createTeacherAltNameRu)
          .expect(HttpStatus.UNAUTHORIZED)
      })

      it(`/POST /api/v1/teachers/alt-names (ru-RU)`, () => {
        return request(app.getHttpServer())
          .post(`/api/v1/teachers/alt-names`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(createTeacherAltNameRu)
          .expect(HttpStatus.CREATED)
          .expect({
            id: 1,
            entityId: createTeacherAltNameRu.entityId,
            iso: createTeacherAltNameRu.iso,
            value: createTeacherAltNameRu.value,
          } as UniversityAltName)
      })

      it(`/POST /api/v1/teachers/alt-names (en-US)`, () => {
        return request(app.getHttpServer())
          .post(`/api/v1/teachers/alt-names`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(createTeacherAltNameEn)
          .expect(HttpStatus.CREATED)
          .expect({
            id: 2,
            entityId: createTeacherAltNameEn.entityId,
            iso: createTeacherAltNameEn.iso,
            value: createTeacherAltNameEn.value,
          } as UniversityAltName)
      })

      it(`/GET teachers/${getTeacherDto.id} (with alt names)`, () => {
        return request(app.getHttpServer())
          .get(`/api/v1/teachers/${getTeacherDto.id}`)
          .expect(HttpStatus.OK)
          .expect(getTeacherWithAltNamesDto)
      })

      it(`/GET teachers/by-university/${getTeacherDto.universityId} (with alt names)`, () => {
        return request(app.getHttpServer())
          .get(`/api/v1/teachers/by-university/${getTeacherDto.universityId}`)
          .expect(HttpStatus.OK)
          .expect([getTeacherWithAltNamesDto])
      })

      it(`/POST /api/v1/teachers/alt-names (for not exist university)`, () => {
        const entityId = 4
        return request(app.getHttpServer())
          .post(`/api/v1/teachers/alt-names`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send({
            entityId,
            iso: createTeacherAltNameEn.iso,
            value: createTeacherAltNameEn.value,
          } as CreateAltNameDto)
          .expect(HttpStatus.BAD_REQUEST)
          .expect({
            statusCode: HttpStatus.BAD_REQUEST,
            message: `Teacher with id '${entityId}' does not exist`,
          })
      })

      it(`/POST /api/v1/teachers/alt-names (with empty DTO)`, () => {
        return request(app.getHttpServer())
          .post(`/api/v1/teachers/alt-names`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
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
  })

  afterAll(async () => {
    await end()
  })
})
