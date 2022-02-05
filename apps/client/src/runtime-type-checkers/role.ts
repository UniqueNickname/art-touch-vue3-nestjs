const availableRoles = ['admin', 'jury', 'participant']

export const checkRoleType = (value: unknown): boolean => {
  if (typeof value !== 'string') return false

  return availableRoles.includes(value)
}
