import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { httpClient } from '@/lib/http-client'

interface InviteToTeamRequest {
	idEquipe: string
}

interface InviteToTeamResponse {
	linkConvite: string
	expiresIn: string
}

async function inviteToTeam({ idEquipe }: InviteToTeamRequest): Promise<InviteToTeamResponse> {
	try {
		return await httpClient.post<InviteToTeamResponse>(`http://localhost:3333/equipes/${idEquipe}/convite`)
	} catch (error) {
		if (error instanceof Error && error.message.includes('403')) {
			throw new Error('Você não tem permissão para convidar participantes para esta equipe')
		}
		throw error
	}
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
