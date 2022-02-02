import { CreateTeacherDto } from 'src/dto/create-teacher.dto'
import { GetTeacherDto } from '@art-touch/common/dist/dto/get-teacher.dto'
import {
  Body,
  Controller,
  Delete,
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
import { TeachersService } from './teachers.service'

@ApiTags('Teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private teachersService: TeachersService) {}

  @ApiOperation({ summary: `Add a new teacher (Only for admin)` })
  @ApiResponse({ status: HttpStatus.CREATED, type: GetTeacherDto })
  @Version('1')
  @RequireRole('admin')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateTeacherDto) {
    return this.teachersService.create(dto)
  }

  @ApiOperation({ summary: `Delete teacher by id (Only for admin)` })
  @ApiResponse({ status: HttpStatus.OK, type: [GetTeacherDto] })
  @Version('1')
  @RequireRole('admin')
  @UseGuards(RolesGuard)
  @Delete('/:id')
  delete(@Param('id') value: string) {
    return this.teachersService.delete(Number(value))
  }

  @ApiOperation({ summary: 'Get all teachers' })
  @ApiResponse({ status: HttpStatus.CREATED, type: GetTeacherDto })
  @Version('1')
  @Get()
  getAll() {
    return this.teachersService.getAll()
  }

  @ApiOperation({ summary: 'Get a teacher by id' })
  @ApiResponse({ status: HttpStatus.OK, type: [GetTeacherDto] })
  @Version('1')
  @Get('/:id')
  getById(@Param('id') cityId: string) {
    return this.teachersService.getById(Number(cityId))
  }

  @ApiOperation({ summary: 'Get teachers in a university' })
  @ApiResponse({ status: HttpStatus.OK, type: [GetTeacherDto] })
  @Version('1')
  @Get('/by-university/:id')
  getByCity(@Param('id') value: string) {
    return this.teachersService.getByUniversity(Number(value))
  }
}
