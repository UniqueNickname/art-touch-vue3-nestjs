import type {
  CreateAltNameDto,
  CreateTeacherDto,
  GetTeacherDto,
} from 'src/types/dto'
import axios from 'axios'
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

interface State {
  teachers: Readonly<GetTeacherDto>[]
}

export const useTeachers = () => {
  const { locale } = useI18n()

  const state = reactive<State>({
    teachers: [],
  })

  const requireTeachers = async (): Promise<void> => {
    try {
      const { data } = await axios.get(`/api/v1/teachers/`)

      state.teachers = data
    } catch (error) {
      state.teachers = []
    }
  }

  const requireTeachersByUniversity = async (
    universityId: number,
  ): Promise<void> => {
    try {
      const { data } = await axios.get<Readonly<GetTeacherDto>[]>(
        `/api/v1/teachers/by-university/${universityId}`,
      )

      state.teachers = data
    } catch (error) {
      state.teachers = []
    }
  }

  const createTeacher = async (dto: CreateTeacherDto) => {
    try {
      await axios.post('/api/v1/teachers', dto)
    } catch (error) {}
  }

  const addTeacherAltname = async (dto: CreateAltNameDto) => {
    try {
      await axios.post('/api/v1/teachers/alt-names', dto)
    } catch (error) {}
  }

  const clearTeachers = () => {
    state.teachers = []
  }

  return {
    requireTeachers,
    requireTeachersByUniversity,
    createTeacher,
    addTeacherAltname,
    clearTeachers,
    teachers: computed(() =>
      state.teachers.map(university => ({
        label: university.altNames[locale.value] || university.name,
        value: university.id,
      })),
    ),
  }
}
