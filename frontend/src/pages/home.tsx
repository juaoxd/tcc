import { RegisterTeamDialog } from '@/components/register-team-dialog'
import { RegisterTournamentDialog } from '@/components/register-tournament-dialog'
import { InviteTeamDialog } from '@/components/invite-team-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useListUserTournaments } from '@/http/use-list-user-tournaments'
import { useListUserTeams } from '@/http/use-list-user-teams'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Calendar, Trophy, Settings, UserPlus, Eye, Crown, Shield, Play, Edit3 } from 'lucide-react'

function HomeContent() {
	const navigate = useNavigate()
	const [activeSection, setActiveSection] = useState('organizer')
	const [isRegisterTournamentDialogOpen, setIsRegisterTournamentDialogOpen] = useState(false)
	const [isRegisterTeamDialogOpen, setIsRegisterTeamDialogOpen] = useState(false)
	const [inviteTeamDialog, setInviteTeamDialog] = useState<{ isOpen: boolean; teamId: string; teamName: string }>({
		isOpen: false,
		teamId: '',
		teamName: '',
	})
	const { data: tournaments, isLoading, error } = useListUserTournaments()
	const { data: teams, isLoading: isLoadingTeams, error: teamsError } = useListUserTeams()
	const { open } = useSidebar()

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pt-BR')
	}

	const getSportLabel = (sport: string) => {
		switch (sport) {
			case 'FUTEBOL':
				return 'Futebol'
			case 'BASQUETE':
				return 'Basquete'
			case 'VOLEI':
				return 'Vôlei'
			default:
				return sport
		}
	}

	const getRoleIcon = (role: string) => {
		switch (role?.toLowerCase()) {
			case 'captain':
			case 'capitão':
			case 'lider':
				return <Crown className="h-4 w-4 text-yellow-600" />
			case 'admin':
			case 'administrador':
				return <Shield className="h-4 w-4 text-blue-600" />
			default:
				return <Users className="h-4 w-4 text-gray-600" />
		}
	}

	const getRoleBadgeStyle = (role: string) => {
		switch (role?.toLowerCase()) {
			case 'captain':
			case 'capitão':
			case 'lider':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200'
			case 'admin':
			case 'administrador':
				return 'bg-blue-100 text-blue-800 border-blue-200'
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200'
		}
	}

	const getRandomSport = () => {
		const sports = ['FUTEBOL', 'BASQUETE', 'VOLEI']
		return sports[Math.floor(Math.random() * sports.length)]
	}

	const getRandomMembersCount = () => {
		return Math.floor(Math.random() * 15) + 5 // 5 a 19 membros
	}

	const getRandomParticipantsCount = () => {
		return Math.floor(Math.random() * 20) + 8 // 8 a 27 participantes
	}

	const getTournamentStatus = () => {
		const statuses = ['Inscrições abertas', 'Em andamento', 'Finalizado']
		return statuses[Math.floor(Math.random() * statuses.length)]
	}

	const getTournamentStatusStyle = (status: string) => {
		switch (status) {
			case 'Inscrições abertas':
				return 'bg-green-100 text-green-800 border-green-200'
			case 'Em andamento':
				return 'bg-blue-100 text-blue-800 border-blue-200'
			case 'Finalizado':
				return 'bg-gray-100 text-gray-800 border-gray-200'
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200'
		}
	}

	const openInviteDialog = (teamId: string, teamName: string) => {
		setInviteTeamDialog({
			isOpen: true,
			teamId,
			teamName,
		})
	}

	const closeInviteDialog = () => {
		setInviteTeamDialog({
			isOpen: false,
			teamId: '',
			teamName: '',
		})
	}

	const renderContent = () => {
		if (activeSection === 'organizer') {
			return (
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<div>
							<h2 className="text-2xl font-semibold">Meus Torneios</h2>
							<p className="text-muted-foreground">Gerencie e organize seus torneios</p>
						</div>
						<Dialog open={isRegisterTournamentDialogOpen} onOpenChange={setIsRegisterTournamentDialogOpen}>
							<DialogTrigger asChild>
								<Button>Criar Torneio</Button>
							</DialogTrigger>
							<RegisterTournamentDialog onSuccess={() => setIsRegisterTournamentDialogOpen(false)} />
						</Dialog>
					</div>

					{error && (
						<div className="text-center py-12">
							<p className="text-red-500">Erro ao carregar torneios: {error.message}</p>
						</div>
					)}

					{isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
							{Array.from({ length: 6 }, (_, index) => (
								<Card key={`skeleton-tournament-${Math.random()}-${index}`} className="">
									<CardHeader className="pb-3">
										<div className="flex items-center gap-3">
											<Skeleton className="w-12 h-12 rounded-full" />
											<div className="space-y-2">
												<Skeleton className="h-5 w-32" />
												<Skeleton className="h-4 w-24 rounded-full" />
											</div>
										</div>
									</CardHeader>

									<CardContent className="space-y-4">
										<div className="flex items-center gap-2">
											<Skeleton className="h-4 w-4" />
											<Skeleton className="h-4 w-24" />
										</div>

										<div className="space-y-3">
											<div className="flex items-center justify-between py-2 border-b border-gray-100">
												<div className="flex items-center gap-2">
													<Skeleton className="h-4 w-4" />
													<Skeleton className="h-4 w-16" />
												</div>
												<Skeleton className="h-4 w-20" />
											</div>
											<div className="flex items-center justify-between py-2 border-b border-gray-100">
												<div className="flex items-center gap-2">
													<Skeleton className="h-4 w-4" />
													<Skeleton className="h-4 w-16" />
												</div>
												<Skeleton className="h-4 w-20" />
											</div>
											<div className="flex items-center justify-between py-2">
												<div className="flex items-center gap-2">
													<Skeleton className="h-4 w-4" />
													<Skeleton className="h-4 w-16" />
												</div>
												<Skeleton className="h-4 w-20" />
											</div>
										</div>

										<div className="bg-gray-50 p-3 rounded-lg">
											<Skeleton className="h-4 w-full mb-1" />
											<Skeleton className="h-4 w-3/4" />
										</div>

										<div className="pt-3 flex flex-col gap-2">
											<div className="flex gap-2">
												<Skeleton className="h-8 flex-1" />
												<Skeleton className="h-8 flex-1" />
											</div>
											<Skeleton className="h-8 w-full" />
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
								{Array.isArray(tournaments) &&
									tournaments.map((tournament) => {
										const participantsCount = getRandomParticipantsCount()
										const status = getTournamentStatus()

										return (
											<Card key={tournament.id} className="hover:shadow-lg transition-all duration-300">
												<CardHeader className="pb-3">
													<div className="flex items-center gap-3">
														<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-gray-800 flex items-center justify-center text-white font-bold text-lg shadow-md">
															<Trophy className="h-6 w-6" />
														</div>
														<div>
															<CardTitle className="text-lg font-bold text-gray-900 leading-tight">
																{tournament.nome}
															</CardTitle>
															<div className="flex items-center gap-2 mt-1">
																<span
																	className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getTournamentStatusStyle(status)}`}
																>
																	{status}
																</span>
															</div>
														</div>
													</div>
												</CardHeader>

												<CardContent className="space-y-4">
													<div className="flex items-center gap-2 text-sm text-gray-500">
														<Users className="h-4 w-4" />
														<span>{participantsCount} participantes</span>
													</div>

													<div className="space-y-3">
														<div className="flex items-center justify-between py-2 border-b border-gray-100">
															<div className="flex items-center gap-2 text-sm text-gray-600">
																<Trophy className="h-4 w-4" />
																<span>Esporte</span>
															</div>
															<span className="font-medium text-gray-900">{getSportLabel(tournament.esporte)}</span>
														</div>

														<div className="flex items-center justify-between py-2 border-b border-gray-100">
															<div className="flex items-center gap-2 text-sm text-gray-600">
																<Users className="h-4 w-4" />
																<span>Equipes</span>
															</div>
															<span className="font-medium text-gray-900">{tournament.numeroEquipes || 4} equipes</span>
														</div>

														<div className="flex items-center justify-between py-2">
															<div className="flex items-center gap-2 text-sm text-gray-600">
																<Calendar className="h-4 w-4" />
																<span>Criado em</span>
															</div>
															<span className="font-medium text-gray-900">{formatDate(tournament.createdAt)}</span>
														</div>
													</div>

													{tournament.descricao && (
														<div className="bg-gray-50 p-3 rounded-lg">
															<p className="text-sm text-gray-600 line-clamp-2">{tournament.descricao}</p>
														</div>
													)}

													<div className="pt-3 flex flex-col gap-2">
														<div className="flex gap-2">
															<Button
																variant="outline"
																size="sm"
																className="flex-1 group hover:bg-blue-50 hover:border-blue-300"
																onClick={() => navigate(`/torneio/${tournament.id}`)}
															>
																<Eye className="h-4 w-4 mr-2 group-hover:text-blue-600" />
																Detalhes
															</Button>
															<Button
																variant="outline"
																size="sm"
																className="flex-1 group hover:bg-gray-50 hover:border-gray-300"
																onClick={() => navigate(`/torneio/${tournament.id}/gerenciar`)}
															>
																<Edit3 className="h-4 w-4 mr-2 group-hover:text-gray-800" />
																Gerenciar
															</Button>
														</div>
														<Button
															size="sm"
															className="w-full"
															onClick={() => navigate(`/torneio/${tournament.id}/iniciar`)}
														>
															<Play className="h-4 w-4 mr-2" />
															Iniciar
														</Button>
													</div>
												</CardContent>
											</Card>
										)
									})}
							</div>

							{(!Array.isArray(tournaments) || tournaments.length === 0) && !isLoading && !error && (
								<div className="text-center py-12">
									<p className="text-muted-foreground">Você ainda não criou nenhum torneio.</p>
								</div>
							)}
						</>
					)}
				</div>
			)
		}

		return (
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<div>
						<h2 className="text-2xl font-semibold">Minhas Equipes</h2>
						<p className="text-muted-foreground">Equipes que você participa</p>
					</div>
					<Dialog open={isRegisterTeamDialogOpen} onOpenChange={setIsRegisterTeamDialogOpen}>
						<DialogTrigger asChild>
							<Button>Criar Equipe</Button>
						</DialogTrigger>
						<RegisterTeamDialog onSuccess={() => setIsRegisterTeamDialogOpen(false)} />
					</Dialog>
				</div>

				{teamsError && (
					<div className="text-center py-12">
						<p className="text-red-500">Erro ao carregar equipes: {teamsError.message}</p>
					</div>
				)}

				{isLoadingTeams ? (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{Array.from({ length: 6 }, (_, index) => (
							<Card key={`skeleton-team-${Math.random()}-${index}`} className="">
								<CardHeader className="pb-3">
									<div className="flex items-center gap-3">
										<Skeleton className="w-12 h-12 rounded-full" />
										<div className="space-y-2">
											<Skeleton className="h-5 w-32" />
											<div className="flex items-center gap-2">
												<Skeleton className="h-4 w-4 rounded" />
												<Skeleton className="h-4 w-16 rounded-full" />
											</div>
										</div>
									</div>
								</CardHeader>

								<CardContent className="space-y-4">
									<div className="flex items-center gap-2">
										<Skeleton className="h-4 w-4" />
										<Skeleton className="h-4 w-20" />
									</div>

									<div className="space-y-3">
										<div className="flex items-center justify-between py-2 border-b border-gray-100">
											<div className="flex items-center gap-2">
												<Skeleton className="h-4 w-4" />
												<Skeleton className="h-4 w-16" />
											</div>
											<Skeleton className="h-4 w-20" />
										</div>
										<div className="flex items-center justify-between py-2 border-b border-gray-100">
											<div className="flex items-center gap-2">
												<Skeleton className="h-4 w-4" />
												<Skeleton className="h-4 w-16" />
											</div>
											<Skeleton className="h-4 w-20" />
										</div>
										<div className="flex items-center justify-between py-2">
											<div className="flex items-center gap-2">
												<Skeleton className="h-4 w-4" />
												<Skeleton className="h-4 w-16" />
											</div>
											<Skeleton className="h-4 w-20" />
										</div>
									</div>

									<div className="pt-3 flex flex-col gap-2">
										<div className="flex gap-2">
											<Skeleton className="h-8 flex-1" />
											<Skeleton className="h-8 flex-1" />
										</div>
										<Skeleton className="h-8 w-full" />
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
							{Array.isArray(teams?.equipes) &&
								teams.equipes.map((team) => {
									const sport = getRandomSport()
									const membersCount = getRandomMembersCount()

									return (
										<Card key={team.id} className="hover:shadow-lg transition-all duration-300">
											<CardHeader className="pb-3">
												<div className="flex items-center gap-3">
													<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-gray-800 flex items-center justify-center text-white font-bold text-lg shadow-md">
														{team.nome.charAt(0).toUpperCase()}
													</div>
													<div>
														<CardTitle className="text-lg font-bold text-gray-900 leading-tight">{team.nome}</CardTitle>
														<div className="flex items-center gap-2 mt-1">
															{getRoleIcon(team.funcao)}
															<span
																className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeStyle(team.funcao)}`}
															>
																{team.funcao}
															</span>
														</div>
													</div>
												</div>
											</CardHeader>

											<CardContent className="space-y-4">
												<div className="flex items-center gap-2 text-sm text-gray-500">
													<Users className="h-4 w-4" />
													<span>{membersCount} membros</span>
												</div>

												<div className="space-y-3">
													<div className="flex items-center justify-between py-2 border-b border-gray-100">
														<div className="flex items-center gap-2 text-sm text-gray-600">
															<Trophy className="h-4 w-4" />
															<span>Esporte</span>
														</div>
														<span className="font-medium text-gray-900">{getSportLabel(sport)}</span>
													</div>

													<div className="flex items-center justify-between py-2 border-b border-gray-100">
														<div className="flex items-center gap-2 text-sm text-gray-600">
															<Calendar className="h-4 w-4" />
															<span>Criada em</span>
														</div>
														<span className="font-medium text-gray-900">{formatDate(team.createdAt)}</span>
													</div>

													<div className="flex items-center justify-between py-2">
														<div className="flex items-center gap-2 text-sm text-gray-600">
															<Users className="h-4 w-4" />
															<span>Próximo jogo</span>
														</div>
														<span className="font-medium text-gray-900">15/10/2024</span>
													</div>
												</div>

												<div className="pt-3 flex flex-col gap-2">
													<div className="flex gap-2">
														<Button
															variant="outline"
															size="sm"
															className="flex-1 group hover:bg-blue-50 hover:border-blue-300"
														>
															<Eye className="h-4 w-4 mr-2 group-hover:text-blue-600" />
															Detalhes
														</Button>
														<Button
															variant="outline"
															size="sm"
															className="flex-1 group hover:bg-gray-50 hover:border-gray-300"
														>
															<Settings className="h-4 w-4 mr-2 group-hover:text-gray-800" />
															Gerenciar
														</Button>
													</div>
													<Button size="sm" className="w-full" onClick={() => openInviteDialog(team.id, team.nome)}>
														<UserPlus className="h-4 w-4 mr-2" />
														Convidar
													</Button>
												</div>
											</CardContent>
										</Card>
									)
								})}
						</div>

						{(!Array.isArray(teams?.equipes) || teams?.equipes.length === 0) && !isLoadingTeams && !teamsError && (
							<div className="text-center py-12">
								<p className="text-muted-foreground">Você ainda não faz parte de nenhuma equipe.</p>
							</div>
						)}
					</>
				)}
			</div>
		)
	}

	return (
		<>
			<AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
			<main className="flex-1 overflow-hidden">
				<div className="flex h-full flex-col">
					{!open && (
						<header className="border-b bg-background px-6 py-3">
							<div className="flex items-center gap-4">
								<SidebarTrigger />
								<h1 className="text-2xl font-bold"></h1>
							</div>
						</header>
					)}
					<div className="flex-1 overflow-y-auto p-6">
						<div className="max-w-7xl mx-auto">{renderContent()}</div>
					</div>
				</div>
			</main>

			<Dialog open={inviteTeamDialog.isOpen} onOpenChange={closeInviteDialog}>
				<InviteTeamDialog
					teamId={inviteTeamDialog.teamId}
					teamName={inviteTeamDialog.teamName}
					onClose={closeInviteDialog}
				/>
			</Dialog>
		</>
	)
}

export function Home() {
	return (
		<SidebarProvider>
			<HomeContent />
		</SidebarProvider>
	)
}
