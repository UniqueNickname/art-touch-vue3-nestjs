import { CreateUniversityDto } from '@art-touch/common/dist/dto/create-university.dto'
import { GetUniversityDto } from '@art-touch/common/dist/dto/get-university.dto'
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Version,
} from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UniversitiesService } from './universities.service'

@Controller('universities')
export class UniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @ApiOperation({ summary: 'Add a new university' })
  @ApiResponse({ status: HttpStatus.CREATED, type: GetUniversityDto })
  @Version('1')
  @Post()
  create(@Body() dto: CreateUniversityDto) {
    return this.universitiesService.create(dto)
  }

  @ApiOperation({ summary: 'Get all universities' })
  @ApiResponse({ status: HttpStatus.OK, type: [GetUniversityDto] })
  @Version('1')
  @Get()
  getAll() {
    return this.universitiesService.getAll()
  }

  @ApiOperation({ summary: 'Get universities in the city' })
  @ApiResponse({ status: HttpStatus.OK, type: [GetUniversityDto] })
  @Version('1')
  @Get('/by-city/:id')
  getByCity(@Param('id') value: string) {
    return this.universitiesService.getByCity(Number(value))
  }

  @ApiOperation({ summary: 'Get a university by id' })
  @ApiResponse({ status: HttpStatus.OK, type: [GetUniversityDto] })
  @Version('1')
  @Get('/:id')
  getById(@Param('id') cityId: string) {
    return this.universitiesService.getById(Number(cityId))
  }
}
