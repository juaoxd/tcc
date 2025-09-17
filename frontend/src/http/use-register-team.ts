import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface RegisterTeamRequest {
	nome: string
}

interface RegisterTeamResponse {
	id: string
	nome: string
	// Adicione outros campos conforme a resposta da API
}

async function registerTeam({ nome }: RegisterTeamRequest): Promise<RegisterTeamResponse> {
	const token = localStorage.getItem('accessToken')

	if (!token) {
		throw new Error('Token de autenticação não encontrado')
	}

	const response = await fetch('http://localhost:3333/equipes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ nome }),
	})

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))
		throw new Error(errorData.message || 'Erro ao cadastrar equipe')
	}

	return response.json()
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

export function useRegisterTeam() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: registerTeam,
		onSuccess: () => {
			toast.success('Equipe cadastrada com sucesso!')
			// Invalidar a query das equipes para recarregar a lista
			const userId = getUserIdFromToken()
			queryClient.invalidateQueries({ queryKey: ['user-teams', userId] })
		},
		onError: (error: Error) => {
			toast.error('Erro ao cadastrar equipe', {
				description: error.message,
			})
		},
	})
}
