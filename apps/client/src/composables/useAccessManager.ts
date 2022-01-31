import { useRouter } from 'vue-router'
import { useUser } from './useUser'

export const useAccessManager = () => {
  const { currentUser } = useUser()

  const router = useRouter()

  const toHome = () => {
    router.replace('/')
  }

  return {
    onlyForAdmin() {
      if (currentUser.value?.role !== 'admin') {
        toHome()
      }
    },
    onlyForJury() {
      if (currentUser.value?.role !== 'jury') {
        toHome()
      }
    },
    onlyForParticipant() {
      if (currentUser.value?.role !== 'participant') {
        toHome()
      }
    },
    onlyForUnauthorized() {
      if (currentUser.value) {
        toHome()
      }
    },
    onlyForAuthorized() {
      if (!currentUser.value) {
        toHome()
      }
    },
  }
}
