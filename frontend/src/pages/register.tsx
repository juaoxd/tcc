import { RegisterForm } from '@/components/register-form'
import { Link } from 'react-router-dom'
import { Trophy } from 'lucide-react'

export function Register() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					to="/torneio/1"
					className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
				>
					<Trophy className="h-4 w-4" />
					Ver Campeonato Público (Demo)
				</Link>
				<RegisterForm />
			</div>
		</div>
	)
}
