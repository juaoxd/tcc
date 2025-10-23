import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Users, ArrowLeft, Loader2 } from 'lucide-react'
import { useAcceptInvite } from '@/http/use-accept-invite'
import { useAuth } from '@/hooks/use-auth'

type InviteStatus = 'loading' | 'ready' | 'accepting' | 'success' | 'already_in_team' | 'error'

export function AcceptInvite() {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const [status, setStatus] = useState<InviteStatus>('loading')
	const [errorMessage, setErrorMessage] = useState('')

	const token = searchParams.get('token')
	const acceptInviteMutation = useAcceptInvite()
	const { data: authData, isLoading: isAuthLoading, error: authError } = useAuth()

	useEffect(() => {
		if (isAuthLoading) return

		if (authError || !authData?.user) {
			setStatus('error')
			setErrorMessage('Você precisa estar logado para aceitar um convite de equipe.')
			return
		}

		if (!token) {
			setStatus('error')
			setErrorMessage('Token de convite não encontrado na URL.')
			return
		}

		setStatus('ready')
	}, [token, authData, authError, isAuthLoading])

	const handleAcceptInvite = async () => {
		if (!token) return

		setStatus('accepting')

		try {
			const result = await acceptInviteMutation.mutateAsync({ token })
			if (result.alreadyInTeam) {
				setStatus('already_in_team')
			} else {
				setStatus('success')
			}
		} catch (error) {
			setStatus('error')
			setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido')
		}
	}

	const handleGoToDashboard = () => {
		navigate('/dashboard')
	}

	const handleGoToLogin = () => {
		navigate('/login')
	}

	if (status === 'loading' || isAuthLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardContent className="p-8">
						<div className="flex flex-col items-center space-y-4">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
							<p className="text-muted-foreground">Carregando...</p>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (status === 'error') {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
							<XCircle className="h-6 w-6 text-red-600" />
						</div>
						<CardTitle className="text-xl">Erro no Convite</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-center text-muted-foreground">{errorMessage}</p>

						<div className="space-y-3">
							{authError || !authData?.user ? (
								<Button onClick={handleGoToLogin} className="w-full">
									Fazer Login
								</Button>
							) : (
								<Button onClick={handleGoToDashboard} className="w-full">
									Ir para Dashboard
								</Button>
							)}

							<Link to="/" className="block">
								<Button variant="outline" className="w-full">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Voltar ao Início
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (status === 'success') {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
							<CheckCircle className="h-6 w-6 text-green-600" />
						</div>
						<CardTitle className="text-xl">Convite Aceito!</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-center text-muted-foreground">
							Você foi adicionado à equipe com sucesso! Agora você pode ver a equipe no seu dashboard.
						</p>

						<div className="space-y-3">
							<Button onClick={handleGoToDashboard} className="w-full">
								Ir para Dashboard
							</Button>

							<Link to="/" className="block">
								<Button variant="outline" className="w-full">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Voltar ao Início
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (status === 'already_in_team') {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
							<Users className="h-6 w-6 text-blue-600" />
						</div>
						<CardTitle className="text-xl">Você já faz parte desta equipe</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-center text-muted-foreground">
							Você já é membro desta equipe! Não é necessário aceitar o convite novamente.
						</p>

						<div className="space-y-3">
							<Button onClick={handleGoToDashboard} className="w-full">
								Ir para Dashboard
							</Button>

							<Link to="/" className="block">
								<Button variant="outline" className="w-full">
									<ArrowLeft className="h-4 w-4 mr-2" />
									Voltar ao Início
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (status === 'accepting') {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardContent className="p-8">
						<div className="flex flex-col items-center space-y-4">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
							<p className="text-center font-medium">Aceitando convite...</p>
							<p className="text-center text-sm text-muted-foreground">Aguarde enquanto processamos seu convite.</p>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
						<Users className="h-6 w-6 text-blue-600" />
					</div>
					<CardTitle className="text-xl">Convite para Equipe</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="text-center space-y-2">
						<p className="text-muted-foreground">Você foi convidado para participar de uma equipe.</p>
						<p className="text-sm text-muted-foreground">
							Clique no botão abaixo para aceitar o convite e se juntar à equipe.
						</p>
					</div>

					{authData?.user && (
						<div className="bg-muted/30 p-3 rounded-lg">
							<p className="text-sm text-muted-foreground">Logado como:</p>
							<p className="font-medium">{authData.user.email}</p>
						</div>
					)}

					<div className="space-y-3">
						<Button onClick={handleAcceptInvite} disabled={acceptInviteMutation.isPending} className="w-full">
							{acceptInviteMutation.isPending ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Aceitando...
								</>
							) : (
								<>Aceitar Convite</>
							)}
						</Button>

						<Link to="/dashboard" className="block">
							<Button variant="outline" className="w-full">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Voltar ao Dashboard
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
