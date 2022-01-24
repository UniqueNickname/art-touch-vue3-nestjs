import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Admin, Jury, Participant } from 'src/models/user.model'
import { AdminService } from './admin/admin.service'
import { JuryService } from './jury/jury.service'
import { ParticipantsService } from './participants/participants.service'
import type { LoginUserDto } from '@art-touch/common/dist/dto/login-user.dto'
import * as bcrypt from 'bcryptjs'
import { Role } from '@art-touch/common/dist/enums/role.enum'
import { CreateParticipantDto } from '@art-touch/common/dist/dto/create-participant.dto'
import { CreateJuryDto } from '@art-touch/common/dist/dto/create-jury.dto'
import { CreateAdminDto } from '@art-touch/common/dist/dto/create-admin.dto'

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

  async login(loginDto: LoginUserDto) {
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

    return this.generateToken(user.model, user.role)
  }

  async registrationParticipant(dto: CreateParticipantDto): Promise<string> {
    const user = await this.getUserByEmail(dto.email)

    if (user) {
      throw this.registrationError
    }

    const hashPassword = await bcrypt.hash(dto.password, 10)

    const participant = await this.participantsService.create({
      ...dto,
      password: hashPassword,
    })

    return this.generateToken(participant, Role.participant)
  }

  async registrationJury(
    dto: CreateJuryDto,
    photo: Express.Multer.File,
  ): Promise<string> {
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

    return this.generateToken(jury, Role.jury)
  }

  async registrationAdmin(dto: CreateAdminDto): Promise<string> {
    const user = await this.getUserByEmail(dto.email)

    if (user) {
      throw this.registrationError
    }

    const hashPassword = await bcrypt.hash(dto.password, 10)

    const admin = await this.adminService.create({
      ...dto,
      password: hashPassword,
    })

    return this.generateToken(admin, Role.admin)
  }

  private async getUserById(
    id: string,
  ): Promise<{ model: User; role: Role } | undefined> {
    try {
      const participant = await this.participantsService.getById(id)
      return {
        model: participant,
        role: Role.participant,
      }
    } catch (error) {}

    try {
      const admin = await this.adminService.getById(id)
      return {
        model: admin,
        role: Role.admin,
      }
    } catch (error) {}

    try {
      const jury = await this.juryService.getById(id)
      return {
        model: jury,
        role: Role.jury,
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
        role: Role.participant,
      }
    } catch (error) {}

    try {
      const admin = await this.adminService.getByEmail(email)
      return {
        model: admin,
        role: Role.admin,
      }
    } catch (error) {}

    try {
      const jury = await this.juryService.getByEmail(email)
      return {
        model: jury,
        role: Role.jury,
      }
    } catch (error) {}
  }

  private async comparePasswords(
    dtoPassword: string,
    modelPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(dtoPassword, modelPassword)
  }

  private generateToken(user: Participant | Jury | Admin, role: Role): string {
    const payload = {
      email: user.email,
      id: user.id,
      role: role,
      fullName: user.fullName,
    }
    return this.jwtService.sign(payload)
  }
}
