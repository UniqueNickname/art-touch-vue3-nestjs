import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { City } from 'src/models/city.model'
import { CreateCityDto } from '@art-touch/common/dist/dto/create-city.dto'
import { GetCityDto } from '@art-touch/common/dist/dto/get-city.dto'

@Injectable()
export class CitiesService {
  constructor(@InjectModel(City) private cityRepository: typeof City) {}

  async create(dto: CreateCityDto): Promise<GetCityDto> {
    const city = await this.cityRepository.create(dto)

    return {
      id: city.id,
      name: city.name,
    }
  }

  async getById(cityId: number): Promise<GetCityDto> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
    })

    if (!city) {
      throw new HttpException(
        `City with Id ${cityId} does not exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return {
      id: city.id,
      name: city.name,
    }
  }

  async getAll(): Promise<GetCityDto[]> {
    const cities = await this.cityRepository.findAll()

    return cities.map(city => ({
      id: city.id,
      name: city.name,
    }))
  }
}
