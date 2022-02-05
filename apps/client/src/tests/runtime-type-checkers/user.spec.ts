import {
  checkUserType,
  getValidUserOrNull,
} from 'src/runtime-type-checkers/user'
import { User } from 'src/types'

const validUser1: User = {
  id: 'foo',
  fullName: 'User Name',
  role: 'participant',
}

const validUser2: User = {
  id: 'fdhgs__Sfds',
  fullName: 'sdfgggdfgdfs',
  role: 'admin',
}

const validUser3: User = {
  id: '435656',
  fullName: '43555543354',
  role: 'jury',
}

describe('checkUserType', () => {
  it('Should return true if a value type is valid', async () => {
    expect(checkUserType(validUser1)).toBe(true)
    expect(checkUserType(validUser2)).toBe(true)
    expect(checkUserType(validUser3)).toBe(true)
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

describe('getValidUserOrNull', () => {
  it('Should return object type User if received value is valid', () => {
    expect(getValidUserOrNull(validUser1)).toEqual(validUser1)
    expect(getValidUserOrNull(validUser2)).toEqual(validUser2)
    expect(getValidUserOrNull(validUser3)).toEqual(validUser3)
  })

  it('Should return object type User if  without unnecessary fields', () => {
    expect(
      getValidUserOrNull({
        ...validUser2,
        accessType: 'participant',
      }),
    ).toEqual(validUser2)
    expect(
      getValidUserOrNull({
        ...validUser3,
        accessType: 'participant',
        position: 'lecturer',
      }),
    ).toEqual(validUser3)
  })

  it('Should return null if received value is not valid', () => {
    expect(
      getValidUserOrNull({
        id: 435656,
        fullName: '43555543354',
        role: 'jury',
      }),
    ).toBe(null)
    expect(
      getValidUserOrNull({
        id: '435656',
        fullName: 43555543354,
        role: 'jury',
      }),
    ).toBe(null)
    expect(
      getValidUserOrNull({
        id: '435656',
        fullName: '43555543354',
        role: 'moderator',
      }),
    ).toBe(null)
    expect(
      getValidUserOrNull({
        fullName: 'User Name',
        role: 'participant',
      }),
    ).toBe(null)
    expect(
      getValidUserOrNull({
        id: 'foo',
        role: 'participant',
      }),
    ).toBe(null)
    expect(
      getValidUserOrNull({
        id: 'foo',
        fullName: 'User Name',
      }),
    ).toBe(null)
    expect(
      getValidUserOrNull({
        uuid: 'foo',
        name: 'User Name',
        accessType: 'participant',
      }),
    ).toBe(null)
    expect(getValidUserOrNull('string')).toBe(null)
    expect(getValidUserOrNull(1)).toBe(null)
    expect(getValidUserOrNull({})).toBe(null)
    expect(getValidUserOrNull(null)).toBe(null)
    expect(getValidUserOrNull(undefined)).toBe(null)
  })
})
