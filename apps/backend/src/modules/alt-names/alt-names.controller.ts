import { CreateAltNameDto } from '@art-touch/common/dist/dto/create-alt-name.dto'
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Version,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RequireRole } from 'src/decorators/roles-auth.decorator'
import { RolesGuard } from 'src/guards/roles.guard'
import { CityAltName, UniversityAltName } from 'src/models/alt-names.model'
import { AltNamesService } from './alt-names.service'

@Controller()
export class AltNamesController {
  constructor(private altNamesService: AltNamesService) {}

  @ApiTags('Cities')
  @ApiOperation({
    summary: `Add alternative name of the city (Only for admin)`,
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: CityAltName })
  @Version('1')
  @RequireRole('admin')
  @UseGuards(RolesGuard)
  @Post('/cities/alt-names')
  createCityName(@Body() dto: CreateAltNameDto) {
    return this.altNamesService.createCityName(dto)
  }

  @ApiOperation({
    summary: `Add alternative name of the university (Only for admin)`,
  })
  @ApiResponse({ status: HttpStatus.OK, type: UniversityAltName })
  @ApiTags('Universities')
  @Version('1')
  @RequireRole('admin')
  @UseGuards(RolesGuard)
  @Post('/universities/alt-names')
  createUniversityName(@Body() dto: CreateAltNameDto) {
    return this.altNamesService.createUniversityName(dto)
  }

  @ApiOperation({
    summary: `Add alternative name of the teacher (Only for admin)`,
  })
  @ApiResponse({ status: HttpStatus.OK, type: UniversityAltName })
  @ApiTags('Teachers')
  @Version('1')
  @RequireRole('admin')
  @UseGuards(RolesGuard)
  @Post('/teachers/alt-names')
  createTeacherName(@Body() dto: CreateAltNameDto) {
    return this.altNamesService.createTeacherName(dto)
  }
}
