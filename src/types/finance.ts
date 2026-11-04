export type TransactionType = 'receita' | 'despesa' | 'investimento';

export type TransactionStatus = 'liquidado' | 'pendente';

export interface Transaction {
  id: string;
  data: string; // YYYY-MM-DD
  descricao: string;
  categoriaId: string;
  tipo: TransactionType;
  contaId: string;
  valor: number;
  status: TransactionStatus;
  observacoes?: string;
}

export interface Category {
  id: string;
  nome: string;
  tipo: TransactionType;
  cor: string;
  icone?: string;
  orcamentoPadrao?: number; // Para cálculo de orçamento
}

export interface Account {
  id: string;
  nome: string;
  instituicao: string;
  tipo: 'corrente' | 'poupanca' | 'investimento' | 'cartao' | 'carteira';
  saldoInicial: number;
  cor: string;
}

export interface BudgetPlan {
  categoriaId: string;
  mesAno: string; // YYYY-MM
  valorPlanejado: number;
}

export interface FinancialGoal {
  id: string;
  titulo: string;
  valorAlvo: number;
  valorAtual: number;
  dataLimite: string; // YYYY-MM-DD
  cor: string;
  categoria: string;
}

export type ActiveTab = 'planilha' | 'orcamento' | 'metas' | 'relatorios' | 'contas';
