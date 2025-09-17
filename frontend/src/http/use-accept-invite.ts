import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface AcceptInviteRequest {
	token: string
}

interface AcceptInviteResponse {
	message: string
}

async function acceptInvite({ token }: AcceptInviteRequest): Promise<AcceptInviteResponse> {
	const accessToken = localStorage.getItem('accessToken')

	if (!accessToken) {
		throw new Error('Token de autenticação não encontrado')
	}

	const response = await fetch('http://localhost:3333/convite/aceitar', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ token }),
	})

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}))

		if (response.status === 400) {
			throw new Error(errorData.message || 'Token de convite inválido ou expirado')
		}

		if (response.status === 401) {
			throw new Error('Você precisa estar logado para aceitar o convite')
		}

		throw new Error(errorData.message || 'Erro ao aceitar convite')
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

export function useAcceptInvite() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: acceptInvite,
		onSuccess: (data) => {
			toast.success('Convite aceito com sucesso!', {
				description: data.message,
			})

			// Invalidar a query das equipes para recarregar a lista
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
