import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { City } from 'src/models/city.model'
import { CreateCityDto } from '@art-touch/common/dist/dto/create-city.dto'
import { GetCityDto } from '@art-touch/common/dist/dto/get-city.dto'
import { CityAltName } from 'src/models/alt-names.model'
import { GetAltNamesDto } from 'src/dto/get-alt-name.dto'

@Injectable()
export class CitiesService {
  constructor(@InjectModel(City) private cityRepository: typeof City) {}

  async create(dto: CreateCityDto): Promise<GetCityDto> {
    try {
      const city = await this.cityRepository.create(dto)
      return {
        id: city.id,
        name: city.name,
        altNames: {},
      }
    } catch (error) {
      throw new HttpException(
        `City with name '${dto.name}' already exists`,
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async getById(cityId: number): Promise<GetCityDto> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      include: [CityAltName],
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
      altNames: city.altNames ? this.transformAltNames(city.altNames) : {},
    }
  }

  async getAll(): Promise<GetCityDto[]> {
    const cities = await this.cityRepository.findAll({ include: [CityAltName] })

    return cities.map(city => ({
      id: city.id,
      name: city.name,
      altNames: city.altNames ? this.transformAltNames(city.altNames) : {},
    }))
  }

  private transformAltNames(altNames: CityAltName[]) {
    return altNames.reduce((acc, { value, iso }) => {
      acc[iso] = value
      return acc
    }, {} as GetAltNamesDto)
  }
}
