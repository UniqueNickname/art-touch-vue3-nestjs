import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CityAltName, UniversityAltName } from 'src/models/alt-names.model'
import { CreateAltNameDto } from '@art-touch/common/dist/dto/create-alt-name.dto'
import { CitiesService } from 'src/modules/cities/cities.service'
import { UniversitiesService } from '../universities/universities.service'

@Injectable()
export class AltNamesService {
  constructor(
    @InjectModel(CityAltName)
    private cityAltNameRepository: typeof CityAltName,
    private citiesService: CitiesService,
    @InjectModel(UniversityAltName)
    private universityAltNameRepository: typeof UniversityAltName,
    private universitiesService: UniversitiesService,
  ) {}

  async createCityName(dto: CreateAltNameDto) {
    try {
      await this.citiesService.getById(dto.entityId)
    } catch (error) {
      throw new HttpException(
        `City with id '${dto.entityId}' does not exist`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const altName = await this.cityAltNameRepository.create(dto)

    return altName
  }

  async createUniversityName(dto: CreateAltNameDto) {
    try {
      await this.universitiesService.getById(dto.entityId)
    } catch (error) {
      throw new HttpException(
        `University with id '${dto.entityId}' does not exist`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const altName = await this.universityAltNameRepository.create(dto)

    return altName
  }
}
