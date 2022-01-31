import type { Role } from 'src/types'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'role'

export const RequireRole = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
