import { RegisterTeamDialog } from '@/components/register-team-dialog'
import { RegisterTournamentDialog } from '@/components/register-tournament-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useListUserTournaments } from '@/http/use-list-user-tournaments'
import { useState } from 'react'

// Mock data para equipes
const mockTeams = [
	{
		id: 1,
		name: 'Águias Douradas',
		abbreviation: 'AGD',
	},
	{
		id: 2,
		name: 'Leões Vermelhos',
		abbreviation: 'LVR',
	},
	{
		id: 3,
		name: 'Tigres Azuis',
		abbreviation: 'TAZ',
	},
	{
		id: 4,
		name: 'Falcões Negros',
		abbreviation: 'FNE',
	},
]

export function Home() {
	const [activeSection, setActiveSection] = useState('organizer')
	const { data: tournaments, isLoading, error } = useListUserTournaments()

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

	const renderContent = () => {
		if (activeSection === 'organizer') {
			return (
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<div>
							<h2 className="text-2xl font-semibold">Meus Torneios</h2>
							<p className="text-muted-foreground">Gerencie e organize seus torneios</p>
						</div>
						<Dialog>
							<DialogTrigger asChild>
								<Button>Criar Torneio</Button>
							</DialogTrigger>
							<RegisterTournamentDialog />
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
												<CardTitle>{tournament.nome}</CardTitle>
											</CardHeader>
											<CardContent className="space-y-4">
												<div>
													<p className="text-sm text-muted-foreground">Esporte</p>
													<p className="font-medium">{getSportLabel(tournament.esporte)}</p>
												</div>
												{tournament.descricao && (
													<div>
														<p className="text-sm text-muted-foreground">Descrição</p>
														<p className="font-medium text-sm">{tournament.descricao}</p>
													</div>
												)}
												{(tournament.inicio || tournament.fim) && (
													<div>
														<p className="text-sm text-muted-foreground">Período</p>
														<p className="font-medium">
															{tournament.inicio ? formatDate(tournament.inicio) : '---'} -{' '}
															{tournament.fim ? formatDate(tournament.fim) : '---'}
														</p>
													</div>
												)}
												<Button variant="outline" className="w-full">
													Ver detalhes
												</Button>
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
					<Dialog>
						<DialogTrigger asChild>
							<Button>Criar Equipe</Button>
						</DialogTrigger>
						<RegisterTeamDialog />
					</Dialog>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{mockTeams.map((team) => (
						<Card key={team.id}>
							<CardHeader>
								<CardTitle>{team.name}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<p className="text-sm text-muted-foreground">Sigla</p>
									<p className="font-medium text-lg">{team.abbreviation}</p>
								</div>
								<Button variant="outline" className="w-full">
									Ver detalhes
								</Button>
							</CardContent>
						</Card>
					))}
				</div>

				{mockTeams.length === 0 && (
					<div className="text-center py-12">
						<p className="text-muted-foreground">Você ainda não faz parte de nenhuma equipe.</p>
						<Dialog>
							<DialogTrigger asChild>
								<Button className="mt-4">Criar sua primeira equipe</Button>
							</DialogTrigger>
							<RegisterTeamDialog />
						</Dialog>
					</div>
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
		</SidebarProvider>
	)
}
