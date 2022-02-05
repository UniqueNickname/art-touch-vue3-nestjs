import { checkISOType, getValidISO } from 'src/runtime-type-checkers/iso'

describe('checkISOType', () => {
  it('Should return true if a value type is valid', async () => {
    expect(checkISOType('ru-RU')).toBe(true)
    expect(checkISOType('en-US')).toBe(true)
  })

  it('Should return true if a value type is not valid', async () => {
    expect(checkISOType('en-us')).toBe(false)
    expect(checkISOType('string')).toBe(false)
    expect(checkISOType(1)).toBe(false)
    expect(checkISOType({})).toBe(false)
    expect(checkISOType(null)).toBe(false)
  })
})

describe('getValidISO', () => {
  it('Should return received value if a value type is valid', async () => {
    expect(getValidISO('ru-RU')).toBe('ru-RU')
    expect(getValidISO('en-US')).toBe('en-US')
  })

  it('Should return default value if a value type is not valid', async () => {
    expect(getValidISO('en-us')).toBe('en-US')
    expect(getValidISO('en-us', 'ru-RU')).toBe('ru-RU')
    expect(getValidISO('string', 'ru-RU')).toBe('ru-RU')
    expect(getValidISO(1, 'ru-RU')).toBe('ru-RU')
    expect(getValidISO({}, 'ru-RU')).toBe('ru-RU')
    expect(getValidISO(null, 'ru-RU')).toBe('ru-RU')
  })
})
