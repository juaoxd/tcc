import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { DialogContent, DialogDescription, DialogTitle } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

const teamSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'O nome da equipe deve ter pelo menos 2 caracteres' })
		.max(50, { message: 'O nome da equipe deve ter no máximo 50 caracteres' }),
	description: z
		.string()
		.min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' })
		.max(200, { message: 'A descrição deve ter no máximo 200 caracteres' }),
	maxMembers: z
		.number()
		.min(2, { message: 'Uma equipe deve ter pelo menos 2 membros' })
		.max(20, { message: 'Uma equipe pode ter no máximo 20 membros' }),
})

type TeamFormData = z.infer<typeof teamSchema>

export function RegisterTeamDialog() {
	const form = useForm<TeamFormData>({
		resolver: zodResolver(teamSchema),
		defaultValues: {
			name: '',
			description: '',
			maxMembers: 4,
		},
	})

	function onSubmit(data: TeamFormData) {
		console.log('Dados da equipe:', data)
		// Aqui você pode implementar a lógica para enviar os dados para o backend
	}

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogTitle>Cadastrar Nova Equipe</DialogTitle>
			<DialogDescription>Preencha as informações abaixo para criar uma nova equipe.</DialogDescription>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nome da Equipe</FormLabel>
								<FormControl>
									<Input placeholder="Digite o nome da equipe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Descrição</FormLabel>
								<FormControl>
									<Input placeholder="Descreva o objetivo da equipe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="maxMembers"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Número Máximo de Membros</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="4"
										{...field}
										onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end gap-3 pt-4">
						<Button type="submit" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? 'Criando...' : 'Criar Equipe'}
						</Button>
					</div>
				</form>
			</Form>
		</DialogContent>
	)
}
