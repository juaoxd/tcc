import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

interface InviteToTeamRequest {
	idEquipe: string
}

interface InviteToTeamResponse {
	linkConvite: string
	expiresIn: string
}

async function inviteToTeam({ idEquipe }: InviteToTeamRequest): Promise<InviteToTeamResponse> {
	const token = localStorage.getItem('accessToken')

	if (!token) {
		throw new Error('Token de autenticação não encontrado')
	}

	const response = await fetch(`http://localhost:3333/equipes/${idEquipe}/convite`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))

		if (response.status === 403) {
			throw new Error('Você não tem permissão para convidar participantes para esta equipe')
		}

		throw new Error(errorData.message || 'Erro ao gerar convite')
	}

	return response.json()
}

export function useInviteToTeam() {
	return useMutation({
		mutationFn: inviteToTeam,
		onSuccess: () => {
			toast.success('Link de convite gerado com sucesso!')
		},
		onError: (error: Error) => {
			toast.error('Erro ao gerar convite', {
				description: error.message,
			})
		},
	})
}
