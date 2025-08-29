import { useMutation, useQueryClient } from '@tanstack/react-query'

type RegisterAccountRequest = {
	name: string
	email: string
	password: string
}

type RegisterAccountResponse = {
	id: string
}

export function useRegisterAccount() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data: RegisterAccountRequest) => {
			const response = await fetch('http://localhost:3333/register', {
				method: 'POST',
				body: JSON.stringify({
					nome: data.name,
					email: data.email,
					senha: data.password,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.message)
			}

			const result: RegisterAccountResponse = await response.json()

			return result
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] })
		},
	})
}
