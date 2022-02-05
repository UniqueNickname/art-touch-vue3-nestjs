import { checkRoleType } from 'src/runtime-type-checkers/role'

describe('checkRoleType', () => {
  it('Should return true if a value type is valid', async () => {
    expect(checkRoleType('admin')).toBe(true)
    expect(checkRoleType('jury')).toBe(true)
    expect(checkRoleType('participant')).toBe(true)
  })

  it('Should return true if a value type is not valid', async () => {
    expect(checkRoleType('moderator')).toBe(false)
    expect(checkRoleType('string')).toBe(false)
    expect(checkRoleType(1)).toBe(false)
    expect(checkRoleType({})).toBe(false)
    expect(checkRoleType(null)).toBe(false)
  })
})
