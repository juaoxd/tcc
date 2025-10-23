import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Register } from './pages/register'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Home } from './pages/home'
import { Login } from './pages/login'
import { AcceptInvite } from './pages/accept-invite'
import { StartTournament } from './pages/start-tournament'
import { ManageTournament } from './pages/manage-tournament'
import { TournamentDetails } from './pages/tournament-details'
import { Toaster } from './components/ui/sonner'
import { ProtectedRoute } from './components/protected-route'

export function App() {
	const queryClient = new QueryClient()
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<Toaster />
				<Routes>
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route path="/torneio/:tournamentId" element={<TournamentDetails />} />
					<Route
						path="/torneio/:tournamentId/iniciar"
						element={
							<ProtectedRoute>
								<StartTournament />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/torneio/:tournamentId/gerenciar"
						element={
							<ProtectedRoute>
								<ManageTournament />
							</ProtectedRoute>
						}
					/>
					<Route path="/convite/aceitar" element={<AcceptInvite />} />
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</QueryClientProvider>
		</BrowserRouter>
	)
}
