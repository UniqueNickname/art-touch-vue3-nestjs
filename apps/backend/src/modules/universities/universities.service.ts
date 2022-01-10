import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { University } from 'src/models/university.model'
import { CreateUniversityDto } from '@art-touch/common/dist/dto/create-university.dto'
import { GetUniversityDto } from '@art-touch/common/dist/dto/get-university.dto'
import { CitiesService } from '../cities/cities.service'

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectModel(University) private universityRepository: typeof University,
    private citiesService: CitiesService,
  ) {}

  async create(dto: CreateUniversityDto): Promise<GetUniversityDto> {
    try {
      await this.citiesService.getById(dto.cityId)
    } catch (error) {
      throw new HttpException(
        `City with id '${dto.cityId}' does not exist`,
        HttpStatus.BAD_REQUEST,
      )
    }

    try {
      const university = await this.universityRepository.create(dto)
      return {
        id: university.id,
        cityId: university.cityId,
        name: university.name,
        altNames: {},
      }
    } catch (error) {
      throw new HttpException(
        `University with name '${dto.name}' already exist`,
        HttpStatus.BAD_REQUEST,
      )
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
