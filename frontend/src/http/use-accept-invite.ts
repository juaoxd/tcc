import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { httpClient } from '@/lib/http-client'

interface AcceptInviteRequest {
	token: string
}

interface AcceptInviteResponse {
	message: string
	alreadyInTeam?: boolean
}

async function acceptInvite({ token }: AcceptInviteRequest): Promise<AcceptInviteResponse> {
	try {
		const responseData = await httpClient.post<AcceptInviteResponse>('http://localhost:3333/convite/aceitar', { token })

		if (responseData.message === 'Usuário já faz parte da equipe') {
			return {
				...responseData,
				alreadyInTeam: true,
			}
		}

		return responseData
	} catch (error) {
		if (error instanceof Error) {
			if (error.message.includes('400')) {
				throw new Error('Token de convite inválido ou expirado')
			}
			if (error.message.includes('401')) {
				throw new Error('Você precisa estar logado para aceitar o convite')
			}
		}
		throw error
	}
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

export function useAcceptInvite() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: acceptInvite,
		onSuccess: (data) => {
			if (data.alreadyInTeam) {
				toast.info('Você já faz parte desta equipe', {
					description: data.message,
				})
			} else {
				toast.success('Convite aceito com sucesso!', {
					description: data.message,
				})
			}

			const userId = getUserIdFromToken()
			queryClient.invalidateQueries({ queryKey: ['user-teams', userId] })
		},
		onError: (error: Error) => {
			toast.error('Erro ao aceitar convite', {
				description: error.message,
			})
		},
	})
}
