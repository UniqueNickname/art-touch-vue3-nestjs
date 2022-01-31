import { computed, reactive } from 'vue'
import { useCookies } from 'vue3-cookies'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import {
  TokenPayload,
  Tokens,
} from '../../../../packages/common/src/dto/get-tokens.dto'
import { isSSR } from 'src/utils/isSSR'
import { Role } from 'src/types'
import { useRouter } from 'vue-router'

interface State {
  currentUser: TokenPayload | null
  tokens?: Tokens
}

const ACCESS_TOKEN_KEY = 'access-token'
const REFRESH_TOKEN_KEY = 'refresh-token'

const state = reactive<State>({
  currentUser: null,
})

export const useUser = () => {
  const { cookies } = useCookies()
  const router = useRouter()

  const getUserByToken = (token: string) => {
    const user = jwtDecode<TokenPayload>(token)

    state.currentUser = user
  }

  const saveTokens = ({ access, refresh }: Tokens) => {
    if (isSSR()) {
      return
    }

    cookies.set(ACCESS_TOKEN_KEY, access, '2h', undefined, undefined, true)
    cookies.set(REFRESH_TOKEN_KEY, refresh, '7d', undefined, undefined, true)

    state.tokens = { access, refresh }
  }

  const logout = () => {
    state.currentUser = null

    cookies.remove(ACCESS_TOKEN_KEY)
    cookies.remove(REFRESH_TOKEN_KEY)
  }

  const refreshToken = async () => {
    try {
      if (isSSR()) {
        return
      }

      const token = cookies.get(REFRESH_TOKEN_KEY)

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

      const accessToken = cookies.get(ACCESS_TOKEN_KEY)

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

      const refresh = cookies.get(REFRESH_TOKEN_KEY)

      state.tokens = { access: accessToken, refresh }
      getUserByToken(accessToken)
    } catch (error) {
      logout()
    }
  }

  const checkAccess = async (role: Role = 'all') => {
    await verifyToken()

    if (role === 'all') {
      return
    }

    if (state.currentUser?.role !== role) {
      router.replace('/')
    }
  }

  return {
    getUserByToken,
    saveTokens,
    currentUser: computed(() => state.currentUser),
    tokens: computed(() => state.tokens),
    logout,
    checkAccess,
  }
}
