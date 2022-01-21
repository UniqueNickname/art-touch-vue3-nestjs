import { CreateAdminDto } from '@art-touch/common/dist/dto/create-admin.dto'
import { GetAdminDto } from '@art-touch/common/dist/dto/get-admin.dto'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Admin } from 'src/models/user.model'

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin) private adminRepository: typeof Admin) {}

  async create(dto: CreateAdminDto): Promise<GetAdminDto> {
    const admin = await this.adminRepository.create(dto)

    return {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
    }
  }
}
