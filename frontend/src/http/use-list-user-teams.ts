import { useQuery } from '@tanstack/react-query'

interface UserTeam {
	id: string
	nome: string
	funcao: string
	createdAt: string
}

interface ListUserTeamsResponse {
	equipes: UserTeam[]
}

function getUserIdFromToken(): string | null {
	const token = localStorage.getItem('accessToken')

	if (!token) {
		return null
	}

	try {
		const tokenParts = token.split('.')
		if (tokenParts.length !== 3) {
			return null
		}

		const payload = JSON.parse(atob(tokenParts[1]))
		return payload.sub || payload.id || payload.userId || null
	} catch {
		return null
	}
}

async function listUserTeams(): Promise<ListUserTeamsResponse> {
	const token = localStorage.getItem('accessToken')

	if (!token) {
		throw new Error('Token de autenticação não encontrado')
	}

	const response = await fetch('http://localhost:3333/usuarios/equipes', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))
		throw new Error(errorData.message || 'Erro ao buscar equipes')
	}

	return response.json()
}

export function useListUserTeams() {
	const userId = getUserIdFromToken()

	return useQuery({
		queryKey: ['user-teams', userId],
		queryFn: listUserTeams,
		staleTime: 1000 * 60 * 5, // 5 minutos
		enabled: !!userId, // Só executa se tiver um userId válido
	})
}
