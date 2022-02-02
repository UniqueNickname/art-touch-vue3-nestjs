import axios from 'axios'
import { computed, reactive } from 'vue'
import { CreateCityDto } from '../../../../packages/common/src/dto/create-city.dto'
import { GetCityDto } from '../../../../packages/common/src/dto/get-city.dto'
import { useUsersStore } from 'src/composables/useUsersStore'
import { useI18n } from 'vue-i18n'

interface State {
  cities: GetCityDto[]
}

export const useCities = () => {
  const { authToken } = useUsersStore()
  const { locale } = useI18n()

  const state = reactive<State>({
    cities: [],
  })

  const requireCities = async (): Promise<void> => {
    try {
      const { data } = (await axios.get('/api/v1/cities')) as {
        data: GetCityDto[]
      }

      state.cities = data
    } catch (error) {
      state.cities = []
    }
  }

  const createCity = async (city: CreateCityDto) => {
    try {
      await axios.post('/api/v1/cities', city, {
        headers: { Authorization: authToken.value },
      })

      await requireCities()
    } catch (error) {}
  }

  const addCityAltname = async (form: CreateAltNameDto) => {
    try {
      await axios.post('/api/v1/cities/alt-names', form, {
        headers: { Authorization: authToken.value },
      })

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
