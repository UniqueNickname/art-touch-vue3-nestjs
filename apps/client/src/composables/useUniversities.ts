import type {
  CreateAltNameDto,
  CreateUniversityDto,
  GetUniversityDto,
} from 'src/types/dto'
import axios from 'axios'
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

interface State {
  universities: Readonly<GetUniversityDto>[]
}

export const useUniversities = () => {
  const { locale } = useI18n()

  const state = reactive<State>({
    universities: [],
  })

  const requireUniversities = async (): Promise<void> => {
    try {
      const { data } = await axios.get<Readonly<GetUniversityDto>[]>(
        `/api/v1/universities/`,
      )

      state.universities = data
    } catch (error) {
      state.universities = []
    }
  }

  const requireUniversitiesByCity = async (cityId: number): Promise<void> => {
    try {
      const { data } = await axios.get<Readonly<GetUniversityDto>[]>(
        `/api/v1/universities/by-city/${cityId}`,
      )

      state.universities = data
    } catch (error) {
      state.universities = []
    }
  }

  const createUniversity = async (dto: CreateUniversityDto) => {
    try {
      await axios.post('/api/v1/universities', dto)
    } catch (error) {}
  }

  const addUniversityAltname = async (dto: CreateAltNameDto) => {
    try {
      await axios.post('/api/v1/universities/alt-names', dto)
    } catch (error) {}
  }

  const clearUniversities = () => {
    state.universities = []
  }

  return {
    clearUniversities,
    requireUniversities,
    requireUniversitiesByCity,
    createUniversity,
    addUniversityAltname,
    universities: computed(() =>
      state.universities.map(university => ({
        label: university.altNames[locale.value] || university.name,
        value: university.id,
      })),
    ),
  }
}
