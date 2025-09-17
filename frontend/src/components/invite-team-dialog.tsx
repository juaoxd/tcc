import { useState, useId } from 'react'
import { Button } from './ui/button'
import { DialogContent, DialogDescription, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent } from './ui/card'
import { Copy, Check, Clock, Users } from 'lucide-react'
import { useInviteToTeam } from '../http/use-invite-to-team'

interface InviteTeamDialogProps {
	teamId: string
	teamName: string
	onClose?: () => void
}

export function InviteTeamDialog({ teamId, teamName, onClose }: InviteTeamDialogProps) {
	const [inviteLink, setInviteLink] = useState<string>('')
	const [expiresIn, setExpiresIn] = useState<string>('')
	const [copied, setCopied] = useState(false)
	const [linkUpdated, setLinkUpdated] = useState(false)
	const inputId = useId()

	const inviteToTeamMutation = useInviteToTeam()

	const handleGenerateInvite = async () => {
		try {
			const result = await inviteToTeamMutation.mutateAsync({ idEquipe: teamId })

			// Se já havia um link, ativar animação de atualização
			if (inviteLink) {
				setLinkUpdated(true)
				setTimeout(() => setLinkUpdated(false), 1500) // Remove animação após 1.5s
			}

			setInviteLink(result.linkConvite)
			setExpiresIn(result.expiresIn)
			setCopied(false) // Reset do estado de copiado
		} catch (error) {
			// O erro já é tratado pelo hook useInviteToTeam
			console.error('Erro ao gerar convite:', error)
		}
	}

	const handleCopyLink = async () => {
		if (inviteLink) {
			try {
				await navigator.clipboard.writeText(inviteLink)
				setCopied(true)
				setTimeout(() => setCopied(false), 2000)
			} catch (error) {
				console.error('Erro ao copiar link:', error)
			}
		}
	}

	const formatExpirationTime = (expiresIn: string) => {
		// O backend retorna strings como "15 minutos"
		return expiresIn
	}

	return (
		<DialogContent className="sm:max-w-[500px]">
			<DialogTitle>Convidar Participantes</DialogTitle>
			<DialogDescription>
				Gere um link de convite para que outros usuários possam se juntar à equipe "{teamName}".
			</DialogDescription>

			<div className="space-y-6">
				{!inviteLink ? (
					<div className="text-center space-y-4">
						<div className="p-6 bg-muted/30 rounded-lg">
							<Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
							<p className="text-sm text-muted-foreground">
								Clique no botão abaixo para gerar um link de convite para sua equipe.
							</p>
						</div>

						<Button onClick={handleGenerateInvite} disabled={inviteToTeamMutation.isPending} className="w-full">
							{inviteToTeamMutation.isPending ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
									Gerando convite...
								</>
							) : (
								<>Gerar Link de Convite</>
							)}
						</Button>
					</div>
				) : (
					<div className="space-y-4">
						<Card className={`transition-all duration-500 ${linkUpdated ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
							<CardContent className="p-4">
								<div className="space-y-3">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Clock className="h-4 w-4" />
										<span>Expira em: {formatExpirationTime(expiresIn)}</span>
									</div>

									<div className="space-y-2">
										<Label htmlFor={inputId}>Link de Convite</Label>
										<div className="flex gap-2">
											<Input
												id={inputId}
												value={inviteLink}
												readOnly
												className={`font-mono text-sm transition-all duration-500 ${linkUpdated ? 'ring-2 ring-green-400 bg-green-50' : ''}`}
											/>
											<Button variant="outline" size="sm" onClick={handleCopyLink} className="shrink-0">
												{copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
											</Button>
										</div>
										{copied && <p className="text-sm text-green-600">Link copiado para a área de transferência!</p>}
										{linkUpdated && (
											<p className="text-sm text-green-600 animate-pulse">✨ Link atualizado com sucesso!</p>
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<h4 className="font-medium text-blue-900 mb-2">Como usar o convite:</h4>
							<ul className="text-sm text-blue-800 space-y-1">
								<li>• Compartilhe este link com as pessoas que deseja convidar</li>
								<li>• O link expira automaticamente no horário indicado</li>
								<li>• Cada pessoa precisará estar logada para aceitar o convite</li>
							</ul>
						</div>

						<div className="flex gap-3 pt-2">
							<Button
								variant="outline"
								onClick={handleGenerateInvite}
								disabled={inviteToTeamMutation.isPending}
								className="flex-1"
							>
								Gerar Novo Link
							</Button>
							<Button onClick={onClose} className="flex-1">
								Fechar
							</Button>
						</div>
					</div>
				)}
			</div>
		</DialogContent>
	)
}
