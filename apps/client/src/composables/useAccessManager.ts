import { useRouter } from 'vue-router'
import { Role } from '../../../../packages/common/src/enums/role.enum'
import { useUser } from './useUser'

export const useAccessManager = () => {
  const { currentUser } = useUser()

  const router = useRouter()

  const toHome = () => {
    router.replace('/')
  }

  return {
    onlyForAdmin() {
      if (currentUser.value?.role !== Role.admin) {
        toHome()
      }
    },
    onlyForJury() {
      if (currentUser.value?.role !== Role.jury) {
        toHome()
      }
    },
    onlyForParticipant() {
      if (currentUser.value?.role !== Role.participant) {
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
