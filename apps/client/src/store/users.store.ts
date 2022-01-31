import type {
  TokenPayload,
  Tokens,
} from '../../../../packages/common/src/dto/get-tokens.dto'
import type { Role } from 'src/types'
import { defineStore } from 'pinia'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { isSSR } from 'src/utils/isSSR'
import { useCookies } from 'vue3-cookies'
import { useRouter } from 'vue-router'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'src/constants'

interface UsersState {
  currentUser: TokenPayload | null
  tokens: Tokens | null
}

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    currentUser: null,
    tokens: null,
  }),
  actions: {
    getUserByToken(token: string) {
      const user = jwtDecode<TokenPayload>(token)

      this.currentUser = user
    },
    saveTokens({ access, refresh }: Tokens) {
      if (isSSR()) {
        return
      }

      const { cookies } = useCookies()

      cookies.set(ACCESS_TOKEN_KEY, access, '2h', undefined, undefined, true)
      cookies.set(REFRESH_TOKEN_KEY, refresh, '7d', undefined, undefined, true)

      this.tokens = { access, refresh }
    },
    logout() {
      const { cookies } = useCookies()

      this.currentUser = null

      cookies.remove(ACCESS_TOKEN_KEY)
      cookies.remove(REFRESH_TOKEN_KEY)
    },
    async refresh() {
      if (isSSR()) {
        return
      }

      const { cookies } = useCookies()

      try {
        const token = cookies.get(REFRESH_TOKEN_KEY)

        if (!token) {
          this.logout()
          return
        }

        const { data } = (await axios.post(`/api/v1/auth/verify`, {
          token: token,
        })) as { data: Tokens }

        this.saveTokens(data)
        this.getUserByToken(data.access)
      } catch (error) {
        this.logout()
      }
    },
    async verify() {
      if (isSSR()) {
        return
      }

      const { cookies } = useCookies()

      try {
        const accessToken = cookies.get(ACCESS_TOKEN_KEY)

        if (!accessToken) {
          this.logout()
          return
        }

        const { data: tokenIsValid } = (await axios.post(
          `/api/v1/auth/verify`,
          {
            token: accessToken,
          },
        )) as { data: boolean }

        if (!tokenIsValid) {
          await this.refresh()
          return
        }

        const refreshToken = cookies.get(REFRESH_TOKEN_KEY)

        this.tokens = { access: accessToken, refresh: refreshToken }
        this.getUserByToken(accessToken)
      } catch (error) {
        this.logout()
      }
    },
    async checkAccess(role: Role = 'all') {
      console.log(this.tokens)

      await this.verify()

      if (isSSR()) return

      if (role === 'all') {
        return
      }

      const router = useRouter()

      if (role === 'authorized') {
        if (!this.currentUser) {
          router.replace('/')
        }
        return
      }

      if (role === 'unauthorized') {
        if (this.currentUser) {
          router.replace('/')
        }
        return
      }

      if (this.currentUser?.role !== role) {
        router.replace('/')
      }
    },
  },
  getters: {
    authToken: state => `Bearer ${state.tokens?.access}`,
  },
})
