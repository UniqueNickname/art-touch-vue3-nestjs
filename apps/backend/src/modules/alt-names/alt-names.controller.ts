import { CreateAltNameDto } from '@art-touch/common/dist/dto/create-alt-name.dto'
import { Body, Controller, HttpStatus, Post, Version } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CityAltName } from 'src/models/alt-names.model'
import { AltNamesService } from './alt-names.service'

@Controller()
export class AltNamesController {
  constructor(private altNamesService: AltNamesService) {}

  @ApiTags('Cities')
  @ApiOperation({ summary: 'Add alternative name of the city' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CityAltName })
  @Version('1')
  @Post('/cities/alt-names')
  createCityName(@Body() dto: CreateAltNameDto) {
    return this.altNamesService.createCityName(dto)
  }
}
