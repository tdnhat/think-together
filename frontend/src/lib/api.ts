import axios, { AxiosInstance, AxiosResponse } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuthToken()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/api/auth/login', {
      email,
      password,
    })
    return response.data
  }

  async register(email: string, password: string, name: string) {
    const response = await this.client.post('/api/auth/register', {
      email,
      password,
      name,
    })
    return response.data
  }

  // Quiz management endpoints
  async getQuizSets() {
    const response = await this.client.get('/api/quiz-sets')
    return response.data
  }

  async createQuizSet(data: { title: string; description?: string; coverImage?: string }) {
    const response = await this.client.post('/api/quiz-sets', data)
    return response.data
  }

  async getQuizSet(id: string) {
    const response = await this.client.get(`/api/quiz-sets/${id}`)
    return response.data
  }

  async updateQuizSet(id: string, data: any) {
    const response = await this.client.put(`/api/quiz-sets/${id}`, data)
    return response.data
  }

  async deleteQuizSet(id: string) {
    const response = await this.client.delete(`/api/quiz-sets/${id}`)
    return response.data
  }

  // Question management endpoints
  async createQuestion(quizSetId: string, questionData: any) {
    const response = await this.client.post(`/api/quiz-sets/${quizSetId}/questions`, questionData)
    return response.data
  }

  async updateQuestion(quizSetId: string, questionId: string, questionData: any) {
    const response = await this.client.put(`/api/quiz-sets/${quizSetId}/questions/${questionId}`, questionData)
    return response.data
  }

  async deleteQuestion(quizSetId: string, questionId: string) {
    const response = await this.client.delete(`/api/quiz-sets/${quizSetId}/questions/${questionId}`)
    return response.data
  }

  async reorderQuestions(quizSetId: string, questionIds: string[]) {
    const response = await this.client.put(`/api/quiz-sets/${quizSetId}/questions/reorder`, {
      questionIds,
    })
    return response.data
  }

  // Game management endpoints
  async createGameSession(quizSetId: string, settings: any) {
    const response = await this.client.post('/api/games', {
      quizSetId,
      settings,
    })
    return response.data
  }

  async joinGame(pin: string, nickname: string) {
    const response = await this.client.post('/api/games/join', {
      pin,
      nickname,
    })
    return response.data
  }

  // Challenge endpoints
  async createChallenge(quizSetId: string) {
    const response = await this.client.post(`/api/quiz-sets/${quizSetId}/challenge`)
    return response.data
  }

  async getChallenge(id: string) {
    const response = await this.client.get(`/api/challenges/${id}`)
    return response.data
  }

  // File upload endpoints
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.client.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.url
  }

  async uploadVideo(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.client.post('/api/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.url
  }

  // Reports endpoints
  async getGameReports() {
    const response = await this.client.get('/api/reports')
    return response.data
  }

  async getGameReport(sessionId: string) {
    const response = await this.client.get(`/api/reports/${sessionId}`)
    return response.data
  }

  async exportReport(sessionId: string) {
    const response = await this.client.get(`/api/reports/${sessionId}/export`, {
      responseType: 'blob',
    })
    return response.data
  }
}

export const apiClient = new ApiClient()
export default apiClient