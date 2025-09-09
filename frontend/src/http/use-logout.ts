import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeAccessToken, getAccessToken } from '@/hooks/use-auth'

export function useLogout() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async () => {
			const accessToken = getAccessToken()

			const response = await fetch('http://localhost:3333/logout', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...(accessToken && { Authorization: `Bearer ${accessToken}` }),
				},
			})

			removeAccessToken()

			if (!response.ok) {
				throw new Error('Erro ao fazer logout')
			}

			return response.json()
		},
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: ['auth'] })
		},
		onError: () => {
			queryClient.removeQueries({ queryKey: ['auth'] })
		},
	})
}
