import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'src/constants'
import { Role, TokenPayload, Tokens } from 'src/types'
import { isSSR } from 'src/utils/isSSR'
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

interface UsersState {
  currentUser: TokenPayload | null
  tokens: Tokens | null
}

const state = reactive<UsersState>({
  currentUser: null,
  tokens: null,
})

export const useUsersStore = () => {
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

  const refresh = async () => {
    if (isSSR()) {
      return
    }

    try {
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

  const verify = async () => {
    if (isSSR()) {
      return
    }

    try {
      const accessToken = cookies.get(ACCESS_TOKEN_KEY)

      if (!accessToken) {
        logout()
        return
      }

      const { data: tokenIsValid } = (await axios.post(`/api/v1/auth/verify`, {
        token: accessToken,
      })) as { data: boolean }

      if (!tokenIsValid) {
        await refresh()
        return
      }

      const refreshToken = cookies.get(REFRESH_TOKEN_KEY)

      state.tokens = { access: accessToken, refresh: refreshToken }
      getUserByToken(accessToken)
    } catch (error) {
      logout()
    }
  }

  const checkAccess = async (role: Role = 'all') => {
    await verify()

    if (isSSR()) return

    if (role === 'all') {
      return
    }

    if (role === 'authorized') {
      if (!state.currentUser) {
        router.replace('/')
      }
      return
    }

    if (role === 'unauthorized') {
      if (state.currentUser) {
        router.replace('/')
      }
      return
    }

    if (state.currentUser?.role !== role) {
      router.replace('/')
    }
  }

  return {
    saveTokens,
    getUserByToken,
    checkAccess,
    logout,
    currentUser: computed(() => state.currentUser),
    authToken: computed(() => `Bearer ${state.tokens?.access}`),
  }
}