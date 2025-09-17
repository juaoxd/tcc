import { RegisterTeamDialog } from '@/components/register-team-dialog'
import { RegisterTournamentDialog } from '@/components/register-tournament-dialog'
import { InviteTeamDialog } from '@/components/invite-team-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useListUserTournaments } from '@/http/use-list-user-tournaments'
import { useListUserTeams } from '@/http/use-list-user-teams'
import { useState } from 'react'

export function Home() {
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
							<Card>
								<CardHeader>
									<Skeleton className="h-6 w-3/4" />
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<Skeleton className="h-4 w-16 mb-2" />
										<Skeleton className="h-5 w-20" />
									</div>
									<div>
										<Skeleton className="h-4 w-16 mb-2" />
										<Skeleton className="h-5 w-32" />
									</div>
									<Skeleton className="h-9 w-full" />
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<Skeleton className="h-6 w-3/4" />
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<Skeleton className="h-4 w-16 mb-2" />
										<Skeleton className="h-5 w-20" />
									</div>
									<div>
										<Skeleton className="h-4 w-16 mb-2" />
										<Skeleton className="h-5 w-32" />
									</div>
									<Skeleton className="h-9 w-full" />
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<Skeleton className="h-6 w-3/4" />
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<Skeleton className="h-4 w-16 mb-2" />
										<Skeleton className="h-5 w-20" />
									</div>
									<div>
										<Skeleton className="h-4 w-16 mb-2" />
										<Skeleton className="h-5 w-32" />
									</div>
									<Skeleton className="h-9 w-full" />
								</CardContent>
							</Card>
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
								{Array.isArray(tournaments) &&
									tournaments.map((tournament) => (
										<Card key={tournament.id}>
											<CardHeader>
												<CardTitle className="text-lg">{tournament.nome}</CardTitle>
											</CardHeader>
											<CardContent className="space-y-4">
												<div className="grid grid-cols-2 gap-4">
													<div>
														<p className="text-sm text-muted-foreground">Esporte</p>
														<p className="font-medium">{getSportLabel(tournament.esporte)}</p>
													</div>
													<div>
														<p className="text-sm text-muted-foreground">Equipes</p>
														<p className="font-medium">{tournament.numeroEquipes || 4} equipes</p>
													</div>
												</div>
												{tournament.descricao && (
													<div>
														<p className="text-sm text-muted-foreground">Descrição</p>
														<p className="font-medium text-sm line-clamp-2">{tournament.descricao}</p>
													</div>
												)}
												{(tournament.inicio || tournament.fim) && (
													<div>
														<p className="text-sm text-muted-foreground">Período</p>
														<p className="font-medium text-sm">
															{tournament.inicio ? formatDate(tournament.inicio) : 'Não definido'} -{' '}
															{tournament.fim ? formatDate(tournament.fim) : 'Não definido'}
														</p>
													</div>
												)}
												<div className="pt-2">
													<Button variant="outline" className="w-full">
														Ver detalhes
													</Button>
												</div>
											</CardContent>
										</Card>
									))}
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
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-3/4" />
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Skeleton className="h-4 w-16 mb-2" />
									<Skeleton className="h-5 w-20" />
								</div>
								<div>
									<Skeleton className="h-4 w-16 mb-2" />
									<Skeleton className="h-5 w-32" />
								</div>
								<Skeleton className="h-9 w-full" />
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-3/4" />
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Skeleton className="h-4 w-16 mb-2" />
									<Skeleton className="h-5 w-20" />
								</div>
								<div>
									<Skeleton className="h-4 w-16 mb-2" />
									<Skeleton className="h-5 w-32" />
								</div>
								<Skeleton className="h-9 w-full" />
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-3/4" />
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Skeleton className="h-4 w-16 mb-2" />
									<Skeleton className="h-5 w-20" />
								</div>
								<div>
									<Skeleton className="h-4 w-16 mb-2" />
									<Skeleton className="h-5 w-32" />
								</div>
								<Skeleton className="h-9 w-full" />
							</CardContent>
						</Card>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
							{Array.isArray(teams?.equipes) &&
								teams.equipes.map((team) => (
									<Card key={team.id}>
										<CardHeader>
											<CardTitle className="text-lg">{team.nome}</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm text-muted-foreground">Função</p>
													<p className="font-medium">{team.funcao}</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">Criada em</p>
													<p className="font-medium">{formatDate(team.createdAt)}</p>
												</div>
											</div>
											<div className="pt-2 flex gap-2">
												<Button variant="outline" className="flex-1">
													Ver detalhes
												</Button>
												<Button
													variant="default"
													className="flex-1"
													onClick={() => openInviteDialog(team.id, team.nome)}
												>
													Convidar
												</Button>
											</div>
										</CardContent>
									</Card>
								))}
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
		<SidebarProvider>
			<AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
			<main className="flex-1 overflow-hidden">
				<div className="flex h-full flex-col">
					<header className="border-b bg-background px-6 py-3">
						<div className="flex items-center gap-4">
							<SidebarTrigger />
							<h1 className="text-2xl font-bold">Dashboard</h1>
						</div>
					</header>
					<div className="flex-1 overflow-y-auto p-6">
						<div className="max-w-7xl mx-auto">{renderContent()}</div>
					</div>
				</div>
			</main>

			{/* Diálogo de Convite para Equipe */}
			<Dialog open={inviteTeamDialog.isOpen} onOpenChange={closeInviteDialog}>
				<InviteTeamDialog
					teamId={inviteTeamDialog.teamId}
					teamName={inviteTeamDialog.teamName}
					onClose={closeInviteDialog}
				/>
			</Dialog>
		</SidebarProvider>
	)
}
