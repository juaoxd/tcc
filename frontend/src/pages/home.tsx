import { RegisterTeamDialog } from '@/components/register-team-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { useState } from 'react'

// Mock data para torneios
const mockTournaments = [
	{
		id: 1,
		name: 'Campeonato de Futebol 2024',
		sport: 'Futebol',
		startDate: '2024-03-15',
		endDate: '2024-04-20',
	},
	{
		id: 2,
		name: 'Liga de Basquete Universitária',
		sport: 'Basquete',
		startDate: '2024-04-01',
		endDate: '2024-05-30',
	},
	{
		id: 3,
		name: 'Torneio de Vôlei de Praia',
		sport: 'Vôlei',
		startDate: '2024-05-10',
		endDate: '2024-06-15',
	},
]

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

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pt-BR')
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
						<Button>Criar Torneio</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{mockTournaments.map((tournament) => (
							<Card key={tournament.id}>
								<CardHeader>
									<CardTitle>{tournament.name}</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<p className="text-sm text-muted-foreground">Esporte</p>
										<p className="font-medium">{tournament.sport}</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Período</p>
										<p className="font-medium">
											{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
										</p>
									</div>
									<Button variant="outline" className="w-full">
										Ver detalhes
									</Button>
								</CardContent>
							</Card>
						))}
					</div>

					{mockTournaments.length === 0 && (
						<div className="text-center py-12">
							<p className="text-muted-foreground">Você ainda não criou nenhum torneio.</p>
							<Button className="mt-4">Criar seu primeiro torneio</Button>
						</div>
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
