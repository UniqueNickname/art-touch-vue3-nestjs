import { reactive } from 'vue'
import { useCookies } from 'vue3-cookies'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import {
  TokenPayload,
  Tokens,
} from '../../../../packages/common/src/dto/get-tokens.dto'
import { isSSR } from 'src/utils/isSSR'

interface State {
  currentUser: TokenPayload | null
  tokens?: Tokens
}

const state = reactive<State>({
  currentUser: null,
})

export const useUser = () => {
  const { cookies } = useCookies()

  const getUserByToken = (token: string) => {
    const user = jwtDecode<TokenPayload>(token)

    state.currentUser = user
  }

  const saveTokens = ({ access, refresh }: Tokens) => {
    if (isSSR()) {
      return
    }

    cookies.set('access-token', access, '2h', undefined, undefined, true)
    cookies.set('refresh-token', refresh, '7d', undefined, undefined, true)

    state.tokens = { access, refresh }
  }

  const getCurrentUser = () => state.currentUser
  const getTokens = () => state.tokens

  const logout = () => {
    state.currentUser = null

    saveTokens({ access: '', refresh: '' })
  }

  const refreshToken = async () => {
    try {
      if (isSSR()) {
        return
      }

      const token = cookies.get('refresh-token')

      if (!token) {
        logout()
        return
      }

      const { data } = (await axios.post(`/api/v1/auth/verify`, {
        token: token,
      })) as { data: Tokens }

      saveTokens(data)
      getUserByToken(data.access)
    } catch (error) {
      logout()
    }
  }

  const verifyToken = async () => {
    try {
      if (isSSR()) {
        return
      }

      const accessToken = cookies.get('access-token')

      if (!accessToken) {
        logout()
        return
      }

      const { data: tokenIsValid } = (await axios.post(`/api/v1/auth/verify`, {
        token: accessToken,
      })) as { data: boolean }

      if (!tokenIsValid) {
        await refreshToken()
        return
      }

      getUserByToken(accessToken)
    } catch (error) {
      logout()
    }
  }

  return {
    getUserByToken,
    saveTokens,
    getCurrentUser,
    getTokens,
    logout,
    verifyToken,
  }
}
