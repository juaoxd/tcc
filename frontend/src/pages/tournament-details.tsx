import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Users, ArrowLeft, Calendar, MapPin, Clock, Target, AlertCircle, Home } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

const MOCK_MATCHES: Match[] = [
	// Oitavas de Final - Rodada 1
	{
		id: 'match-1-0',
		team1: MOCK_TEAMS[0],
		team2: MOCK_TEAMS[1],
		round: 1,
		status: 'finished',
		score1: 3,
		score2: 1,
		winner: MOCK_TEAMS[0],
		date: '2024-11-15T14:00',
		location: 'Arena Sport Center - Campo 1',
		events: [
			{ id: 'e1', type: 'goal', team: 'team1', player: 'João Silva', minute: 15 },
			{ id: 'e2', type: 'yellow_card', team: 'team2', player: 'Pedro Costa', minute: 23 },
			{ id: 'e3', type: 'goal', team: 'team1', player: 'Carlos Santos', minute: 35 },
			{ id: 'e4', type: 'goal', team: 'team2', player: 'Lucas Oliveira', minute: 42 },
			{ id: 'e5', type: 'goal', team: 'team1', player: 'João Silva', minute: 48 },
		],
	},
	{
		id: 'match-1-1',
		team1: MOCK_TEAMS[2],
		team2: MOCK_TEAMS[3],
		round: 1,
		status: 'finished',
		score1: 2,
		score2: 2,
		winner: MOCK_TEAMS[2], // Venceu nos pênaltis
		date: '2024-11-15T16:00',
		location: 'Arena Sport Center - Campo 1',
		events: [
			{ id: 'e6', type: 'goal', team: 'team1', player: 'Rafael Lima', minute: 12 },
			{ id: 'e7', type: 'goal', team: 'team2', player: 'Marcos Souza', minute: 28 },
			{ id: 'e8', type: 'yellow_card', team: 'team1', player: 'Bruno Alves', minute: 33 },
			{ id: 'e9', type: 'goal', team: 'team1', player: 'Rafael Lima', minute: 39 },
			{ id: 'e10', type: 'goal', team: 'team2', player: 'Marcos Souza', minute: 45 },
			{ id: 'e11', type: 'red_card', team: 'team2', player: 'Daniel Rocha', minute: 50 },
		],
	},
	{
		id: 'match-1-2',
		team1: MOCK_TEAMS[4],
		team2: MOCK_TEAMS[5],
		round: 1,
		status: 'finished',
		score1: 1,
		score2: 3,
		winner: MOCK_TEAMS[5],
		date: '2024-11-15T18:00',
		location: 'Arena Sport Center - Campo 2',
		events: [
			{ id: 'e12', type: 'goal', team: 'team2', player: 'André Costa', minute: 8 },
			{ id: 'e13', type: 'goal', team: 'team1', player: 'Felipe Martins', minute: 22 },
			{ id: 'e14', type: 'goal', team: 'team2', player: 'André Costa', minute: 38 },
			{ id: 'e15', type: 'yellow_card', team: 'team1', player: 'Gustavo Silva', minute: 42 },
			{ id: 'e16', type: 'goal', team: 'team2', player: 'Ricardo Pereira', minute: 47 },
		],
	},
	{
		id: 'match-1-3',
		team1: MOCK_TEAMS[6],
		team2: MOCK_TEAMS[7],
		round: 1,
		status: 'in_progress',
		score1: 1,
		score2: 0,
		date: '2024-11-15T20:00',
		location: 'Arena Sport Center - Campo 2',
		events: [
			{ id: 'e17', type: 'goal', team: 'team1', player: 'Thiago Melo', minute: 18 },
			{ id: 'e18', type: 'yellow_card', team: 'team2', player: 'Rodrigo Gomes', minute: 25 },
		],
	},
	// Quartas de Final - Rodada 2
	{
		id: 'match-2-0',
		team1: MOCK_TEAMS[0], // Vencedor da match-1-0
		team2: MOCK_TEAMS[2], // Vencedor da match-1-1
		round: 2,
		status: 'pending',
		date: '2024-11-16T14:00',
		location: 'Arena Sport Center - Campo 1',
	},
	{
		id: 'match-2-1',
		team1: MOCK_TEAMS[5], // Vencedor da match-1-2
		round: 2,
		status: 'pending',
		date: '2024-11-16T16:00',
		location: 'Arena Sport Center - Campo 1',
	},
	// Semifinal - Rodada 3
	{
		id: 'match-3-0',
		round: 3,
		status: 'pending',
		date: '2024-11-17T14:00',
		location: 'Arena Sport Center - Campo Principal',
	},
	// Final - Rodada 4
	{
		id: 'match-4-0',
		round: 4,
		status: 'pending',
		date: '2024-11-17T17:00',
		location: 'Arena Sport Center - Campo Principal',
	},
]

