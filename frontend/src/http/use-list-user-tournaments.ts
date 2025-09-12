import { useQuery } from '@tanstack/react-query'
import { getAccessToken } from '@/hooks/use-auth'

type Tournament = {
	id: string
	nome: string
	descricao?: string
	esporte: 'FUTEBOL' | 'BASQUETE' | 'VOLEI'
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
			const accessToken = getAccessToken()

			const response = await fetch('http://localhost:3333/usuarios/torneios', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					...(accessToken && { Authorization: `Bearer ${accessToken}` }),
				},
				credentials: 'include',
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message || 'Erro ao buscar torneios')
			}

			const result = await response.json()

			// A API retorna um objeto com a propriedade 'torneios'
			if (result?.torneios && Array.isArray(result.torneios)) {
				return result.torneios
			}

			// Fallback para outros formatos possíveis
			if (Array.isArray(result)) {
				return result
			}

			// Se não encontrar array, retorna array vazio
			return []
		},
		enabled: !!getAccessToken(), // Só executa se tiver token
	})
}
