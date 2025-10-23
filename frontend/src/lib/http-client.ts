class HttpClient {
	private isRefreshing = false
	private refreshPromise: Promise<string> | null = null

	private async refreshToken(): Promise<string> {
		const response = await fetch('http://localhost:3333/refresh', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!response.ok) {
			localStorage.removeItem('accessToken')
			throw new Error('Não foi possível renovar o token')
		}

		const data = await response.json()
		localStorage.setItem('accessToken', data.token)
		return data.token
	}

	private async getValidToken(): Promise<string | null> {
		const accessToken = localStorage.getItem('accessToken')

		if (!accessToken) {
			return null
		}

		try {
			const tokenParts = accessToken.split('.')
			if (tokenParts.length !== 3) {
				localStorage.removeItem('accessToken')
				return null
			}

			const payload = JSON.parse(atob(tokenParts[1]))
			const now = Date.now() / 1000
			const fiveMinutesFromNow = now + 5 * 60

			if (payload.exp && payload.exp < fiveMinutesFromNow) {
				if (!this.isRefreshing) {
					this.isRefreshing = true
					this.refreshPromise = this.refreshToken().finally(() => {
						this.isRefreshing = false
						this.refreshPromise = null
					})
				}

				if (this.refreshPromise) {
					return await this.refreshPromise
				}
			}

			return accessToken
		} catch {
			localStorage.removeItem('accessToken')
			return null
		}
	}

	async request<T = unknown>(url: string, options: RequestInit = {}): Promise<T> {
		const token = await this.getValidToken()

		const hasBody = options.body !== undefined && options.body !== null
		const headers = {
			...(hasBody && { 'Content-Type': 'application/json' }),
			...options.headers,
			...(token && { Authorization: `Bearer ${token}` }),
		}

		const response = await fetch(url, {
			...options,
			headers,
		})

		if (response.status === 401 && token) {
			try {
				if (!this.isRefreshing) {
					this.isRefreshing = true
					this.refreshPromise = this.refreshToken().finally(() => {
						this.isRefreshing = false
						this.refreshPromise = null
					})
				}

				const newToken = await this.refreshPromise

				const retryHeaders = {
					...(hasBody && { 'Content-Type': 'application/json' }),
					...options.headers,
					Authorization: `Bearer ${newToken}`,
				}

				const retryResponse = await fetch(url, {
					...options,
					headers: retryHeaders,
				})

				if (!retryResponse.ok) {
					const errorData = await retryResponse.json().catch(() => ({}))
					throw new Error(errorData.message || `Erro ${retryResponse.status}`)
				}

				return retryResponse.json()
			} catch (refreshError) {
				localStorage.removeItem('accessToken')
				window.location.href = '/login'
				throw refreshError
			}
		}

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new Error(errorData.message || `Erro ${response.status}`)
		}

		return response.json()
	}

	async get<T = unknown>(url: string, options?: RequestInit): Promise<T> {
		return this.request<T>(url, { ...options, method: 'GET' })
	}

	async post<T = unknown>(url: string, data?: unknown, options?: RequestInit): Promise<T> {
		return this.request<T>(url, {
			...options,
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined,
		})
	}

	async put<T = unknown>(url: string, data?: unknown, options?: RequestInit): Promise<T> {
		return this.request<T>(url, {
			...options,
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined,
		})
	}

	async delete<T = unknown>(url: string, options?: RequestInit): Promise<T> {
		return this.request<T>(url, { ...options, method: 'DELETE' })
	}
}

export const httpClient = new HttpClient()