export function TournamentDetails() {
	const navigate = useNavigate()
	const { tournamentId } = useParams<{ tournamentId: string }>()
	const [matches] = useState<Match[]>(MOCK_MATCHES)

	console.log('Visualizando torneio:', tournamentId)

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

	const getStatusBadge = (status?: string) => {
		switch (status) {
			case 'finished':
				return (
					<div className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow-sm">Finalizada</div>
				)
			case 'in_progress':
				return (
					<div className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold shadow-sm animate-pulse">
						Em Andamento
					</div>
				)
			default:
				return (
					<div className="px-3 py-1 rounded-full bg-gray-300 text-gray-700 text-xs font-bold shadow-sm">Agendada</div>
				)
		}
	}

	const getEventIcon = (type: MatchEvent['type']) => {
		switch (type) {
			case 'yellow_card':
				return <div className="w-3 h-4 bg-yellow-400 rounded-sm border border-yellow-600" />
			case 'red_card':
				return <div className="w-3 h-4 bg-red-500 rounded-sm border border-red-700" />
			case 'goal':
				return <Target className="h-4 w-4 text-green-600" />
			case 'substitution':
				return <AlertCircle className="h-4 w-4 text-blue-600" />
			case 'injury':
				return <AlertCircle className="h-4 w-4 text-orange-600" />
		}
	}

	const renderMatchCard = (match: Match) => {
		const possibleTeams1 = !match.team1 ? getPossibleTeams(match, 'team1') : []
		const possibleTeams2 = !match.team2 ? getPossibleTeams(match, 'team2') : []

		return (
			<div className="relative bg-white border-2 border-gray-200 rounded-lg p-4 space-y-3 transition-all w-[240px]">
				<div className="absolute -top-3 left-1/2 -translate-x-1/2">{getStatusBadge(match.status)}</div>

				<div
					className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
						match.winner?.id === match.team1?.id
							? 'bg-green-50 border-2 border-green-400 shadow-md'
							: match.team1
								? 'bg-blue-50 border border-blue-200'
								: 'bg-gray-50 border border-dashed border-gray-300'
					}`}
				>
					{match.team1 ? (
						<>
							<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-gray-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
								{match.team1.nome.charAt(0)}
							</div>
							<span className="font-semibold text-sm flex-1 truncate">{match.team1.nome}</span>
							{match.score1 !== undefined && (
								<span className="font-bold text-xl text-blue-700 min-w-[24px] text-center">{match.score1}</span>
							)}
							{match.winner?.id === match.team1?.id && <Trophy className="h-5 w-5 text-green-600" />}
						</>
					) : possibleTeams1.length > 0 ? (
						<div className="flex-1 py-1">
							<div className="flex flex-col gap-1">
								{possibleTeams1.map((team) => (
									<div key={team.id} className="flex items-center gap-2 opacity-50">
										<div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-gray-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
											{team.nome.charAt(0)}
										</div>
										<span className="text-xs text-gray-500 truncate">{team.nome}</span>
									</div>
								))}
							</div>
						</div>
					) : (
						<span className="text-sm text-gray-400 italic flex-1 text-center py-1">Aguardando...</span>
					)}
				</div>

				<div className="text-center text-xs text-gray-500 font-semibold">VS</div>

				<div
					className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
						match.winner?.id === match.team2?.id
							? 'bg-green-50 border-2 border-green-400 shadow-md'
							: match.team2
								? 'bg-blue-50 border border-blue-200'
								: 'bg-gray-50 border border-dashed border-gray-300'
					}`}
				>
					{match.team2 ? (
						<>
							<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-gray-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
								{match.team2.nome.charAt(0)}
							</div>
							<span className="font-semibold text-sm flex-1 truncate">{match.team2.nome}</span>
							{match.score2 !== undefined && (
								<span className="font-bold text-xl text-blue-700 min-w-[24px] text-center">{match.score2}</span>
							)}
							{match.winner?.id === match.team2?.id && <Trophy className="h-5 w-5 text-green-600" />}
						</>
					) : possibleTeams2.length > 0 ? (
						<div className="flex-1 py-1">
							<div className="flex flex-col gap-1">
								{possibleTeams2.map((team) => (
									<div key={team.id} className="flex items-center gap-2 opacity-50">
										<div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-gray-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
											{team.nome.charAt(0)}
										</div>
										<span className="text-xs text-gray-500 truncate">{team.nome}</span>
									</div>
								))}
							</div>
						</div>
					) : (
						<span className="text-sm text-gray-400 italic flex-1 text-center py-1">Aguardando...</span>
					)}
				</div>

				{match.date && (
					<div className="pt-2 border-t border-gray-200 space-y-1">
						<div className="flex items-center gap-2 text-xs text-gray-600">
							<Calendar className="h-3 w-3" />
							<span>
								{new Date(match.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
							</span>
							<span>•</span>
							<Clock className="h-3 w-3" />
							<span>{new Date(match.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
						</div>
						{match.location && (
							<div className="flex items-center gap-2 text-xs text-gray-600">
								<MapPin className="h-3 w-3" />
								<span className="truncate">{match.location}</span>
							</div>
						)}
					</div>
				)}

				{/* Eventos da partida em formato compacto */}
				{match.events && match.events.length > 0 && (
					<div className="pt-2 border-t border-gray-200">
						<div className="text-xs font-semibold text-gray-600 mb-2">Eventos:</div>
						<div className="space-y-1 max-h-32 overflow-y-auto">
							{match.events
								.sort((a, b) => a.minute - b.minute)
								.map((event) => (
									<div key={event.id} className="flex items-center gap-2 text-xs">
										<span className="text-gray-500 font-mono min-w-[24px]">{event.minute}'</span>
										{getEventIcon(event.type)}
										<span className="truncate text-gray-700">{event.player}</span>
										<span className="text-gray-400">
											({event.team === 'team1' ? match.team1?.nome : match.team2?.nome})
										</span>
									</div>
								))}
						</div>
					</div>
				)}
			</div>
		)
	}

	const finishedMatches = matches.filter((m) => m.status === 'finished')
	const upcomingMatches = matches.filter((m) => m.status === 'pending' || m.status === 'in_progress')

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
			{/* Header Público */}
			<header className="bg-white border-b shadow-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button variant="ghost" size="icon" onClick={() => navigate('/')}>
								<ArrowLeft className="h-5 w-5" />
							</Button>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-gray-800 flex items-center justify-center text-white shadow-md">
									<Trophy className="h-6 w-6" />
								</div>
								<div>
									<h1 className="text-xl font-bold text-gray-900">Campeonato de Futebol 2024</h1>
									<p className="text-sm text-gray-500">Torneio Público</p>
								</div>
							</div>
						</div>
						<Button variant="outline" onClick={() => navigate('/')}>
							<Home className="h-4 w-4 mr-2" />
							Início
						</Button>
					</div>
				</div>
			</header>

			{/* Conteúdo Principal */}
			<main className="flex-1">
				<div className="max-w-7xl mx-auto px-6 py-8">
					<div className="space-y-6">
						{/* Informações do Torneio */}
						<Card className="shadow-lg border-2">
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

						{/* Tabs para diferentes visualizações */}
						<Tabs defaultValue="bracket" className="w-full">
							<TabsList className="grid w-full max-w-md grid-cols-3">
								<TabsTrigger value="bracket">Chaveamento</TabsTrigger>
								<TabsTrigger value="finished">Finalizadas</TabsTrigger>
								<TabsTrigger value="upcoming">Próximas</TabsTrigger>
							</TabsList>

							{/* Chaveamento */}
							<TabsContent value="bracket">
								<Card className="shadow-lg border-2">
									<CardHeader>
										<CardTitle className="text-lg">Chaves do Torneio</CardTitle>
										<p className="text-sm text-muted-foreground">Visualize todas as rodadas e confrontos</p>
									</CardHeader>
									<CardContent>
										<div className="overflow-x-auto pb-8">
											<div className="flex gap-24 justify-center px-8 py-4 min-w-max">
												{totalRounds >= 3 && (
													<div className="flex flex-col">
														<h3 className="text-sm font-bold text-center text-gray-600 mb-6 h-8">
															{getRoundName(1, totalRounds)}
														</h3>
														<div className="flex flex-col justify-around" style={{ height: '800px' }}>
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
														<div className="flex flex-col justify-around" style={{ height: '800px' }}>
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
													<div className="flex flex-col justify-around" style={{ height: '800px' }}>
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
							</TabsContent>

							{/* Partidas Finalizadas */}
							<TabsContent value="finished">
								<Card className="shadow-lg border-2">
									<CardHeader>
										<CardTitle className="text-lg">Partidas Finalizadas</CardTitle>
										<p className="text-sm text-muted-foreground">
											{finishedMatches.length} partida{finishedMatches.length !== 1 ? 's' : ''} finalizada
											{finishedMatches.length !== 1 ? 's' : ''}
										</p>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
											{finishedMatches.map((match) => (
												<div key={match.id}>
													<div className="text-xs font-semibold text-gray-500 mb-2 text-center">
														{getRoundName(match.round, totalRounds)}
													</div>
													{renderMatchCard(match)}
												</div>
											))}
										</div>
										{finishedMatches.length === 0 && (
											<div className="text-center py-12 text-gray-500">
												<Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
												<p>Nenhuma partida finalizada ainda</p>
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* Próximas Partidas */}
							<TabsContent value="upcoming">
								<Card className="shadow-lg border-2">
									<CardHeader>
										<CardTitle className="text-lg">Próximas Partidas</CardTitle>
										<p className="text-sm text-muted-foreground">
											{upcomingMatches.length} partida{upcomingMatches.length !== 1 ? 's' : ''} agendada
											{upcomingMatches.length !== 1 ? 's' : ''} ou em andamento
										</p>
									</CardHeader>
									<CardContent>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
											{upcomingMatches.map((match) => (
												<div key={match.id}>
													<div className="text-xs font-semibold text-gray-500 mb-2 text-center">
														{getRoundName(match.round, totalRounds)}
													</div>
													{renderMatchCard(match)}
												</div>
											))}
										</div>
										{upcomingMatches.length === 0 && (
											<div className="text-center py-12 text-gray-500">
												<Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
												<p>Nenhuma partida agendada</p>
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-white border-t mt-12">
				<div className="max-w-7xl mx-auto px-6 py-6">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<Trophy className="h-4 w-4" />
							<span>Campeonato de Futebol 2024</span>
						</div>
						<div className="flex items-center gap-6 text-sm text-gray-500">
							<button type="button" className="hover:text-gray-900 transition-colors">
								Sobre
							</button>
							<button type="button" className="hover:text-gray-900 transition-colors">
								Regulamento
							</button>
							<button type="button" className="hover:text-gray-900 transition-colors">
								Contato
							</button>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
