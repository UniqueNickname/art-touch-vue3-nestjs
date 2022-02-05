import { checkUserType } from 'src/runtime-type-checkers/user'
import { User } from 'src/types'

describe('checkUserType', () => {
  it('Should return true if a value type is valid', async () => {
    expect(
      checkUserType({
        id: 'foo',
        fullName: 'User Name',
        role: 'participant',
      } as User),
    ).toBe(true)
    expect(
      checkUserType({
        id: 'fdhgs__Sfds',
        fullName: 'sdfgggdfgdfs',
        role: 'admin',
      } as User),
    ).toBe(true)
    expect(
      checkUserType({
        id: '435656',
        fullName: '43555543354',
        role: 'jury',
      } as User),
    ).toBe(true)
  })

  it('Should return true if a value type is valid, but value has extra fields', async () => {
    expect(
      checkUserType({
        id: 'foo',
        fullName: 'User Name',
        role: 'participant',
        position: 'lecturer',
      } as User),
    ).toBe(true)
    expect(
      checkUserType({
        id: 'foo',
        fullName: 'User Name',
        role: 'participant',
        created: '12.12.2020',
      } as User),
    ).toBe(true)
  })

  it('Should return true if a value type is not valid', async () => {
    expect(
      checkUserType({
        id: 435656,
        fullName: '43555543354',
        role: 'jury',
      }),
    ).toBe(false)
    expect(
      checkUserType({
        id: '435656',
        fullName: 43555543354,
        role: 'jury',
      }),
    ).toBe(false)
    expect(
      checkUserType({
        id: '435656',
        fullName: '43555543354',
        role: 'moderator',
      }),
    ).toBe(false)
    expect(
      checkUserType({
        fullName: 'User Name',
        role: 'participant',
      }),
    ).toBe(false)
    expect(
      checkUserType({
        id: 'foo',
        role: 'participant',
      }),
    ).toBe(false)
    expect(
      checkUserType({
        id: 'foo',
        fullName: 'User Name',
      }),
    ).toBe(false)
    expect(
      checkUserType({
        uuid: 'foo',
        name: 'User Name',
        accessType: 'participant',
      }),
    ).toBe(false)
    expect(checkUserType('string')).toBe(false)
    expect(checkUserType(1)).toBe(false)
    expect(checkUserType({})).toBe(false)
    expect(checkUserType(null)).toBe(false)
    expect(checkUserType(undefined)).toBe(false)
  })
})
