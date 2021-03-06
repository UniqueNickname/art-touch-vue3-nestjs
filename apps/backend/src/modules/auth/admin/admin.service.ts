import { CreateAdminDto } from 'src/dto/create-admin.dto'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Admin } from 'src/models/user.model'

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin) private adminRepository: typeof Admin) {}

  async create(dto: CreateAdminDto): Promise<Admin> {
    const admin = await this.adminRepository.create(dto)

    return admin
  }

  async getById(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { id },
    })

    if (!admin) {
      throw new HttpException(
        `Admin with id "${id}" does not exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return admin
  }

  async getByEmail(email: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { email },
    })

    if (!admin) {
      throw new HttpException(
        `Admin with email "${email}" does not exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return admin
  }
}
