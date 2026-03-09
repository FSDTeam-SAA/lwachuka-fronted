import axios from 'axios'
import { getSession } from 'next-auth/react'

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth interceptor: pull accessToken from NextAuth session (stored in httpOnly cookie via JWT)
api.interceptors.request.use(async config => {
  const session = await getSession()
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`
  }
  return config
})

export default api
