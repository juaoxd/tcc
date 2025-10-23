import { useQuery } from '@tanstack/react-query'

type AuthUser = {
	id: string
	email: string
}

async function refreshToken(): Promise<string> {
	const response = await fetch('http://localhost:3333/refresh', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
	})

	if (!response.ok) {
		throw new Error('Não foi possível renovar o token')
	}

	const data = await response.json()

	localStorage.setItem('accessToken', data.token)

	return data.token
}

async function verifyAuth(): Promise<{ user: AuthUser }> {
	const accessToken = localStorage.getItem('accessToken')

	if (!accessToken) {
		throw new Error('Não autenticado')
	}

	const tokenParts = accessToken.split('.')

	if (tokenParts.length !== 3) {
		localStorage.removeItem('accessToken')
		throw new Error('Token inválido - formato incorreto')
	}

	try {
		const payload = JSON.parse(atob(tokenParts[1]))

		const now = Date.now() / 1000

		if (payload.exp && payload.exp < now) {
			try {
				const newToken = await refreshToken()

				const newTokenParts = newToken.split('.')
				if (newTokenParts.length === 3) {
					const newPayload = JSON.parse(atob(newTokenParts[1]))
					return {
						user: {
							id: newPayload.sub || newPayload.id || newPayload.userId || 'unknown',
							email: newPayload.email || newPayload.user?.email || 'user@example.com',
						},
					}
				}
			} catch (refreshError) {
				localStorage.removeItem('accessToken')
				throw new Error('Token expirado e não foi possível renovar')
			}
		}

		return {
			user: {
				id: payload.sub || payload.id || payload.userId || 'unknown',
				email: payload.email || payload.user?.email || 'user@example.com',
			},
		}
	} catch (error) {
		localStorage.removeItem('accessToken')
		throw new Error('Token inválido')
	}
}

export function useAuth() {
	return useQuery({
		queryKey: ['auth'],
		queryFn: verifyAuth,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 5,
	})
}

export function getAccessToken(): string | null {
	return localStorage.getItem('accessToken')
}

export function removeAccessToken(): void {
	localStorage.removeItem('accessToken')
}
