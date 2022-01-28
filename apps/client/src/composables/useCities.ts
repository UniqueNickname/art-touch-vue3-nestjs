import axios from 'axios'
import { reactive } from 'vue'
import { CreateCityDto } from '../../../../packages/common/src/dto/create-city.dto'
import { CreateAltNameDto } from '../../../../packages/common/src/dto/create-alt-name.dto'
import { GetCityDto } from '../../../../packages/common/src/dto/get-city.dto'
import { useUser } from 'src/composables/useUser'

interface State {
  cities: GetCityDto[]
}

const state = reactive<State>({
  cities: [],
})

export const useCities = () => {
  const { getTokens } = useUser()

  const getCitiesFromServer = async () => {
    try {
      const { data } = (await axios.get('/api/v1/cities')) as {
        data: GetCityDto[]
      }

      state.cities = data
      return state.cities
    } catch (error) {
      state.cities = []
      return state.cities
    }
  }

  const addCity = async (city: CreateCityDto) => {
    try {
      await axios.post('/api/v1/cities', city, {
        headers: { Authorization: `Bearer ${getTokens()?.access}` },
      })

      await getCitiesFromServer()
    } catch (error) {}
  }

  const addCityAltname = async (form: CreateAltNameDto) => {
    try {
      await axios.post('/api/v1/cities/alt-names', form, {
        headers: { Authorization: `Bearer ${getTokens()?.access}` },
      })

      await getCitiesFromServer()
    } catch (error) {}
  }

  const getCities = () => state.cities

  return {
    getCitiesFromServer,
    getCities,
    addCity,
    addCityAltname,
  }
}
