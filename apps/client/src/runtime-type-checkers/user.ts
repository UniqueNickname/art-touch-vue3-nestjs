import type { User } from 'src/types'
import { checkRoleType } from './role'

export const checkUserType = (value: unknown): boolean => {
  if (typeof value !== 'object') return false
  if (value === null) return false

  const currentValue = value as Partial<User>

  if (typeof currentValue.id !== 'string') return false
  if (typeof currentValue.fullName !== 'string') return false

  if (!checkRoleType(currentValue.role)) return false

  return true
}

export const getValidUserOrNull = (value: unknown): User | null => {
  if (checkUserType(value)) {
    const user = value as User
    return {
      id: user.id,
      fullName: user.fullName,
      role: user.role,
    } as User
  }

  return null
}
