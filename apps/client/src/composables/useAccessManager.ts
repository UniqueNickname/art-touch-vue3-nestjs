import { useRouter } from 'vue-router'
import { Role } from '../../../../packages/common/src/enums/role.enum'
import { useUser } from './useUser'

export const useAccessManager = () => {
  const user = useUser().getCurrentUser()

  const router = useRouter()

  const toHome = () => {
    router.replace('/')
  }

  return {
    onlyForAdmin() {
      if (user?.role !== Role.admin) {
        toHome()
      }
    },
    onlyForJury() {
      if (user?.role !== Role.jury) {
        toHome()
      }
    },
    onlyForParticipant() {
      if (user?.role !== Role.participant) {
        toHome()
      }
    },
    onlyForUnauthorized() {
      if (user) {
        toHome()
      }
    },
    onlyForAuthorized() {
      if (!user) {
        toHome()
      }
    },
  }
}
