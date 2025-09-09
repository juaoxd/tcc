import { useAuth } from '@/hooks/use-auth'
import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
	children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { data, isLoading, error } = useAuth()

	console.log('ProtectedRoute - Estado:', { data, isLoading, error })

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg">Verificando autenticação...</div>
			</div>
		)
	}

	if (error || !data) {
		return <Navigate to="/login" replace />
	}

	return <>{children}</>
}
