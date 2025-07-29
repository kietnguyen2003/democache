export interface User {
  access_token: string
  refresh_token: string
  user_id: string
}

export interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  logout: () => void
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  username: string
}

export interface Prompt {
  _id: string
  createdAt: string
  updatedAt: string
  category: string
  content: string
  description: string
  isPublic: boolean
  language: string
  title: string
  userId: string
  userName: string
  isFavorite: boolean
}

export interface PromptsResponse {
  hasNext: boolean
  offset: number
  limit: number
  total: number
  items: Prompt[]
}

export interface PromptFilters {
  query?: string
  offset?: number
  limit?: number
  category?: string
  isFavorite?: boolean
  isPublic?: boolean
}
