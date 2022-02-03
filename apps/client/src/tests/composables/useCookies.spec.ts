import { useCookies } from '../../composables/useCookies'

describe('useCookies', () => {
  const cookieName = 'token'

  const { get } = useCookies()

  it("Method get should return null when cookie doesn't exist", async () => {
    expect(get(cookieName)).toBe(null)
  })
})
