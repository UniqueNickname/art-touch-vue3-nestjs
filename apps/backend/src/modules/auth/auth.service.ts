import type { Role } from 'src/types'
import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { LoginUserDto } from 'src/dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { Admin, Jury, Participant } from 'src/models/user.model'
import { AdminService } from './admin/admin.service'
import { JuryService } from './jury/jury.service'
import { ParticipantsService } from './participants/participants.service'
import { CreateParticipantDto } from 'src/dto/create-participant.dto'
import { CreateJuryDto } from 'src/dto/create-jury.dto'
import { CreateAdminDto } from 'src/dto/create-admin.dto'
import { Tokens, TokenPayload } from 'src/dto/get-tokens.dto'
import * as bcrypt from 'bcryptjs'

type User = Participant | Jury | Admin

@Injectable()
export class AuthService {
  constructor(
    private participantsService: ParticipantsService,
    private adminService: AdminService,
    private juryService: JuryService,
    private jwtService: JwtService,
  ) {}

  private loginError = new UnauthorizedException({
    message: 'Invalid email or password.',
  })

  private registrationError = new HttpException(
    {
      message: 'User with this email already exists.',
    },
    HttpStatus.BAD_REQUEST,
  )

  async login(
    loginDto: LoginUserDto,
  ): Promise<{ user: TokenPayload; tokens: Tokens }> {
    const user = await this.getUserByEmail(loginDto.email)

    if (!user) {
      throw this.loginError
    }

    const passwordEquals = await this.comparePasswords(
      loginDto.password,
      user.model.password,
    )

    if (!passwordEquals) {
      throw this.loginError
    }

    return {
      user: {
        id: user.model.id,
        role: user.role,
        fullName: user.model.fullName,
      },
      tokens: this.generatePairOfTokens(user.model, user.role),
    }
  }

  async registrationParticipant(dto: CreateParticipantDto): Promise<Tokens> {
    const user = await this.getUserByEmail(dto.email)

    if (user) {
      throw this.registrationError
    }

    const hashPassword = await bcrypt.hash(dto.password, 10)

    const participant = await this.participantsService.create({
      ...dto,
      password: hashPassword,
    })

    return this.generatePairOfTokens(participant, 'participant')
  }

  async registrationJury(
    dto: CreateJuryDto,
    photo: Express.Multer.File,
  ): Promise<Tokens> {
    const user = await this.getUserByEmail(dto.email)

    if (user) {
      throw this.registrationError
    }

    const hashPassword = await bcrypt.hash(dto.password, 10)

    const jury = await this.juryService.create(
      {
        ...dto,
        password: hashPassword,
      },
      photo,
    )

    return this.generatePairOfTokens(jury, 'jury')
  }

  async registrationAdmin(dto: CreateAdminDto): Promise<Tokens> {
    const user = await this.getUserByEmail(dto.email)

    if (user) {
      throw this.registrationError
    }

    const hashPassword = await bcrypt.hash(dto.password, 10)

    const admin = await this.adminService.create({
      ...dto,
      password: hashPassword,
    })

    return this.generatePairOfTokens(admin, 'admin')
  }

  setTokensToCookie(res: any, tokens: Tokens) {
    const hour = 60 * 60 * 1000

    const cookieOptions = {
      sameSite: 'strict',
      withCredentials: true,
      httpOnly: true,
    }

    res.cookie(ACCESS_TOKEN_KEY, tokens.access, {
      ...cookieOptions,
      expires: new Date(new Date().getTime() + 2 * hour),
    })
    res.cookie(REFRESH_TOKEN_KEY, tokens.refresh, {
      ...cookieOptions,
      expires: new Date(new Date().getTime() + 7 * 24 * hour),
    })

    return res
  }

  getUserByToken(accessToken: string): TokenPayload {
    try {
      const user = this.jwtService.verify<TokenPayload>(accessToken)

      return {
        id: user.id,
        role: user.role,
        fullName: user.fullName,
      }
    } catch (error) {
      throw new UnauthorizedException({
        message: 'User is not authorized',
      })
    }
  }

  verify(accessToken: string) {
    try {
      const user = this.jwtService.verify<TokenPayload>(accessToken)
      return !!user
    } catch (error) {
      throw new UnauthorizedException({
        message: 'User is not authorized',
      })
    }
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    try {
      const payload = this.jwtService.verify<TokenPayload>(refreshToken)
      const user = await this.getUserById(payload.id)

      if (!user) {
        throw new Error()
      }

      return this.generatePairOfTokens(user.model, payload.role)
    } catch (error) {
      throw new UnauthorizedException({
        message: 'User is not authorized',
      })
    }
  }

  private getTokenFromCookie(res: any, tokenKey: string) {
    const rawHeaders = res.req.rawHeaders as string[]

    const cookieIndex = rawHeaders.findIndex(string => string === 'cookie')
    if (cookieIndex === -1) return ''

    const cookiesString = rawHeaders[cookieIndex + 1]

    const token = cookiesString
      .split('; ')
      .find(string => string.startsWith(tokenKey))
      ?.split('=')[1]

    return token || ''
  }

  private async getUserById(
    id: string,
  ): Promise<{ model: User; role: Role } | undefined> {
    try {
      const participant = await this.participantsService.getById(id)
      return {
        model: participant,
        role: 'participant',
      }
    } catch (error) {}

    try {
      const admin = await this.adminService.getById(id)
      return {
        model: admin,
        role: 'admin',
      }
    } catch (error) {}

    try {
      const jury = await this.juryService.getById(id)
      return {
        model: jury,
        role: 'jury',
      }
    } catch (error) {}
  }

  private async getUserByEmail(
    email: string,
  ): Promise<{ model: User; role: Role } | undefined> {
    try {
      const participant = await this.participantsService.getByEmail(email)
      return {
        model: participant,
        role: 'participant',
      }
    } catch (error) {}

    try {
      const admin = await this.adminService.getByEmail(email)
      return {
        model: admin,
        role: 'admin',
      }
    } catch (error) {}

    try {
      const jury = await this.juryService.getByEmail(email)
      return {
        model: jury,
        role: 'jury',
      }
    } catch (error) {}
  }

  private async comparePasswords(
    dtoPassword: string,
    modelPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(dtoPassword, modelPassword)
  }

  private generatePairOfTokens(
    user: Participant | Jury | Admin,
    role: Role,
  ): Tokens {
    return {
      access: this.generateToken(user, role, 'access'),
      refresh: this.generateToken(user, role, 'refresh'),
    }
  }

  private generateToken(
    user: Participant | Jury | Admin,
    role: Role,
    type: 'access' | 'refresh',
  ): string {
    const expiresIn = {
      access: '2h',
      refresh: '7d',
    }

    const payload: TokenPayload = {
      id: user.id,
      role: role,
      fullName: user.fullName,
    }
    return this.jwtService.sign(payload, {
      expiresIn: expiresIn[type],
    })
  }
}
