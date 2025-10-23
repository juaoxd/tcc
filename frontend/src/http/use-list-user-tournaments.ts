import { useQuery } from '@tanstack/react-query'
import { getAccessToken } from '@/hooks/use-auth'
import { httpClient } from '@/lib/http-client'

type Tournament = {
	id: string
	nome: string
	descricao?: string
	esporte: 'FUTEBOL' | 'BASQUETE' | 'VOLEI'
	numeroEquipes?: number
	inicio?: string | null
	fim?: string | null
	usuarioId: string
	createdAt: string
	updatedAt?: string
}

export function useListUserTournaments() {
	return useQuery({
		queryKey: ['tournaments', 'user'],
		queryFn: async (): Promise<Tournament[]> => {
			const result = await httpClient.get<{ torneios?: Tournament[] } | Tournament[]>(
				'http://localhost:3333/usuarios/torneios',
				{
					credentials: 'include',
				},
			)

			if (result?.torneios && Array.isArray(result.torneios)) {
				return result.torneios
			}

			if (Array.isArray(result)) {
				return result
			}

			return []
		},
		enabled: !!getAccessToken(),
	})
}
