import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Participant } from 'src/models/user.model'
import { CreateParticipantDto } from '@art-touch/common/dist/dto/create-participant.dto'

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel(Participant) private participantRepository: typeof Participant,
  ) {}

  async create(dto: CreateParticipantDto): Promise<Participant> {
    const participant = await this.participantRepository.create(dto)

    return participant
  }

  async getById(
    id: string,
    type: 'model' | 'dto' = 'dto',
  ): Promise<Participant | Participant> {
    const participant = await this.participantRepository.findOne({
      where: { id },
    })

    if (!participant) {
      throw new HttpException(
        `Participant with id "${id}" does not exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    if (type === 'model') {
      return participant
    }

    return participant
  }

  async getByEmail(
    email: string,
    type: 'model' | 'dto' = 'dto',
  ): Promise<Participant | Participant> {
    const participant = await this.participantRepository.findOne({
      where: { email },
    })

    if (!participant) {
      throw new HttpException(
        `Participant with email "${email}" does not exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    if (type === 'model') {
      return participant
    }

    return participant
  }
}
