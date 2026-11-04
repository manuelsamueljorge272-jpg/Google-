import { Category, Account, Transaction, FinancialGoal, BudgetPlan } from '../types/finance';

export const INITIAL_CATEGORIES: Category[] = [
  // Receitas
  { id: 'cat_salario', nome: 'Salário & Pró-labore', tipo: 'receita', cor: '#10B981', icone: 'Briefcase' },
  { id: 'cat_freelance', nome: 'Freelance & Consultoria', tipo: 'receita', cor: '#059669', icone: 'Laptop' },
  { id: 'cat_dividendos', nome: 'Rendimentos & Dividendos', tipo: 'receita', cor: '#34D399', icone: 'TrendingUp' },
  { id: 'cat_outras_rec', nome: 'Outras Receitas', tipo: 'receita', cor: '#6EE7B7', icone: 'PlusCircle' },

  // Despesas
  { id: 'cat_moradia', nome: 'Moradia (Aluguel/Condomínio)', tipo: 'despesa', cor: '#EF4444', icone: 'Home', orcamentoPadrao: 2800 },
  { id: 'cat_supermercado', nome: 'Supermercado & Feira', tipo: 'despesa', cor: '#F97316', icone: 'ShoppingCart', orcamentoPadrao: 1800 },
  { id: 'cat_alimentacao', nome: 'Restaurantes & Delivery', tipo: 'despesa', cor: '#FB923C', icone: 'Utensils', orcamentoPadrao: 750 },
  { id: 'cat_transporte', nome: 'Transporte & Combustível', tipo: 'despesa', cor: '#F59E0B', icone: 'Car', orcamentoPadrao: 650 },
  { id: 'cat_contas', nome: 'Contas (Luz, Água, Internet)', tipo: 'despesa', cor: '#EAB308', icone: 'Zap', orcamentoPadrao: 550 },
  { id: 'cat_saude', nome: 'Saúde & Farmácia', tipo: 'despesa', cor: '#EC4899', icone: 'HeartPulse', orcamentoPadrao: 400 },
  { id: 'cat_educacao', nome: 'Educação & Livros', tipo: 'despesa', cor: '#8B5CF6', icone: 'GraduationCap', orcamentoPadrao: 350 },
  { id: 'cat_lazer', nome: 'Lazer, Viagens & Streaming', tipo: 'despesa', cor: '#6366F1', icone: 'Film', orcamentoPadrao: 600 },
  { id: 'cat_outros_desp', nome: 'Diversos & Imprevistos', tipo: 'despesa', cor: '#64748B', icone: 'HelpCircle', orcamentoPadrao: 400 },

  // Investimentos
  { id: 'cat_reserva', nome: 'Reserva de Emergência', tipo: 'investimento', cor: '#0284C7', icone: 'ShieldCheck', orcamentoPadrao: 1000 },
  { id: 'cat_rendafixa', nome: 'Tesouro & Renda Fixa', tipo: 'investimento', cor: '#0369A1', icone: 'Landmark', orcamentoPadrao: 800 },
  { id: 'cat_rendavariavel', nome: 'Ações & Fundos Imobiliários', tipo: 'investimento', cor: '#075985', icone: 'BarChart2', orcamentoPadrao: 1000 },
];

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc_itau', nome: 'Itaú Unibanco', instituicao: 'Banco Itaú', tipo: 'corrente', saldoInicial: 4850.00, cor: '#EC7000' },
  { id: 'acc_nubank', nome: 'Nubank NuConta', instituicao: 'Nubank', tipo: 'corrente', saldoInicial: 3120.45, cor: '#820AD1' },
  { id: 'acc_inter', nome: 'Inter Investimentos', instituicao: 'Banco Inter', tipo: 'investimento', saldoInicial: 28400.00, cor: '#FF7A00' },
  { id: 'acc_xp_card', nome: 'Cartão XP Infinite', instituicao: 'XP Investimentos', tipo: 'cartao', saldoInicial: -1680.00, cor: '#111827' },
  { id: 'acc_carteira', nome: 'Dinheiro Físico', instituicao: 'Carteira', tipo: 'carteira', saldoInicial: 340.00, cor: '#10B981' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Novembro 2026 (Mês Atual)
  {
    id: 'tx_101',
    data: '2026-11-01',
    descricao: 'Salário Mensal Corporativo',
    categoriaId: 'cat_salario',
    tipo: 'receita',
    contaId: 'acc_itau',
    valor: 9200.00,
    status: 'liquidado',
    observacoes: 'Depósito em conta Itaú'
  },
  {
    id: 'tx_102',
    data: '2026-11-02',
    descricao: 'Aluguel do Apartamento + Condomínio',
    categoriaId: 'cat_moradia',
    tipo: 'despesa',
    contaId: 'acc_itau',
    valor: 2750.00,
    status: 'liquidado',
    observacoes: 'Transferência Pix imobiliária'
  },
  {
    id: 'tx_103',
    data: '2026-11-02',
    descricao: 'Aporte Tesouro Selic 2029',
    categoriaId: 'cat_reserva',
    tipo: 'investimento',
    contaId: 'acc_inter',
    valor: 1000.00,
    status: 'liquidado',
    observacoes: 'Reforço de reserva de emergência'
  },
  {
    id: 'tx_104',
    data: '2026-11-03',
    descricao: 'Compras Supermercado Pão de Açúcar',
    categoriaId: 'cat_supermercado',
    tipo: 'despesa',
    contaId: 'acc_xp_card',
    valor: 642.30,
    status: 'liquidado',
    observacoes: 'Compras da primeira quinzena'
  },
  {
    id: 'tx_105',
    data: '2026-11-03',
    descricao: 'Consultoria de Design UX/UI - Projeto Alpha',
    categoriaId: 'cat_freelance',
    tipo: 'receita',
    contaId: 'acc_nubank',
    valor: 2400.00,
    status: 'liquidado',
    observacoes: 'Primeira parcela entrega wireframes'
  },
  {
    id: 'tx_106',
    data: '2026-11-04',
    descricao: 'Abastecimento Gasolina Comum Posto Shell',
    categoriaId: 'cat_transporte',
    tipo: 'despesa',
    contaId: 'acc_nubank',
    valor: 245.00,
    status: 'liquidado',
    observacoes: 'Tanque cheio'
  },
  {
    id: 'tx_107',
    data: '2026-11-04',
    descricao: 'Jantar Restaurante Italiano',
    categoriaId: 'cat_alimentacao',
    tipo: 'despesa',
    contaId: 'acc_xp_card',
    valor: 185.00,
    status: 'liquidado',
    observacoes: 'Jantar com a família'
  },
  {
    id: 'tx_108',
    data: '2026-11-08',
    descricao: 'Conta de Energia Enel',
    categoriaId: 'cat_contas',
    tipo: 'despesa',
    contaId: 'acc_itau',
    valor: 218.40,
    status: 'pendente',
    observacoes: 'Débito programado'
  },
  {
    id: 'tx_109',
    data: '2026-11-10',
    descricao: 'Internet Fibra Óptica 600MB',
    categoriaId: 'cat_contas',
    tipo: 'despesa',
    contaId: 'acc_nubank',
    valor: 139.90,
    status: 'pendente',
    observacoes: 'Boleto bancário a vencer'
  },
  {
    id: 'tx_110',
    data: '2026-11-12',
    descricao: 'Dividendos FIIs (HGLG11 / KNCR11)',
    categoriaId: 'cat_dividendos',
    tipo: 'receita',
    contaId: 'acc_inter',
    valor: 312.50,
    status: 'pendente',
    observacoes: 'Previsão de crédito na corretora'
  },
  {
    id: 'tx_111',
    data: '2026-11-15',
    descricao: 'Aporte Fundos Imobiliários',
    categoriaId: 'cat_rendavariavel',
    tipo: 'investimento',
    contaId: 'acc_inter',
    valor: 850.00,
    status: 'pendente',
    observacoes: 'Reinvestimento de proventos'
  },
  {
    id: 'tx_112',
    data: '2026-11-18',
    descricao: 'Plano de Saúde Familiar',
    categoriaId: 'cat_saude',
    tipo: 'despesa',
    contaId: 'acc_itau',
    valor: 390.00,
    status: 'pendente',
    observacoes: 'Mensalidade coparticipação'
  },
  {
    id: 'tx_113',
    data: '2026-11-20',
    descricao: 'Assinaturas Streaming (Netflix & Spotify)',
    categoriaId: 'cat_lazer',
    tipo: 'despesa',
    contaId: 'acc_xp_card',
    valor: 89.80,
    status: 'pendente',
    observacoes: 'Recorrente no cartão'
  },

  // Outubro 2026 (Mês Anterior - para histórico e comparação)
  {
    id: 'tx_001',
    data: '2026-10-01',
    descricao: 'Salário Mensal Corporativo',
    categoriaId: 'cat_salario',
    tipo: 'receita',
    contaId: 'acc_itau',
    valor: 9200.00,
    status: 'liquidado',
    observacoes: 'Mês anterior'
  },
  {
    id: 'tx_002',
    data: '2026-10-03',
    descricao: 'Aluguel do Apartamento + Condomínio',
    categoriaId: 'cat_moradia',
    tipo: 'despesa',
    contaId: 'acc_itau',
    valor: 2750.00,
    status: 'liquidado',
    observacoes: 'Pago'
  },
  {
    id: 'tx_003',
    data: '2026-10-05',
    descricao: 'Supermercado Mês Todo',
    categoriaId: 'cat_supermercado',
    tipo: 'despesa',
    contaId: 'acc_xp_card',
    valor: 1680.40,
    status: 'liquidado',
    observacoes: 'Compras gerais'
  },
  {
    id: 'tx_004',
    data: '2026-10-08',
    descricao: 'Consultoria Backend Node.js',
    categoriaId: 'cat_freelance',
    tipo: 'receita',
    contaId: 'acc_nubank',
    valor: 3500.00,
    status: 'liquidado',
    observacoes: 'Recebido via Pix'
  },
  {
    id: 'tx_005',
    data: '2026-10-10',
    descricao: 'Aporte Tesouro IPCA+ 2035',
    categoriaId: 'cat_rendafixa',
    tipo: 'investimento',
    contaId: 'acc_inter',
    valor: 1500.00,
    status: 'liquidado',
    observacoes: 'Investimento mensal'
  },
  {
    id: 'tx_006',
    data: '2026-10-15',
    descricao: 'Curso Avançado de Finanças & Python',
    categoriaId: 'cat_educacao',
    tipo: 'despesa',
    contaId: 'acc_xp_card',
    valor: 340.00,
    status: 'liquidado',
    observacoes: 'Investimento em carreira'
  },
  {
    id: 'tx_007',
    data: '2026-10-22',
    descricao: 'Manutenção Preventiva do Carro',
    categoriaId: 'cat_transporte',
    tipo: 'despesa',
    contaId: 'acc_itau',
    valor: 520.00,
    status: 'liquidado',
    observacoes: 'Troca de óleo e filtros'
  }
];

