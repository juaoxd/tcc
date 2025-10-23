import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { httpClient } from '@/lib/http-client'

interface RegisterTeamRequest {
	nome: string
}

interface RegisterTeamResponse {
	id: string
	nome: string
}

async function registerTeam({ nome }: RegisterTeamRequest): Promise<RegisterTeamResponse> {
	return httpClient.post<RegisterTeamResponse>('http://localhost:3333/equipes', { nome })
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
