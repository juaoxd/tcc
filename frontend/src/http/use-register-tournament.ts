import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getAccessToken } from '@/hooks/use-auth'

type RegisterTournamentRequest = {
	nome: string
	descricao?: string
	esporte?: 'FUTEBOL' | 'BASQUETE' | 'VOLEI'
	numeroEquipes?: number
	inicio?: string
	fim?: string
}

type RegisterTournamentResponse = {
	id: string
	nome: string
	descricao?: string
	esporte: 'FUTEBOL' | 'BASQUETE' | 'VOLEI'
	inicio?: string
	fim?: string
	usuarioId: string
}

export function useRegisterTournament() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: RegisterTournamentRequest) => {
			const accessToken = getAccessToken()

			const response = await fetch('http://localhost:3333/torneios', {
				method: 'POST',
				body: JSON.stringify({
					nome: data.nome,
					descricao: data.descricao,
					esporte: data.esporte || 'FUTEBOL',
					numeroEquipes: data.numeroEquipes || 4,
					inicio: data.inicio,
					fim: data.fim,
				}),
				headers: {
					'Content-Type': 'application/json',
					...(accessToken && { Authorization: `Bearer ${accessToken}` }),
				},
				credentials: 'include',
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || 'Erro ao cadastrar torneio')
			}

			const result: RegisterTournamentResponse = await response.json()

			return result
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tournaments'] })
		},
	})
}
