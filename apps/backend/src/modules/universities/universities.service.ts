import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { University } from 'src/models/university.model'
import { CreateUniversityDto } from '@art-touch/common/dist/dto/create-university.dto'
import { GetUniversityDto } from '@art-touch/common/dist/dto/get-university.dto'

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectModel(University) private universityRepository: typeof University,
  ) {}

  async create(dto: CreateUniversityDto): Promise<GetUniversityDto> {
    const university = await this.universityRepository.create(dto)

    return {
      id: university.id,
      cityId: university.cityId,
      name: university.name,
      altNames: {},
    }
  }

  async getAll(): Promise<GetUniversityDto[]> {
    const universities = await this.universityRepository.findAll()

    return universities.map(university => ({
      id: university.id,
      cityId: university.cityId,
      name: university.name,
      altNames: {},
    }))
  }

  async getById(universityId: number): Promise<GetUniversityDto> {
    const university = await this.universityRepository.findOne({
      where: { id: universityId },
    })

    if (!university) {
      throw new HttpException(
        `University with Id ${universityId} does not exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return {
      id: university.id,
      cityId: university.cityId,
      name: university.name,
      altNames: {},
    }
  }

  async getByCity(cityId: number): Promise<GetUniversityDto[]> {
    const universities = await this.universityRepository.findAll({
      where: { cityId },
    })

    if (!universities.length) {
      throw new HttpException(
        `Universities for city with Id ${cityId} does not exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return universities.map(university => ({
      id: university.id,
      cityId: university.cityId,
      name: university.name,
      altNames: {},
    }))
  }
}
