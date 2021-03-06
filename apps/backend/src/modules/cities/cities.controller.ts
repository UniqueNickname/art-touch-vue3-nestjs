import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CitiesService } from './cities.service'
import { CreateCityDto } from 'src/dto/create-city.dto'
import { GetCityDto } from 'src/dto/get-city.dto'
import { RequireRole } from 'src/decorators/roles-auth.decorator'
import { RolesGuard } from 'src/guards/roles.guard'

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @ApiOperation({ summary: `Add a new city (Only for )` })
  @ApiResponse({ status: HttpStatus.CREATED, type: GetCityDto })
  @Version('1')
  @RequireRole('admin')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateCityDto) {
    return this.citiesService.create(dto)
  }

  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: HttpStatus.OK, type: [GetCityDto] })
  @Version('1')
  @Get()
  getAll() {
    return this.citiesService.getAll()
  }

  @ApiOperation({ summary: 'Get a city by id' })
  @ApiResponse({ status: HttpStatus.OK, type: [GetCityDto] })
  @Version('1')
  @Get('/:id')
  getById(@Param('id') cityId: string) {
    return this.citiesService.getById(Number(cityId))
  }
}
