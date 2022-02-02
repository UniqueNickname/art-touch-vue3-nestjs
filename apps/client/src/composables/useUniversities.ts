import type {
  CreateAltNameDto,
  CreateUniversityDto,
  GetUniversityDto,
} from 'src/types/dto'
import axios from 'axios'
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUsersStore } from './useUsersStore'

interface State {
  universities: Readonly<GetUniversityDto>[]
}

export const useUniversities = () => {
  const { authToken } = useUsersStore()
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
      await axios.post('/api/v1/universities', dto, {
        headers: { Authorization: authToken.value },
      })
    } catch (error) {}
  }

  const addUniversityAltname = async (form: CreateAltNameDto) => {
    try {
      await axios.post('/api/v1/universities/alt-names', form, {
        headers: { Authorization: authToken.value },
      })
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
