import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'access_token'
const USER_KEY = 'auth_user'

const userFromCookie = getCookie(USER_KEY)

export interface AuthUser {
  accountNo?: string
  username: string
  firstName: string
  lastName: string
  email: string
  role: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    accessToken: string
    setUser: (user: AuthUser | null) => void
    setAccessToken: (token: string) => void
    reset: () => void
  }
}


export const useAuthStore = create<AuthState>()((set) => {
  const tokenFromCookie = getCookie(ACCESS_TOKEN) ?? ''

  return {
    auth: {
      user: userFromCookie ? JSON.parse(userFromCookie) : null,
      accessToken: tokenFromCookie,

      setUser: (user) =>
      set((state) => {
        if (user) {
          setCookie(USER_KEY, JSON.stringify(user))
        } else {
          removeCookie(USER_KEY)
        }

        return {
          auth: {
            ...state.auth,
            user,
          },
        }
      }),

      setAccessToken: (token) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, token)
          return {
            auth: {
              ...state.auth,
              accessToken: token,
            },
          }
        }),

      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return {
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
            },
          }
        }),
    },
  }
})
