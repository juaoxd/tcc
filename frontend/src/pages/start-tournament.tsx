import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Shuffle, Trophy, Users, ArrowLeft, Calendar, MapPin, Clock, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface Team {
	id: string
	nome: string
	avatar?: string
}

interface Match {
	id: string
	team1?: Team
	team2?: Team
	winner?: Team
	round: number
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

function StartTournamentContent() {
	const navigate = useNavigate()
	const [isShuffled, setIsShuffled] = useState(false)
	const [matches, setMatches] = useState<Match[]>([])
	const [teams] = useState<Team[]>(MOCK_TEAMS)
	const [isStarting, setIsStarting] = useState(false)
	const { open } = useSidebar()

	const shuffleTeams = () => {
		const shuffled = [...teams].sort(() => Math.random() - 0.5)

		const initialMatches: Match[] = []
		for (let i = 0; i < shuffled.length; i += 2) {
			initialMatches.push({
				id: `match-1-${i / 2}`,
				team1: shuffled[i],
				team2: shuffled[i + 1],
				round: 1,
			})
		}

		const totalRounds = Math.log2(shuffled.length)
		let matchesPerRound = shuffled.length / 2

		for (let round = 2; round <= totalRounds; round++) {
			matchesPerRound = matchesPerRound / 2
			for (let i = 0; i < matchesPerRound; i++) {
				initialMatches.push({
					id: `match-${round}-${i}`,
					round,
				})
			}
		}

		setMatches(initialMatches)
		setIsShuffled(true)
	}

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

	const renderMatchCard = (match: Match) => {
		const possibleTeams1 = !match.team1 ? getPossibleTeams(match, 'team1') : []
		const possibleTeams2 = !match.team2 ? getPossibleTeams(match, 'team2') : []

		return (
			<div className="bg-white border-2 border-gray-200 rounded-lg p-3 space-y-2 hover:shadow-lg transition-all w-[220px]">
				<div
					className={`flex items-center gap-2 p-2 rounded transition-all ${
						match.team1 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-dashed border-gray-300'
					}`}
				>
					{match.team1 ? (
						<>
							<div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-gray-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
								{match.team1.nome.charAt(0)}
							</div>
							<span className="font-semibold text-xs flex-1 truncate">{match.team1.nome}</span>
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
						match.team2 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-dashed border-gray-300'
					}`}
				>
					{match.team2 ? (
						<>
							<div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-gray-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
								{match.team2.nome.charAt(0)}
							</div>
							<span className="font-semibold text-xs flex-1 truncate">{match.team2.nome}</span>
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
			</div>
		)
	}

	const handleSectionChange = (_section: string) => {
		navigate('/dashboard')
	}

	const handleStartTournament = async () => {
		setIsStarting(true)

		await new Promise((resolve) => setTimeout(resolve, 1500))

		toast.success('Torneio iniciado com sucesso!')

		setTimeout(() => {
			navigate('/dashboard')
		}, 500)
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
								<h1 className="text-2xl font-bold">Iniciar Torneio</h1>
								<p className="text-sm text-muted-foreground">Sorteie os times e configure as chaves</p>
							</div>
						</div>
					</header>
					<div className="flex-1 overflow-y-auto p-6">
						<div className="max-w-7xl mx-auto space-y-6">
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
										<div className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
											Aguardando Início
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

							{!isShuffled && (
								<Card>
									<CardHeader>
										<div className="flex items-center justify-between">
											<div>
												<CardTitle className="text-lg">Times Participantes</CardTitle>
												<p className="text-sm text-muted-foreground">Times que participarão do torneio</p>
											</div>
											<Button onClick={shuffleTeams} size="lg">
												<Shuffle className="h-5 w-5 mr-2" />
												Sortear Chaves
											</Button>
										</div>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
											{teams.map((team) => (
												<div
													key={team.id}
													className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:shadow-md transition-all"
												>
													<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-gray-800 flex items-center justify-center text-white font-bold">
														{team.nome.charAt(0)}
													</div>
													<div className="flex-1">
														<p className="font-semibold text-sm">{team.nome}</p>
														<p className="text-xs text-muted-foreground flex items-center gap-1">
															<Users className="h-3 w-3" />
															{Math.floor(Math.random() * 10) + 8} jogadores
														</p>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							)}

							{isShuffled && (
								<Card>
									<CardHeader>
										<div>
											<CardTitle className="text-lg">Chaves do Torneio</CardTitle>
											<p className="text-sm text-muted-foreground">Torneio mata-mata com {teams.length} times</p>
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

										<div className="flex justify-end gap-4 pt-6 border-t mt-6">
											<Button variant="outline" onClick={() => navigate('/dashboard')} disabled={isStarting}>
												Cancelar
											</Button>
											<Button size="lg" onClick={handleStartTournament} disabled={isStarting}>
												{isStarting ? (
													<>
														<Loader2 className="h-5 w-5 mr-2 animate-spin" />
														Iniciando...
													</>
												) : (
													<>
														<Trophy className="h-5 w-5 mr-2" />
														Confirmar e Iniciar
													</>
												)}
											</Button>
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				</div>
			</main>
		</>
	)
}

export function StartTournament() {
	return (
		<SidebarProvider>
			<StartTournamentContent />
		</SidebarProvider>
	)
}
