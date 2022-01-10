import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CityAltName } from 'src/models/alt-names.model'
import { CreateAltNameDto } from '@art-touch/common/dist/dto/create-alt-name.dto'

@Injectable()
export class AltNamesService {
  constructor(
    @InjectModel(CityAltName)
    private CityAltNameRepository: typeof CityAltName,
  ) {}

  async createCityName(dto: CreateAltNameDto) {
    const altName = await this.CityAltNameRepository.create(dto)
    return altName
  }
}
