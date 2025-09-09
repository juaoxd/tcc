import { Trophy, Users, LogOut } from 'lucide-react'

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarFooter,
} from '@/components/ui/sidebar'
import { useLogout } from '@/http/use-logout'
import { Button } from '@/components/ui/button'

const items = [
	{
		title: 'Organizador',
		icon: Trophy,
		id: 'organizer',
	},
	{
		title: 'Participante',
		icon: Users,
		id: 'participant',
	},
]

interface AppSidebarProps {
	activeSection: string
	onSectionChange: (section: string) => void
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
	const logout = useLogout()

	const handleLogout = () => {
		logout.mutate()
	}

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-4 py-2">
					<h1 className="text-xl font-bold">Dashboard</h1>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navegação</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton isActive={activeSection === item.id} onClick={() => onSectionChange(item.id)}>
										<item.icon />
										<span>{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroup>
					<SidebarGroupContent>
						<Button variant="ghost" className="w-full justify-start" onClick={handleLogout} disabled={logout.isPending}>
							<LogOut className="mr-2 h-4 w-4" />
							{logout.isPending ? 'Saindo...' : 'Sair'}
						</Button>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	)
}
