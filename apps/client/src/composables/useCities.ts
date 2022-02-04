import type { CreateAltNameDto, CreateCityDto, GetCityDto } from 'src/types/dto'
import axios from 'axios'
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

interface State {
  cities: Readonly<GetCityDto>[]
}

export const useCities = () => {
  const { locale } = useI18n()

  const state = reactive<State>({
    cities: [],
  })

  const requireCities = async (): Promise<void> => {
    try {
      const { data } = await axios.get<Readonly<GetCityDto>[]>('/api/v1/cities')

      state.cities = data
    } catch (error) {
      state.cities = []
    }
  }

  const createCity = async (dto: CreateCityDto) => {
    try {
      await axios.post('/api/v1/cities', dto)

      await requireCities()
    } catch (error) {}
  }

  const addCityAltname = async (dto: CreateAltNameDto) => {
    try {
      await axios.post('/api/v1/cities/alt-names', dto)

      await requireCities()
    } catch (error) {}
  }

  return {
    requireCities,
    cities: computed(() => {
      return state.cities.map(city => ({
        label: city.altNames[locale.value] || city.name,
        value: city.id,
      }))
    }),
    createCity,
    addCityAltname,
  }
}
