import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Participant } from 'src/models/user.model'
import { CreateParticipantDto } from '@art-touch/common/dist/dto/create-participant.dto'
import { GetParticipantDto } from '@art-touch/common/dist/dto/get-participant.dto'

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectModel(Participant) private participantRepository: typeof Participant,
  ) {}

  async create(dto: CreateParticipantDto): Promise<GetParticipantDto> {
    const participant = await this.participantRepository.create(dto)

    return {
      id: participant.id,
      email: participant.email,
      fullName: participant.fullName,
      phone: participant.phone,
      teacherId: participant.teacherId,
    }
  }
}
