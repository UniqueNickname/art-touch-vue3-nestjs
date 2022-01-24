import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Jury } from 'src/models/user.model'
import { CreateJuryDto } from '@art-touch/common/dist/dto/create-jury.dto'
import { FilesService } from 'src/modules/files/files.service'

@Injectable()
export class JuryService {
  constructor(
    @InjectModel(Jury) private juryRepository: typeof Jury,
    private fileService: FilesService,
  ) {}

  async create(dto: CreateJuryDto, photo: any): Promise<Jury> {
    const fileName = await this.fileService.createFile(photo)
    const jury = await this.juryRepository.create({ ...dto, photo: fileName })

    return jury
  }

  async getById(id: string): Promise<Jury> {
    const jury = await this.juryRepository.findOne({
      where: { id },
    })

    if (!jury) {
      throw new HttpException(
        `Jury with id "${id}" does not exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return jury
  }

  async getByEmail(email: string): Promise<Jury> {
    const jury = await this.juryRepository.findOne({
      where: { email },
    })

    if (!jury) {
      throw new HttpException(
        `Jury with email "${email}" does not exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return jury
  }
}
