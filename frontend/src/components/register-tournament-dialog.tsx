import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { DialogContent, DialogDescription, DialogTitle } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { useRegisterTournament } from '@/http/use-register-tournament'
import { toast } from 'sonner'

const tournamentSchema = z.object({
	nome: z
		.string()
		.min(2, { message: 'O nome do torneio deve ter pelo menos 2 caracteres' })
		.max(100, { message: 'O nome do torneio deve ter no máximo 100 caracteres' }),
	descricao: z.string().optional(),
	esporte: z.enum(['FUTEBOL', 'BASQUETE', 'VOLEI']).default('FUTEBOL'),
	numeroEquipes: z.enum(['4', '8', '16']).default('4'),
	inicio: z.coerce.string().optional(),
	fim: z.coerce.string().optional(),
})

type TournamentFormData = z.infer<typeof tournamentSchema>

interface RegisterTournamentDialogProps {
	onSuccess?: () => void
}

export function RegisterTournamentDialog({ onSuccess }: RegisterTournamentDialogProps) {
	const registerTournament = useRegisterTournament()

	const form = useForm<TournamentFormData>({
		resolver: zodResolver(tournamentSchema),
		defaultValues: {
			nome: '',
			descricao: '',
			esporte: 'FUTEBOL',
			numeroEquipes: '4',
			inicio: '',
			fim: '',
		},
	})

	function onSubmit(data: TournamentFormData) {
		registerTournament.mutate(
			{
				nome: data.nome,
				descricao: data.descricao,
				esporte: data.esporte,
				numeroEquipes: Number(data.numeroEquipes),
				inicio: data.inicio,
				fim: data.fim,
			},
			{
				onSuccess: () => {
					toast.success('Torneio criado com sucesso!')
					form.reset()
					onSuccess?.()
				},
				onError: (error) => {
					toast.error(error.message || 'Erro ao criar torneio')
				},
			},
		)
	}

	return (
		<DialogContent className="sm:max-w-[600px]">
			<DialogTitle>Cadastrar Novo Torneio</DialogTitle>
			<DialogDescription>Preencha as informações abaixo para criar um novo torneio.</DialogDescription>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="nome"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nome do Torneio</FormLabel>
								<FormControl>
									<Input placeholder="Digite o nome do torneio" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="descricao"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Descrição (Opcional)</FormLabel>
								<FormControl>
									<Input placeholder="Descreva o torneio" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="esporte"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Esporte</FormLabel>
									<FormControl>
										<Select {...field}>
											<option value="FUTEBOL">Futebol</option>
											<option value="BASQUETE">Basquete</option>
											<option value="VOLEI">Vôlei</option>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="numeroEquipes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Número de Equipes</FormLabel>
									<FormControl>
										<Select {...field}>
											<option value="4">4 equipes</option>
											<option value="8">8 equipes</option>
											<option value="16">16 equipes</option>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="inicio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Data de Início (Opcional)</FormLabel>
									<FormControl>
										<Input type="date" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="fim"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Data de Fim (Opcional)</FormLabel>
									<FormControl>
										<Input type="date" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<Button type="submit" disabled={registerTournament.isPending}>
							{registerTournament.isPending ? 'Criando...' : 'Criar Torneio'}
						</Button>
					</div>
				</form>
			</Form>
		</DialogContent>
	)
}
