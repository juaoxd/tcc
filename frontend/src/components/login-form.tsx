import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin } from '@/http/use-login'
import { toast } from 'sonner'

const loginSchema = z.object({
	email: z.email({ message: 'Email inválido' }),
	password: z.string(),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
	const { mutateAsync: login } = useLogin()
	const navigate = useNavigate()

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	async function handleLogin(data: LoginFormData) {
		try {
			await login(data)

			navigate('/')
		} catch (error) {
			toast.error('Erro ao fazer login', {
				description: error instanceof Error ? error.message : 'Erro ao fazer login',
				richColors: true,
			})
		}
	}

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-xl">Login</CardTitle>
				<CardDescription>Faça login para continuar</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form className="space-y-6" onSubmit={form.handleSubmit(handleLogin)}>
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
							Entrar
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex flex-col gap-2">
				<p className="text-sm text-card-foreground">
					Não tem uma conta?{' '}
					<Link to="/register" className="underline">
						Crie uma conta
					</Link>
				</p>
			</CardFooter>
		</Card>
	)
}
