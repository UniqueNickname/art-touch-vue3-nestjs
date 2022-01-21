import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
  Version,
} from '@nestjs/common'
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { GetParticipantDto } from '@art-touch/common/dist/dto/get-participant.dto'
import { GetJuryDto } from '@art-touch/common/dist/dto/get-jury.dto'
import { GetAdminDto } from '@art-touch/common/dist/dto/get-admin.dto'
import { CreateParticipantDto } from '@art-touch/common/dist/dto/create-participant.dto'
import { CreateAdminDto } from '@art-touch/common/dist/dto/create-admin.dto'
import { CreateJuryDto } from '@art-touch/common/dist/dto/create-jury.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { LoginUserDto } from '@art-touch/common/dist/dto/login-user.dto'

const registerJuryBody: Record<
  keyof CreateJuryDto | 'photo',
  { type: string; format?: 'binary' }
> = {
  email: { type: 'string' },
  fullName: { type: 'string' },
  password: { type: 'string' },
  photo: { type: 'string', format: 'binary' },
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: HttpStatus.CREATED, type: GetParticipantDto })
  @Version('1')
  @Post('/login')
  login(@Body() dto: LoginUserDto): Promise<string> {
    return this.authService.login(dto)
  }

  @ApiOperation({ summary: 'Register a new participant' })
  @ApiResponse({ status: HttpStatus.CREATED, type: GetParticipantDto })
  @Version('1')
  @Post('/registration')
  register(@Body() dto: CreateParticipantDto): Promise<string> {
    return this.authService.registrationParticipant(dto)
  }

  @ApiOperation({ summary: 'Register a new admin' })
  @ApiResponse({ status: HttpStatus.CREATED, type: GetAdminDto })
  @Version('1')
  @Post('/registration/admin')
  registerAdmin(@Body() dto: CreateAdminDto): Promise<string> {
    return this.authService.registrationAdmin(dto)
  }

  @ApiOperation({ summary: 'Register a new jury' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        ...registerJuryBody,
      },
    },
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: GetJuryDto })
  @Version('1')
  @Post('/registration/jury')
  @UseInterceptors(FileInterceptor('photo'))
  registerJury(
    @Body() dto: CreateJuryDto,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<string> {
    return this.authService.registrationJury(dto, photo)
  }
}
