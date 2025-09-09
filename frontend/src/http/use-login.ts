import { useMutation, useQueryClient } from '@tanstack/react-query'

type LoginRequest = {
	email: string
	password: string
}

type LoginResponse = {
	user: {
		id: string
		email: string
	}
	token: string
}

export function useLogin() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: LoginRequest) => {
			const response = await fetch('http://localhost:3333/login', {
				method: 'POST',
				body: JSON.stringify({
					email: data.email,
					senha: data.password,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message)
			}

			const result: LoginResponse = await response.json()

			return result
		},
		onSuccess: (data) => {
			localStorage.setItem('accessToken', data.token)

			queryClient.setQueryData(['auth'], { user: data.user })

			queryClient.invalidateQueries({ queryKey: ['auth'] })
		},
	})
}