export const INITIAL_GOALS: FinancialGoal[] = [
  {
    id: 'goal_reserva',
    titulo: 'Reserva de Emergência (6 Meses)',
    valorAlvo: 35000.00,
    valorAtual: 24500.00,
    dataLimite: '2027-04-30',
    cor: '#0284C7',
    categoria: 'Segurança'
  },
  {
    id: 'goal_viagem',
    titulo: 'Viagem de Férias para Europa',
    valorAlvo: 16000.00,
    valorAtual: 9800.00,
    dataLimite: '2027-09-15',
    cor: '#10B981',
    categoria: 'Lazer'
  },
  {
    id: 'goal_imovel',
    titulo: 'Entrada Financiamento Imóvel',
    valorAlvo: 80000.00,
    valorAtual: 38200.00,
    dataLimite: '2028-12-31',
    cor: '#8B5CF6',
    categoria: 'Patrimônio'
  }
];

export const INITIAL_BUDGETS: BudgetPlan[] = [
  { categoriaId: 'cat_moradia', mesAno: '2026-11', valorPlanejado: 2800 },
  { categoriaId: 'cat_supermercado', mesAno: '2026-11', valorPlanejado: 1800 },
  { categoriaId: 'cat_alimentacao', mesAno: '2026-11', valorPlanejado: 750 },
  { categoriaId: 'cat_transporte', mesAno: '2026-11', valorPlanejado: 650 },
  { categoriaId: 'cat_contas', mesAno: '2026-11', valorPlanejado: 550 },
  { categoriaId: 'cat_saude', mesAno: '2026-11', valorPlanejado: 400 },
  { categoriaId: 'cat_educacao', mesAno: '2026-11', valorPlanejado: 350 },
  { categoriaId: 'cat_lazer', mesAno: '2026-11', valorPlanejado: 600 },
  { categoriaId: 'cat_outros_desp', mesAno: '2026-11', valorPlanejado: 400 },
  { categoriaId: 'cat_reserva', mesAno: '2026-11', valorPlanejado: 1000 },
  { categoriaId: 'cat_rendafixa', mesAno: '2026-11', valorPlanejado: 800 },
  { categoriaId: 'cat_rendavariavel', mesAno: '2026-11', valorPlanejado: 1000 }
];
