export type TipoEsporte = 'FUTEBOL' | 'BASQUETE' | 'VOLEI'

type Evento = {
	nome: string
	afetaPlacar: boolean
	deltaMandante?: number
	deltaVisitante?: number
}

type Esporte = {
	nome: string
	periodosPorJogo: number
	minutosPorPeriodo?: number
	permiteEmpate: boolean
	usaSets: boolean
	maxJogadoresCampo: number
	pontos: { vitoria: number; empate: number; derrota: number }
	criteriosDesempate: readonly string[]
	eventos: Record<string, Evento>
}

export const ESPORTES: Record<TipoEsporte, Esporte> = {
	FUTEBOL: {
		nome: 'Futebol',
		periodosPorJogo: 2,
		minutosPorPeriodo: 45,
		permiteEmpate: true,
		usaSets: false,
		maxJogadoresCampo: 11,
		pontos: { vitoria: 3, empate: 1, derrota: 0 },
		criteriosDesempate: ['PONTOS', 'SALDO_GOLS', 'GOLS_PRO', 'DISCIPLINA', 'SORTEIO'],
		eventos: {
			GOL: { nome: 'Gol', afetaPlacar: true, deltaMandante: 1, deltaVisitante: 0 },
			CARTAO_AMARELO: { nome: 'Cartão Amarelo', afetaPlacar: false },
			CARTAO_VERMELHO: { nome: 'Cartão Vermelho', afetaPlacar: false },
		},
	},
	BASQUETE: {
		nome: 'Basquete',
		periodosPorJogo: 4,
		minutosPorPeriodo: 10,
		permiteEmpate: false,
		usaSets: false,
		maxJogadoresCampo: 5,
		pontos: { vitoria: 2, empate: 0, derrota: 1 },
		criteriosDesempate: ['PONTOS', 'VITORIAS', 'SALDO_GOLS', 'GOLS_PRO', 'SORTEIO'],
		eventos: {
			CESTA_1: { nome: 'Lance Livre', afetaPlacar: true, deltaMandante: 1 },
			CESTA_2: { nome: 'Cesta de 2', afetaPlacar: true, deltaMandante: 2 },
			CESTA_3: { nome: 'Cesta de 3', afetaPlacar: true, deltaMandante: 3 },
			FALTA: { nome: 'Falta', afetaPlacar: false },
		},
	},
	VOLEI: {
		nome: 'Vôlei',
		periodosPorJogo: 5,
		permiteEmpate: false,
		usaSets: true,
		maxJogadoresCampo: 6,
		pontos: { vitoria: 2, empate: 0, derrota: 1 },
		criteriosDesempate: ['PONTOS', 'VITORIAS', 'SORTEIO'],
		eventos: {
			PONTO: { nome: 'Ponto', afetaPlacar: true, deltaMandante: 1 },
			ACE: { nome: 'Ace', afetaPlacar: true, deltaMandante: 1 },
			BLOQUEIO: { nome: 'Bloqueio', afetaPlacar: true, deltaMandante: 1 },
			FALTA_VOLEI: { nome: 'Falta', afetaPlacar: false },
		},
	},
}
