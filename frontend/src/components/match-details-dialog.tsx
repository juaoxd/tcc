import { useState, useEffect, useId } from 'react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Trophy, Calendar, MapPin, Save, Plus, X, AlertCircle, Target, UserX, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface Team {
	id: string
	nome: string
	avatar?: string
}

interface MatchEvent {
	id: string
	type: 'yellow_card' | 'red_card' | 'goal' | 'substitution' | 'injury'
	team: 'team1' | 'team2'
	player: string
	minute: number
	description?: string
}

interface Match {
	id: string
	team1?: Team
	team2?: Team
	winner?: Team
	round: number
	score1?: number
	score2?: number
	date?: string
	location?: string
	status?: 'pending' | 'in_progress' | 'finished'
	events?: MatchEvent[]
}

interface MatchDetailsDialogProps {
	match: Match | null
	open: boolean
	onOpenChange: (open: boolean) => void
	onSave: (match: Match) => void
	roundName: string
}

export function MatchDetailsDialog({ match, open, onOpenChange, onSave, roundName }: MatchDetailsDialogProps) {
	const [score1, setScore1] = useState<string>('')
	const [score2, setScore2] = useState<string>('')
	const [date, setDate] = useState<string>('')
	const [location, setLocation] = useState<string>('')
	const [status, setStatus] = useState<'pending' | 'in_progress' | 'finished'>('pending')
	const [isSaving, setIsSaving] = useState(false)
	const [events, setEvents] = useState<MatchEvent[]>([])
	const [showEventForm, setShowEventForm] = useState(false)
	const [newEvent, setNewEvent] = useState<Omit<MatchEvent, 'id'>>({
		type: 'yellow_card',
		team: 'team1',
		player: '',
		minute: 0,
		description: '',
	})
	const score1Id = useId()
	const score2Id = useId()
	const dateId = useId()
	const locationId = useId()

	useEffect(() => {
		if (match) {
			setScore1(match.score1?.toString() || '')
			setScore2(match.score2?.toString() || '')
			setDate(match.date || '')
			setLocation(match.location || '')
			setStatus(match.status || 'pending')
			setEvents(match.events || [])
		}
	}, [match])

	if (!match) return null

	const handleAddEvent = () => {
		if (!newEvent.player || newEvent.minute < 0) {
			toast.error('Preencha todos os campos do evento')
			return
		}

		const event: MatchEvent = {
			...newEvent,
			id: `event-${Date.now()}`,
		}

		setEvents([...events, event])
		setNewEvent({
			type: 'yellow_card',
			team: 'team1',
			player: '',
			minute: 0,
			description: '',
		})
		setShowEventForm(false)
		toast.success('Evento adicionado com sucesso!')
	}

	const handleRemoveEvent = (eventId: string) => {
		setEvents(events.filter((e) => e.id !== eventId))
		toast.success('Evento removido!')
	}

	const getEventIcon = (type: MatchEvent['type']) => {
		switch (type) {
			case 'yellow_card':
				return <AlertCircle className="h-4 w-4 text-yellow-600" />
			case 'red_card':
				return <AlertCircle className="h-4 w-4 text-red-600" />
			case 'goal':
				return <Target className="h-4 w-4 text-green-600" />
			case 'substitution':
				return <UserX className="h-4 w-4 text-blue-600" />
			case 'injury':
				return <AlertCircle className="h-4 w-4 text-orange-600" />
		}
	}

	const getEventLabel = (type: MatchEvent['type']) => {
		switch (type) {
			case 'yellow_card':
				return 'Cartão Amarelo'
			case 'red_card':
				return 'Cartão Vermelho'
			case 'goal':
				return 'Gol'
			case 'substitution':
				return 'Substituição'
			case 'injury':
				return 'Lesão'
		}
	}

	const handleSave = async () => {
		setIsSaving(true)

		if (status === 'finished' && (!score1 || !score2)) {
			toast.error('Defina os placares para finalizar a partida')
			setIsSaving(false)
			return
		}

		await new Promise((resolve) => setTimeout(resolve, 500))

		const updatedMatch: Match = {
			...match,
			score1: score1 ? parseInt(score1) : undefined,
			score2: score2 ? parseInt(score2) : undefined,
			date,
			location,
			status,
			events,
		}

		if (status === 'finished' && score1 && score2) {
			const s1 = parseInt(score1)
			const s2 = parseInt(score2)
			if (s1 > s2) {
				updatedMatch.winner = match.team1
			} else if (s2 > s1) {
				updatedMatch.winner = match.team2
			}
		}

		onSave(updatedMatch)
		toast.success('Partida atualizada com sucesso!')
		setIsSaving(false)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Trophy className="h-5 w-5 text-blue-600" />
						Detalhes da Partida - {roundName}
					</DialogTitle>
					<DialogDescription>Gerencie as informações e resultados da partida</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Times */}
					<div className="space-y-4">
						<div className="flex items-center justify-between gap-4">
							{/* Time 1 */}
							<div className="flex-1 flex items-center gap-3 p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
								<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-gray-800 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
									{match.team1?.nome.charAt(0) || '?'}
								</div>
								<div className="flex-1">
									<p className="font-bold text-sm text-gray-700">Time 1</p>
									<p className="font-semibold">{match.team1?.nome || 'Aguardando...'}</p>
								</div>
							</div>

							<div className="px-3 py-2 rounded-full bg-gray-100 text-gray-600 font-bold text-sm">VS</div>

							{/* Time 2 */}
							<div className="flex-1 flex items-center gap-3 p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
								<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-gray-800 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
									{match.team2?.nome.charAt(0) || '?'}
								</div>
								<div className="flex-1">
									<p className="font-bold text-sm text-gray-700">Time 2</p>
									<p className="font-semibold">{match.team2?.nome || 'Aguardando...'}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Status */}
					<div className="space-y-2">
						<Label>Status da Partida</Label>
						<div className="flex gap-2">
							<Button
								type="button"
								variant={status === 'pending' ? 'default' : 'outline'}
								size="sm"
								onClick={() => setStatus('pending')}
								className={status === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
							>
								Pendente
							</Button>
							<Button
								type="button"
								variant={status === 'in_progress' ? 'default' : 'outline'}
								size="sm"
								onClick={() => setStatus('in_progress')}
								className={status === 'in_progress' ? 'bg-blue-600 hover:bg-blue-700' : ''}
							>
								Em Andamento
							</Button>
							<Button
								type="button"
								variant={status === 'finished' ? 'default' : 'outline'}
								size="sm"
								onClick={() => setStatus('finished')}
								className={status === 'finished' ? 'bg-green-600 hover:bg-green-700' : ''}
							>
								Finalizada
							</Button>
						</div>
					</div>

					{/* Placar */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor={score1Id}>Placar {match.team1?.nome || 'Time 1'}</Label>
							<Input
								id={score1Id}
								type="number"
								min="0"
								placeholder="0"
								value={score1}
								onChange={(e) => setScore1(e.target.value)}
								disabled={!match.team1 || !match.team2}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={score2Id}>Placar {match.team2?.nome || 'Time 2'}</Label>
							<Input
								id={score2Id}
								type="number"
								min="0"
								placeholder="0"
								value={score2}
								onChange={(e) => setScore2(e.target.value)}
								disabled={!match.team1 || !match.team2}
							/>
						</div>
					</div>

					{/* Data e Hora */}
					<div className="space-y-2">
						<Label htmlFor={dateId} className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							Data e Hora
						</Label>
						<Input id={dateId} type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
					</div>

					{/* Local */}
					<div className="space-y-2">
						<Label htmlFor={locationId} className="flex items-center gap-2">
							<MapPin className="h-4 w-4" />
							Local
						</Label>
						<Input
							id={locationId}
							type="text"
							placeholder="Ex: Arena Sport Center - Campo 1"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
					</div>

					{/* Eventos da Partida */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								Eventos da Partida
							</Label>
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={() => setShowEventForm(!showEventForm)}
								disabled={!match.team1 || !match.team2}
							>
								<Plus className="h-4 w-4 mr-1" />
								Adicionar Evento
							</Button>
						</div>

						{/* Formulário de novo evento */}
						{showEventForm && (
							<div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50 space-y-3">
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-2">
										<Label className="text-xs">Tipo de Evento</Label>
										<Select
											value={newEvent.type}
											onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as MatchEvent['type'] })}
										>
											<option value="yellow_card">Cartão Amarelo</option>
											<option value="red_card">Cartão Vermelho</option>
											<option value="goal">Gol</option>
											<option value="substitution">Substituição</option>
											<option value="injury">Lesão</option>
										</Select>
									</div>
									<div className="space-y-2">
										<Label className="text-xs">Time</Label>
										<Select
											value={newEvent.team}
											onChange={(e) => setNewEvent({ ...newEvent, team: e.target.value as 'team1' | 'team2' })}
										>
											<option value="team1">{match.team1?.nome || 'Time 1'}</option>
											<option value="team2">{match.team2?.nome || 'Time 2'}</option>
										</Select>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-2">
										<Label className="text-xs">Jogador</Label>
										<Input
											type="text"
											placeholder="Nome do jogador"
											value={newEvent.player}
											onChange={(e) => setNewEvent({ ...newEvent, player: e.target.value })}
										/>
									</div>
									<div className="space-y-2">
										<Label className="text-xs">Minuto</Label>
										<Input
											type="number"
											min="0"
											max="120"
											placeholder="0"
											value={newEvent.minute}
											onChange={(e) => setNewEvent({ ...newEvent, minute: parseInt(e.target.value) || 0 })}
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label className="text-xs">Observação (opcional)</Label>
									<Input
										type="text"
										placeholder="Ex: Falta dura no meio campo"
										value={newEvent.description}
										onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
									/>
								</div>
								<div className="flex gap-2 justify-end">
									<Button type="button" size="sm" variant="outline" onClick={() => setShowEventForm(false)}>
										Cancelar
									</Button>
									<Button type="button" size="sm" onClick={handleAddEvent}>
										<Plus className="h-4 w-4 mr-1" />
										Adicionar
									</Button>
								</div>
							</div>
						)}

						{/* Lista de eventos */}
						{events.length > 0 && (
							<div className="space-y-2 max-h-40 overflow-y-auto">
								{events
									.sort((a, b) => a.minute - b.minute)
									.map((event) => (
										<div
											key={event.id}
											className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
										>
											<div className="flex items-center gap-2 flex-1">
												{getEventIcon(event.type)}
												<div className="flex-1">
													<div className="flex items-center gap-2">
														<span className="font-semibold text-sm">{getEventLabel(event.type)}</span>
														<span className="text-xs text-gray-500">
															• {event.team === 'team1' ? match.team1?.nome : match.team2?.nome}
														</span>
													</div>
													<div className="text-xs text-gray-600">
														{event.player} • {event.minute}'
														{event.description && <span className="ml-1 italic">- {event.description}</span>}
													</div>
												</div>
											</div>
											<Button type="button" size="sm" variant="ghost" onClick={() => handleRemoveEvent(event.id)}>
												<X className="h-4 w-4 text-gray-400 hover:text-red-600" />
											</Button>
										</div>
									))}
							</div>
						)}
					</div>

					{/* Vencedor */}
					{status === 'finished' && score1 && score2 && (
						<div className="p-4 rounded-lg bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300">
							<div className="flex items-center gap-2">
								<Trophy className="h-5 w-5 text-yellow-700" />
								<span className="font-semibold text-yellow-900">
									Vencedor:{' '}
									{parseInt(score1) > parseInt(score2)
										? match.team1?.nome
										: parseInt(score2) > parseInt(score1)
											? match.team2?.nome
											: 'Empate'}
								</span>
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
						Cancelar
					</Button>
					<Button onClick={handleSave} disabled={isSaving}>
						{isSaving ? (
							<>
								<Clock className="h-4 w-4 mr-2 animate-spin" />
								Salvando...
							</>
						) : (
							<>
								<Save className="h-4 w-4 mr-2" />
								Salvar Alterações
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
