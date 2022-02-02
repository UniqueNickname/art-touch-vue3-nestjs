import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Teacher } from 'src/models/teacher.model'
import { CreateTeacherDto } from 'src/dto/create-teacher.dto'
import { GetTeacherDto } from '@art-touch/common/dist/dto/get-teacher.dto'
import { UniversitiesService } from '../universities/universities.service'
import { TeacherAltName } from 'src/models/alt-names.model'
import { GetAltNamesDto } from 'src/dto/get-alt-name.dto'

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher) private teacherRepository: typeof Teacher,
    private universitiesService: UniversitiesService,
  ) {}

  async create(dto: CreateTeacherDto): Promise<GetTeacherDto> {
    try {
      await this.universitiesService.getById(dto.universityId)
    } catch (error) {
      throw new HttpException(
        `University with id '${dto.universityId}' does not exist`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const teacher = await this.teacherRepository.create(dto)
    return {
      id: teacher.id,
      universityId: teacher.universityId,
      name: teacher.name,
      altNames: {},
    }
  }

  async delete(teacherId: number) {
    const teacher = await this.getModelById(teacherId)
    teacher.destroy()
  }

  async getAll(): Promise<GetTeacherDto[]> {
    const teachers = await this.teacherRepository.findAll({
      include: [TeacherAltName],
    })

    return teachers.map(teacher => ({
      id: teacher.id,
      universityId: teacher.universityId,
      name: teacher.name,
      altNames: this.transformAltNames(teacher.altNames),
    }))
  }

  async getById(teacherId: number): Promise<GetTeacherDto> {
    const teacher = await this.getModelById(teacherId)

    return {
      id: teacher.id,
      universityId: teacher.universityId,
      name: teacher.name,
      altNames: this.transformAltNames(teacher.altNames),
    }
  }

  async getByUniversity(universityId: number): Promise<GetTeacherDto[]> {
    const teachers = await this.teacherRepository.findAll({
      where: { universityId },
      include: [TeacherAltName],
    })

    if (!teachers.length) {
      throw new HttpException(
        `Teachers for university with Id ${universityId} does not exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return teachers.map(teacher => ({
      id: teacher.id,
      universityId: teacher.universityId,
      name: teacher.name,
      altNames: this.transformAltNames(teacher.altNames),
    }))
  }

  private transformAltNames(altNames: TeacherAltName[]) {
    return altNames.reduce((acc, { value, iso }) => {
      acc[iso] = value
      return acc
    }, {} as GetAltNamesDto)
  }

  private async getModelById(teacherId: number): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
      include: [TeacherAltName],
    })

    if (!teacher) {
      throw new HttpException(
        `Teacher with Id ${teacherId} does not exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return teacher
  }
}
