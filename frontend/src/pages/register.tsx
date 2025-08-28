import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useRegisterAccount } from '@/http/use-register-account'

const registerSchema = z.object({
	name: z.string().min(3, { message: 'Nome precisa ter pelo menos 3 caracteres' }),
	email: z.email({ message: 'Email inválido' }),
	password: z.string().min(8, { message: 'Senha deve ter pelo menos 8 caracteres' }),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function Register() {
	const { mutateAsync: registerAccount } = useRegisterAccount()

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	})

	async function handleRegister(data: RegisterFormData) {
		const response = await registerAccount(data)

		console.log(response)

		form.reset()
	}

	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Card>
					<CardHeader className="text-center">
						<CardTitle className="text-xl">Criar conta</CardTitle>
						<CardDescription>Preencha o formulário abaixo para criar uma conta.</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form className="space-y-6" onSubmit={form.handleSubmit(handleRegister)}>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>Nome completo</FormLabel>
												<FormControl>
													<Input {...field} placeholder="Digite seu nome completo" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)
									}}
								/>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input {...field} placeholder="Digite seu email" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)
									}}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>Senha</FormLabel>
												<FormControl>
													<Input {...field} placeholder="Digite sua senha" type="password" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)
									}}
								/>

								<Button type="submit" className="w-full">
									Criar conta
								</Button>
							</form>
						</Form>
					</CardContent>
					<CardFooter className="flex flex-col gap-2">
						<p className="text-sm text-card-foreground">
							Já tem uma conta?{' '}
							<Link to="/login" className="underline">
								Faça login
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}
