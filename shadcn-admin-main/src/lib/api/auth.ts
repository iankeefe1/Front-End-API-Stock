import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface MeResponse {
  userID: number
  username: string
  email: string
  firstName: string
  lastName: string
  userTitle?: string
  role?: string[]
}

export async function getMe(token: string) {
  const res = await axios.get<{ user: MeResponse }>(
    `${API_BASE_URL}/Users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.data.user
}
