import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { DialogContent, DialogDescription, DialogTitle } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { Upload, X } from 'lucide-react'
import { useState, useRef } from 'react'
import { useRegisterTeam } from '../http/use-register-team'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const teamSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'O nome da equipe deve ter pelo menos 2 caracteres' })
		.max(50, { message: 'O nome da equipe deve ter no máximo 50 caracteres' }),
	description: z
		.string()
		.min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' })
		.max(500, { message: 'A descrição deve ter no máximo 500 caracteres' }),
	maxMembers: z
		.number()
		.min(2, { message: 'Uma equipe deve ter pelo menos 2 membros' })
		.max(20, { message: 'Uma equipe pode ter no máximo 20 membros' }),
	logo: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			if (!file) return true
			return file.size <= MAX_FILE_SIZE
		}, 'O arquivo deve ter no máximo 5MB')
		.refine((file) => {
			if (!file) return true
			return ACCEPTED_IMAGE_TYPES.includes(file.type)
		}, 'Apenas arquivos JPEG, PNG ou WebP são aceitos'),
})

type TeamFormData = z.infer<typeof teamSchema>

interface RegisterTeamDialogProps {
	onSuccess?: () => void
}

export function RegisterTeamDialog({ onSuccess }: RegisterTeamDialogProps) {
	const [logoPreview, setLogoPreview] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const registerTeamMutation = useRegisterTeam()

	const form = useForm<TeamFormData>({
		resolver: zodResolver(teamSchema),
		defaultValues: {
			name: '',
			description: '',
			maxMembers: 4,
			logo: undefined,
		},
	})

	function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		if (file) {
			if (file.size > MAX_FILE_SIZE) {
				form.setError('logo', { message: 'O arquivo deve ter no máximo 5MB' })
				return
			}
			if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
				form.setError('logo', { message: 'Apenas arquivos JPEG, PNG ou WebP são aceitos' })
				return
			}

			form.setValue('logo', file)
			form.clearErrors('logo')

			const reader = new FileReader()
			reader.onload = (e) => {
				setLogoPreview(e.target?.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	function removeLogo() {
		form.setValue('logo', undefined)
		setLogoPreview(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	async function onSubmit(data: TeamFormData) {
		try {
			await registerTeamMutation.mutateAsync({
				nome: data.name,
			})

			form.reset()
			setLogoPreview(null)
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}

			onSuccess?.()
		} catch {}
	}

	return (
		<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
			<DialogTitle>Cadastrar Nova Equipe</DialogTitle>
			<DialogDescription>Preencha as informações abaixo para criar uma nova equipe.</DialogDescription>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="logo"
						render={() => (
							<FormItem>
								<FormLabel>Logo da Equipe (Opcional)</FormLabel>
								<FormControl>
									<div className="space-y-4">
										{logoPreview ? (
											<Card className="w-full">
												<CardContent className="p-4">
													<div className="relative">
														<img
															src={logoPreview}
															alt="Preview do logo"
															className="w-full h-32 object-cover rounded-md"
														/>
														<Button
															type="button"
															variant="destructive"
															size="sm"
															className="absolute top-2 right-2"
															onClick={removeLogo}
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												</CardContent>
											</Card>
										) : (
											<Card
												className="w-full border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
												onClick={() => fileInputRef.current?.click()}
											>
												<CardContent className="p-6">
													<div className="flex flex-col items-center justify-center space-y-2 text-center">
														<div className="p-3 bg-muted rounded-full">
															<Upload className="h-6 w-6 text-muted-foreground" />
														</div>
														<div className="space-y-1">
															<p className="text-sm font-medium">Clique para fazer upload</p>
															<p className="text-xs text-muted-foreground">PNG, JPG, JPEG ou WebP (máx. 5MB)</p>
														</div>
													</div>
												</CardContent>
											</Card>
										)}
										<input
											ref={fileInputRef}
											type="file"
											accept={ACCEPTED_IMAGE_TYPES.join(',')}
											onChange={handleFileSelect}
											className="hidden"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nome da Equipe *</FormLabel>
								<FormControl>
									<Input placeholder="Ex: Os Vingadores" {...field} className="h-11" />
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
								<FormLabel>Descrição *</FormLabel>
								<FormControl>
									<textarea
										placeholder="Descreva o objetivo, estilo de jogo ou características da equipe..."
										{...field}
										className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
										rows={3}
									/>
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
								<FormLabel>Número Máximo de Membros *</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="4"
										min="2"
										max="20"
										{...field}
										onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
										className="h-11"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end gap-3 pt-4 border-t">
						<Button type="submit" disabled={registerTeamMutation.isPending} className="min-w-[120px]">
							{registerTeamMutation.isPending ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
									Criando...
								</>
							) : (
								<>Criar Equipe</>
							)}
						</Button>
					</div>
				</form>
			</Form>
		</DialogContent>
	)
}
