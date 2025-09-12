import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeAccessToken, getAccessToken } from '@/hooks/use-auth'
import { useNavigate } from 'react-router-dom'

export function useLogout() {
	const queryClient = useQueryClient()
	const navigate = useNavigate()

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
			queryClient.invalidateQueries({ queryKey: ['auth'] })
			navigate('/login', { replace: true })
		},
		onError: () => {
			queryClient.removeQueries({ queryKey: ['auth'] })
			queryClient.invalidateQueries({ queryKey: ['auth'] })
			navigate('/login', { replace: true })
		},
	})
}
