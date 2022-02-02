import { CreateUniversityDto } from 'src/dto/create-university.dto'
import { GetUniversityDto } from 'src/dto/get-university.dto'
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
import { RequireRole } from 'src/decorators/roles-auth.decorator'
import { RolesGuard } from 'src/guards/roles.guard'
import { UniversitiesService } from './universities.service'

@ApiTags('Universities')
@Controller('universities')
export class UniversitiesController {
  constructor(private universitiesService: UniversitiesService) {}

  @ApiOperation({ summary: `Add a new university (Only for admin)` })
  @ApiResponse({ status: HttpStatus.CREATED, type: GetUniversityDto })
  @Version('1')
  @RequireRole('admin')
  @UseGuards(RolesGuard)
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
