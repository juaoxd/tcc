import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Trophy, Users, ArrowLeft, Calendar, MapPin, Clock, Edit } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { MatchDetailsDialog } from '@/components/match-details-dialog'

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

const MOCK_TEAMS: Team[] = [
	{ id: '1', nome: 'Dragões FC' },
	{ id: '2', nome: 'Leões United' },
	{ id: '3', nome: 'Tigres FC' },
	{ id: '4', nome: 'Águias United' },
	{ id: '5', nome: 'Falcões FC' },
	{ id: '6', nome: 'Tubarões United' },
	{ id: '7', nome: 'Lobos FC' },
	{ id: '8', nome: 'Panteras United' },
]

const createInitialMatches = (teams: Team[]): Match[] => {
	const shuffled = [...teams].sort(() => Math.random() - 0.5)
	const allMatches: Match[] = []

	for (let i = 0; i < shuffled.length; i += 2) {
		allMatches.push({
			id: `match-1-${i / 2}`,
			team1: shuffled[i],
			team2: shuffled[i + 1],
			round: 1,
			status: 'pending',
		})
	}

	const totalRounds = Math.log2(shuffled.length)
	let matchesPerRound = shuffled.length / 2

	for (let round = 2; round <= totalRounds; round++) {
		matchesPerRound = matchesPerRound / 2
		for (let i = 0; i < matchesPerRound; i++) {
			allMatches.push({
				id: `match-${round}-${i}`,
				round,
				status: 'pending',
			})
		}
	}

	return allMatches
}

