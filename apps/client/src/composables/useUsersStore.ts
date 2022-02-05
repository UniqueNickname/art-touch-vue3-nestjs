import type { AccessType, User } from 'src/types'
import type { CreateParticipantDto, LoginDto } from 'src/types/dto'
import { computed, ComputedRef, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/api'
import { getValidUserOrNull } from 'src/runtime-type-checkers/user'

interface UsersState {
  currentUser: Readonly<User> | null
}

interface UsersManager {
  /** Login user (Can return error) */
  login(user: LoginDto): Promise<void>
  /** Create new participant (Can return error) */
  registerParticipant(dto: CreateParticipantDto): Promise<void>
  /** Logout user and redirect to home page */
  logout(): Promise<void>
  /** Redirect to home page if user does not have access to this page*/
  checkAccess(accessType: AccessType): Promise<void>
  user: ComputedRef<User | null>
}

const state = reactive<UsersState>({
  currentUser: null,
})

export const useUsersStore = (): UsersManager => {
  const router = useRouter()

  const redirect2Home = () => {
    router.replace('/')
  }

  const login: UsersManager['login'] = async dto => {
    const { data: user } = await api.post<unknown>(`/api/v1/auth/login`, dto)

    state.currentUser = getValidUserOrNull(user)
  }

  const logout: UsersManager['logout'] = async () => {
    await api.post(`/api/v1/auth/logout`)
    state.currentUser = null
  }

  const registerParticipant: UsersManager['registerParticipant'] =
    async dto => {
      await api.post('/api/v1/auth/registration', dto)
    }

  const checkAccess: UsersManager['checkAccess'] = async accessType => {
    try {
      const { data: user } = await api.post<unknown>(`/api/v1/auth/verify`)
      state.currentUser = getValidUserOrNull(user)

      if (!state.currentUser) throw new Error()

      switch (accessType) {
        case 'authorized':
          return

        case 'all':
          return

        case 'admin':
          if (state.currentUser.role !== 'admin') {
            redirect2Home()
          }
          return
        case 'jury':
          if (state.currentUser.role !== 'jury') {
            redirect2Home()
          }
          return
        case 'participant':
          if (state.currentUser.role !== 'participant') {
            redirect2Home()
          }
          return
      }
    } catch (error) {
      if (accessType !== 'unauthorized') {
        redirect2Home()
        return
      }
      await logout()
    }
  }

  return {
    user: computed(() => state.currentUser),
    login,
    logout,
    registerParticipant,
    checkAccess,
  }
}
