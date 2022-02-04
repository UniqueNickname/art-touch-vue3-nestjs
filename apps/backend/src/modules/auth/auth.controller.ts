import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Version,
  Response,
} from '@nestjs/common'
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { GetParticipantDto } from 'src/dto/get-participant.dto'
import { GetJuryDto } from 'src/dto/get-jury.dto'
import { GetAdminDto } from 'src/dto/get-admin.dto'
import { CreateParticipantDto } from 'src/dto/create-participant.dto'
import { CreateAdminDto } from 'src/dto/create-admin.dto'
import { CreateJuryDto } from 'src/dto/create-jury.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { LoginUserDto } from 'src/dto/login-user.dto'
import { RequireRole } from 'src/decorators/roles-auth.decorator'
import { RolesGuard } from 'src/guards/roles.guard'
import { TokenPayload, Tokens } from 'src/dto/get-tokens.dto'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'src/constants'

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
  @ApiResponse({ status: HttpStatus.CREATED, type: TokenPayload })
  @Version('1')
  @Post('/login')
  async login(@Body() dto: LoginUserDto, @Response() res: any) {
    const {
      user,
      tokens: { access, refresh },
    } = await this.authService.login(dto)

    const hour = 60 * 60 * 1000

    const cookieOptions = {
      sameSite: 'strict',
      withCredentials: true,
      httpOnly: true,
    }

    res.cookie(ACCESS_TOKEN_KEY, access, {
      ...cookieOptions,
      expires: new Date(new Date().getTime() + 2 * hour),
    })
    res.cookie(REFRESH_TOKEN_KEY, refresh, {
      ...cookieOptions,
      expires: new Date(new Date().getTime() + 7 * 24 * hour),
    })

    return res.send(user)
  }

  @ApiOperation({ summary: 'Register a new participant' })
  @ApiResponse({ status: HttpStatus.CREATED, type: GetParticipantDto })
  @Version('1')
  @Post('/registration')
  register(@Body() dto: CreateParticipantDto): Promise<Tokens> {
    return this.authService.registrationParticipant(dto)
  }

  @ApiOperation({ summary: `Register a new admin (Only for ${'admin'})` })
  @ApiResponse({ status: HttpStatus.CREATED, type: GetAdminDto })
  @Version('1')
  @RequireRole('admin')
  @UseGuards(RolesGuard)
  @Post('/registration/admin')
  registerAdmin(@Body() dto: CreateAdminDto): Promise<Tokens> {
    return this.authService.registrationAdmin(dto)
  }

  @ApiOperation({ summary: `Register a new jury (Only for ${'admin'})` })
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
  @RequireRole('admin')
  @UseGuards(RolesGuard)
  @Post('/registration/jury')
  @UseInterceptors(FileInterceptor('photo'))
  registerJury(
    @Body() dto: CreateJuryDto,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<Tokens> {
    return this.authService.registrationJury(dto, photo)
  }

  @ApiOperation({ summary: 'Verify access token' })
  @ApiResponse({ status: HttpStatus.OK, type: Boolean })
  @Version('1')
  @Post('/verify')
  verify(@Body() { token }: { token: string }): boolean {
    return this.authService.verify(token)
  }
}
