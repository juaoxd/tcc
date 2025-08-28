import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Register } from './pages/register'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function App() {
	const queryClient = new QueryClient()
	return (
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<Routes>
					<Route path="/register" element={<Register />} />
				</Routes>
			</QueryClientProvider>
		</BrowserRouter>
	)
}
