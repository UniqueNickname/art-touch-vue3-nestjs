import { useCookies } from '../../composables/useCookies'

describe('useCookies', () => {
  const cookieName = 'token'
  const cookieValue = 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'

  const { get, set } = useCookies()

  it("Method get should return null when cookie doesn't exist", async () => {
    expect(get(cookieName)).toBe(null)
  })

  it('After setting cookie method get should return specified value', async () => {
    set(cookieName, cookieValue)
    expect(get(cookieName)).toBe(cookieValue)
  })
})
