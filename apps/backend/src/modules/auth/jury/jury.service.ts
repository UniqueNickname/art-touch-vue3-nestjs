import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Jury } from 'src/models/user.model'
import { CreateAdminDto } from '@art-touch/common/dist/dto/create-admin.dto'
import { GetJuryDto } from '@art-touch/common/dist/dto/get-jury.dto'
import { FilesService } from 'src/modules/files/files.service'

@Injectable()
export class JuryService {
  constructor(
    @InjectModel(Jury) private juryRepository: typeof Jury,
    private fileService: FilesService,
  ) {}

  async create(dto: CreateAdminDto, photo: any): Promise<GetJuryDto> {
    const fileName = await this.fileService.createFile(photo)
    const jury = await this.juryRepository.create({ ...dto, photo: fileName })

    return {
      id: jury.id,
      email: jury.email,
      fullName: jury.fullName,
      photo: jury.photo,
    }
  }
}