function ManageTournamentContent() {
	const navigate = useNavigate()
	const { tournamentId } = useParams<{ tournamentId: string }>()
	const [matches, setMatches] = useState<Match[]>(createInitialMatches(MOCK_TEAMS))
	const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const { open } = useSidebar()

	console.log('Gerenciando torneio:', tournamentId)

	const teams = MOCK_TEAMS

	const getRoundName = (round: number, totalRounds: number) => {
		const roundsFromEnd = totalRounds - round
		if (roundsFromEnd === 0) return 'Final'
		if (roundsFromEnd === 1) return 'Semifinal'
		if (roundsFromEnd === 2) return 'Quartas de Final'
		return `Oitavas de Final`
	}

	const getMatchesByRound = (round: number) => {
		return matches.filter((match) => match.round === round)
	}

	const getPossibleTeams = (match: Match, position: 'team1' | 'team2'): Team[] => {
		if (match.round === 1) return []

		const previousRound = match.round - 1
		const previousMatches = getMatchesByRound(previousRound)
		const currentRoundMatches = getMatchesByRound(match.round)
		const matchIndex = currentRoundMatches.findIndex((m) => m.id === match.id)

		const sourceMatchIndex = position === 'team1' ? matchIndex * 2 : matchIndex * 2 + 1
		const sourceMatch = previousMatches[sourceMatchIndex]

		if (!sourceMatch) return []

		const possibleTeams: Team[] = []
		if (sourceMatch.team1) possibleTeams.push(sourceMatch.team1)
		if (sourceMatch.team2) possibleTeams.push(sourceMatch.team2)

		return possibleTeams
	}

	const totalRounds = teams.length > 0 ? Math.log2(teams.length) : 0

	const handleMatchClick = (match: Match) => {
		if (!match.team1 || !match.team2) {
			return
		}
		setSelectedMatch(match)
		setIsDialogOpen(true)
	}

	const handleSaveMatch = (updatedMatch: Match) => {
		setMatches((prevMatches) => {
			const newMatches = prevMatches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m))

			if (updatedMatch.status === 'finished' && updatedMatch.winner) {
				const currentRoundMatches = newMatches.filter((m) => m.round === updatedMatch.round)
				const matchIndex = currentRoundMatches.findIndex((m) => m.id === updatedMatch.id)

				if (updatedMatch.round < totalRounds) {
					const nextRound = updatedMatch.round + 1
					const nextRoundMatches = newMatches.filter((m) => m.round === nextRound)
					const nextMatchIndex = Math.floor(matchIndex / 2)
					const nextMatch = nextRoundMatches[nextMatchIndex]

					if (nextMatch) {
						const isFirstTeam = matchIndex % 2 === 0
						const updatedNextMatch = {
							...nextMatch,
							[isFirstTeam ? 'team1' : 'team2']: updatedMatch.winner,
						}

						return newMatches.map((m) => (m.id === updatedNextMatch.id ? updatedNextMatch : m))
					}
				}
			}

			return newMatches
		})
	}

	const getStatusBadge = (status?: string) => {
		switch (status) {
			case 'finished':
				return (
					<div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-green-500 text-white text-[8px] font-bold shadow-sm">
						Finalizada
					</div>
				)
			case 'in_progress':
				return (
					<div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-blue-500 text-white text-[8px] font-bold shadow-sm animate-pulse">
						Em Andamento
					</div>
				)
			default:
				return null
		}
	}

	const renderMatchCard = (match: Match) => {
		const possibleTeams1 = !match.team1 ? getPossibleTeams(match, 'team1') : []
		const possibleTeams2 = !match.team2 ? getPossibleTeams(match, 'team2') : []
		const hasTeams = match.team1 && match.team2
		const isClickable = hasTeams

		const handleClick = () => {
			if (isClickable) {
				handleMatchClick(match)
			}
		}

		const CardWrapper = isClickable ? 'button' : 'div'

		return (
			<CardWrapper
				className={`relative bg-white border-2 border-gray-200 rounded-lg p-3 space-y-2 transition-all w-[220px] text-left ${
					isClickable ? 'cursor-pointer hover:shadow-xl hover:border-blue-400 hover:scale-105' : ''
				}`}
				onClick={isClickable ? handleClick : undefined}
				type={isClickable ? 'button' : undefined}
			>
				{getStatusBadge(match.status)}

				{isClickable && (
					<div className="absolute top-2 left-2 p-1 rounded-full bg-blue-100 text-blue-600">
						<Edit className="h-3 w-3" />
					</div>
				)}

				<div
					className={`flex items-center gap-2 p-2 rounded transition-all ${
						match.winner?.id === match.team1?.id
							? 'bg-gray-100 border-2 border-gray-400 shadow-md'
							: match.team1
								? 'bg-blue-50 border border-blue-200'
								: 'bg-gray-50 border border-dashed border-gray-300'
					}`}
				>
					{match.team1 ? (
						<>
							<div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-gray-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
								{match.team1.nome.charAt(0)}
							</div>
							<span className="font-semibold text-xs flex-1 truncate">{match.team1.nome}</span>
							{match.score1 !== undefined && <span className="font-bold text-sm text-blue-700">{match.score1}</span>}
							{match.winner?.id === match.team1?.id && <Trophy className="h-4 w-4 text-gray-600" />}
						</>
					) : possibleTeams1.length > 0 ? (
						<div className="flex-1 py-0.5">
							<div className="flex flex-col gap-0.5">
								{possibleTeams1.map((team) => (
									<div key={team.id} className="flex items-center gap-1.5 opacity-40">
										<div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-gray-600 flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
											{team.nome.charAt(0)}
										</div>
										<span className="text-[9px] text-gray-500 truncate">{team.nome}</span>
									</div>
								))}
							</div>
						</div>
					) : (
						<span className="text-xs text-gray-400 italic flex-1 text-center py-0.5">Aguardando...</span>
					)}
				</div>

				<div className="text-center text-[9px] text-gray-500 font-semibold">VS</div>

				<div
					className={`flex items-center gap-2 p-2 rounded transition-all ${
						match.winner?.id === match.team2?.id
							? 'bg-gray-100 border-2 border-gray-400 shadow-md'
							: match.team2
								? 'bg-blue-50 border border-blue-200'
								: 'bg-gray-50 border border-dashed border-gray-300'
					}`}
				>
					{match.team2 ? (
						<>
							<div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-gray-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
								{match.team2.nome.charAt(0)}
							</div>
							<span className="font-semibold text-xs flex-1 truncate">{match.team2.nome}</span>
							{match.score2 !== undefined && <span className="font-bold text-sm text-blue-700">{match.score2}</span>}
							{match.winner?.id === match.team2?.id && <Trophy className="h-4 w-4 text-gray-600" />}
						</>
					) : possibleTeams2.length > 0 ? (
						<div className="flex-1 py-0.5">
							<div className="flex flex-col gap-0.5">
								{possibleTeams2.map((team) => (
									<div key={team.id} className="flex items-center gap-1.5 opacity-40">
										<div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-gray-600 flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0">
											{team.nome.charAt(0)}
										</div>
										<span className="text-[9px] text-gray-500 truncate">{team.nome}</span>
									</div>
								))}
							</div>
						</div>
					) : (
						<span className="text-xs text-gray-400 italic flex-1 text-center py-0.5">Aguardando...</span>
					)}
				</div>

				{hasTeams && (
					<div className="pt-2 border-t border-gray-200 space-y-1">
						{match.date && (
							<div className="flex items-center gap-1 text-[9px] text-gray-600">
								<Calendar className="h-3 w-3" />
								<span className="truncate">{new Date(match.date).toLocaleDateString('pt-BR')}</span>
							</div>
						)}
						{match.location && (
							<div className="flex items-center gap-1 text-[9px] text-gray-600">
								<MapPin className="h-3 w-3" />
								<span className="truncate">{match.location}</span>
							</div>
						)}
					</div>
				)}
			</CardWrapper>
		)
	}

	const handleSectionChange = (_section: string) => {
		navigate('/dashboard')
	}

	return (
		<>
			<AppSidebar activeSection="organizer" onSectionChange={handleSectionChange} />
			<main className="flex-1 overflow-hidden">
				<div className="flex h-full flex-col">
					<header className="border-b bg-background px-6 py-3">
						<div className="flex items-center gap-4">
							{!open && <SidebarTrigger />}
							<Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
								<ArrowLeft className="h-4 w-4" />
							</Button>
							<div className="flex-1">
								<h1 className="text-2xl font-bold">Gerenciar Torneio</h1>
								<p className="text-sm text-muted-foreground">Acompanhe e gerencie as partidas do torneio</p>
							</div>
						</div>
					</header>
					<div className="flex-1 overflow-y-auto p-6">
						<div className="max-w-7xl mx-auto space-y-6">
							{/* Informações do Torneio */}
							<Card>
								<CardHeader>
									<div className="flex items-center gap-4">
										<div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-gray-800 flex items-center justify-center text-white shadow-lg">
											<Trophy className="h-8 w-8" />
										</div>
										<div className="flex-1">
											<CardTitle className="text-2xl">Campeonato de Futebol 2024</CardTitle>
											<p className="text-sm text-muted-foreground mt-1">
												Torneio eliminatório • {teams.length} times participantes
											</p>
										</div>
										<div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
											Em Andamento
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										<div className="flex items-start gap-3">
											<div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
												<Trophy className="h-5 w-5" />
											</div>
											<div>
												<p className="text-xs text-muted-foreground">Esporte</p>
												<p className="font-semibold text-sm">Futebol Society</p>
											</div>
										</div>

										<div className="flex items-start gap-3">
											<div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
												<Calendar className="h-5 w-5" />
											</div>
											<div>
												<p className="text-xs text-muted-foreground">Data de Início</p>
												<p className="font-semibold text-sm">15 de Novembro</p>
												<p className="text-xs text-muted-foreground">2024, 14:00</p>
											</div>
										</div>

										<div className="flex items-start gap-3">
											<div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
												<Clock className="h-5 w-5" />
											</div>
											<div>
												<p className="text-xs text-muted-foreground">Previsão de Término</p>
												<p className="font-semibold text-sm">17 de Novembro</p>
												<p className="text-xs text-muted-foreground">2024, 18:00</p>
											</div>
										</div>

										<div className="flex items-start gap-3">
											<div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
												<MapPin className="h-5 w-5" />
											</div>
											<div>
												<p className="text-xs text-muted-foreground">Local</p>
												<p className="font-semibold text-sm">Arena Sport Center</p>
												<p className="text-xs text-muted-foreground">São Paulo, SP</p>
											</div>
										</div>

										<div className="flex items-start gap-3">
											<div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
												<Users className="h-5 w-5" />
											</div>
											<div>
												<p className="text-xs text-muted-foreground">Formato</p>
												<p className="font-semibold text-sm">Mata-mata</p>
												<p className="text-xs text-muted-foreground">{Math.log2(teams.length)} rodadas</p>
											</div>
										</div>

										<div className="flex items-start gap-3">
											<div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0">
												<Clock className="h-5 w-5" />
											</div>
											<div>
												<p className="text-xs text-muted-foreground">Duração das Partidas</p>
												<p className="font-semibold text-sm">2x 25 minutos</p>
												<p className="text-xs text-muted-foreground">Intervalo de 5 min</p>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<div>
										<CardTitle className="text-lg">Chaves do Torneio</CardTitle>
										<p className="text-sm text-muted-foreground">Clique em uma partida para gerenciar seus detalhes</p>
									</div>
								</CardHeader>
								<CardContent>
									<div className="overflow-x-auto pb-8">
										<div className="flex gap-24 justify-center px-8 py-4 min-w-max">
											{totalRounds >= 3 && (
												<div className="flex flex-col">
													<h3 className="text-sm font-bold text-center text-gray-600 mb-6 h-8">
														{getRoundName(1, totalRounds)}
													</h3>
													<div className="flex flex-col justify-around" style={{ height: '700px' }}>
														{getMatchesByRound(1).map((match) => (
															<div key={match.id} className="flex items-center">
																{renderMatchCard(match)}
															</div>
														))}
													</div>
												</div>
											)}

											{totalRounds >= 2 && (
												<div className="flex flex-col">
													<h3 className="text-sm font-bold text-center text-gray-600 mb-6 h-8">
														{getRoundName(totalRounds - 1, totalRounds)}
													</h3>
													<div className="flex flex-col justify-around" style={{ height: '700px' }}>
														{getMatchesByRound(totalRounds - 1).map((match) => (
															<div key={match.id} className="flex items-center">
																{renderMatchCard(match)}
															</div>
														))}
													</div>
												</div>
											)}

											<div className="flex flex-col">
												<h3 className="text-sm font-bold text-center text-gray-600 mb-6 h-8">Final</h3>
												<div className="flex flex-col justify-around" style={{ height: '700px' }}>
													{getMatchesByRound(totalRounds).map((match) => (
														<div key={match.id} className="flex items-center">
															{renderMatchCard(match)}
														</div>
													))}
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</main>

			{/* Modal de Detalhes da Partida */}
			<MatchDetailsDialog
				match={selectedMatch}
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onSave={handleSaveMatch}
				roundName={selectedMatch ? getRoundName(selectedMatch.round, totalRounds) : ''}
			/>
		</>
	)
}

export function ManageTournament() {
	return (
		<SidebarProvider>
			<ManageTournamentContent />
		</SidebarProvider>
	)
}
