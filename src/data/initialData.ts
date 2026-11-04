import { Category, Account, Transaction, FinancialGoal, BudgetPlan } from '../types/finance';

export const INITIAL_CATEGORIES: Category[] = [
  // Receitas
  { id: 'cat_vencimento', nome: 'Vencimento & Subsídios', tipo: 'receita', cor: '#10B981', icone: 'Briefcase' },
  { id: 'cat_recibos_verdes', nome: 'Prestação de Serviços / Recibos Verdes', tipo: 'receita', cor: '#059669', icone: 'Laptop' },
  { id: 'cat_dividendos', nome: 'Rendimentos, Juros & Dividendos', tipo: 'receita', cor: '#34D399', icone: 'TrendingUp' },
  { id: 'cat_outras_rec', nome: 'Outras Receitas', tipo: 'receita', cor: '#6EE7B7', icone: 'PlusCircle' },

  // Despesas
  { id: 'cat_habitacao', nome: 'Habitação (Renda / Prestação & Condomínio)', tipo: 'despesa', cor: '#EF4444', icone: 'Home', orcamentoPadrao: 850 },
  { id: 'cat_supermercado', nome: 'Supermercado & Hipermercado (Continente/Pingo Doce)', tipo: 'despesa', cor: '#F97316', icone: 'ShoppingCart', orcamentoPadrao: 450 },
  { id: 'cat_restauracao', nome: 'Restauração, Cafés & Takeaway', tipo: 'despesa', cor: '#FB923C', icone: 'Utensils', orcamentoPadrao: 200 },
  { id: 'cat_transportes', nome: 'Transportes, Combustível & Via Verde', tipo: 'despesa', cor: '#F59E0B', icone: 'Car', orcamentoPadrao: 180 },
  { id: 'cat_servicos', nome: 'Serviços (Eletricidade EDP, Água, Telecomunicações)', tipo: 'despesa', cor: '#EAB308', icone: 'Zap', orcamentoPadrao: 160 },
  { id: 'cat_saude', nome: 'Saúde, Farmácia & Seguro', tipo: 'despesa', cor: '#EC4899', icone: 'HeartPulse', orcamentoPadrao: 100 },
  { id: 'cat_educacao', nome: 'Educação, Formação & Livros', tipo: 'despesa', cor: '#8B5CF6', icone: 'GraduationCap', orcamentoPadrao: 80 },
  { id: 'cat_lazer', nome: 'Lazer, Viagens, Ginásio & Subscrições', tipo: 'despesa', cor: '#6366F1', icone: 'Film', orcamentoPadrao: 150 },
  { id: 'cat_outros_desp', nome: 'Despesas Diversas & Imprevistos', tipo: 'despesa', cor: '#64748B', icone: 'HelpCircle', orcamentoPadrao: 120 },

  // Investimentos / Poupança
  { id: 'cat_fundo_emergencia', nome: 'Fundo de Emergência (Certificados de Aforro)', tipo: 'investimento', cor: '#0284C7', icone: 'ShieldCheck', orcamentoPadrao: 250 },
  { id: 'cat_etf_acoes', nome: 'ETFs Mundiais (VWCE/IWDA) & Ações', tipo: 'investimento', cor: '#0369A1', icone: 'Landmark', orcamentoPadrao: 300 },
  { id: 'cat_ppr', nome: 'PPR (Plano Poupança Reforma)', tipo: 'investimento', cor: '#075985', icone: 'BarChart2', orcamentoPadrao: 150 },
];

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc_cgd', nome: 'Caixa Geral de Depósitos', instituicao: 'CGD', tipo: 'ordem', saldoInicial: 2450.00, cor: '#0054A6' },
  { id: 'acc_millennium', nome: 'Millennium BCP', instituicao: 'Millennium BCP', tipo: 'ordem', saldoInicial: 1820.50, cor: '#9A1032' },
  { id: 'acc_activobank', nome: 'ActivoBank', instituicao: 'ActivoBank', tipo: 'ordem', saldoInicial: 980.20, cor: '#00A3E0' },
  { id: 'acc_degiro', nome: 'DEGIRO / XTB Investimentos', instituicao: 'DEGIRO', tipo: 'investimento', saldoInicial: 14500.00, cor: '#111827' },
  { id: 'acc_wizink', nome: 'Cartão WiZink Rewards', instituicao: 'WiZink', tipo: 'cartao', saldoInicial: -320.00, cor: '#E60000' },
  { id: 'acc_carteira', nome: 'Numerário / Carteira', instituicao: 'Carteira', tipo: 'carteira', saldoInicial: 85.00, cor: '#10B981' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Novembro 2026 (Mês Atual em Portugal)
  {
    id: 'tx_pt_101',
    data: '2026-11-01',
    descricao: 'Vencimento Líquido Mensal + Subsídio de Alimentação',
    categoriaId: 'cat_vencimento',
    tipo: 'receita',
    contaId: 'acc_cgd',
    valor: 2480.00,
    status: 'liquidado',
    observacoes: 'Transferência SEPA entidade patronal'
  },
  {
    id: 'tx_pt_102',
    data: '2026-11-02',
    descricao: 'Prestação Crédito Habitação + Condomínio',
    categoriaId: 'cat_habitacao',
    tipo: 'despesa',
    contaId: 'acc_cgd',
    valor: 780.00,
    status: 'liquidado',
    observacoes: 'Débito direto bancário'
  },
  {
    id: 'tx_pt_103',
    data: '2026-11-02',
    descricao: 'Reforço Certificados de Aforro (Série F)',
    categoriaId: 'cat_fundo_emergencia',
    tipo: 'investimento',
    contaId: 'acc_cgd',
    valor: 250.00,
    status: 'liquidado',
    observacoes: 'AforroNet CTT'
  },
  {
    id: 'tx_pt_104',
    data: '2026-11-03',
    descricao: 'Compras Hipermercado Continente Telheiras',
    categoriaId: 'cat_supermercado',
    tipo: 'despesa',
    contaId: 'acc_wizink',
    valor: 168.45,
    status: 'liquidado',
    observacoes: 'Compras da quinzena com Cartão Continente'
  },
  {
    id: 'tx_pt_105',
    data: '2026-11-03',
    descricao: 'Faturação Recibo Verde - Consultoria Web',
    categoriaId: 'cat_recibos_verdes',
    tipo: 'receita',
    contaId: 'acc_activobank',
    valor: 750.00,
    status: 'liquidado',
    observacoes: 'Retenção na fonte de IRS já deduzida'
  },
  {
    id: 'tx_pt_106',
    data: '2026-11-04',
    descricao: 'Combustível Repsol + Portagens Via Verde',
    categoriaId: 'cat_transportes',
    tipo: 'despesa',
    contaId: 'acc_cgd',
    valor: 82.50,
    status: 'liquidado',
    observacoes: 'Gasóleo Simples e A1 Norte'
  },
  {
    id: 'tx_pt_107',
    data: '2026-11-04',
    descricao: 'Jantar Restaurante Típico Português',
    categoriaId: 'cat_restauracao',
    tipo: 'despesa',
    contaId: 'acc_wizink',
    valor: 54.00,
    status: 'liquidado',
    observacoes: 'Jantar em família (com NIF na fatura)'
  },
  {
    id: 'tx_pt_108',
    data: '2026-11-08',
    descricao: 'Fatura Eletricidade EDP Comercial',
    categoriaId: 'cat_servicos',
    tipo: 'despesa',
    contaId: 'acc_cgd',
    valor: 68.20,
    status: 'pendente',
    observacoes: 'Débito direto agendado'
  },
  {
    id: 'tx_pt_109',
    data: '2026-11-10',
    descricao: 'Pacote TV, Net Fibra 1Gbps & Voz (MEO)',
    categoriaId: 'cat_servicos',
    tipo: 'despesa',
    contaId: 'acc_millennium',
    valor: 42.99,
    status: 'pendente',
    observacoes: 'Pagamento por entidade e referência Multibanco'
  },
  {
    id: 'tx_pt_110',
    data: '2026-11-12',
    descricao: 'Dividendos Trimestrais de ETFs',
    categoriaId: 'cat_dividendos',
    tipo: 'receita',
    contaId: 'acc_degiro',
    valor: 94.30,
    status: 'pendente',
    observacoes: 'Crédito em conta corretora'
  },
  {
    id: 'tx_pt_111',
    data: '2026-11-15',
    descricao: 'Reforço ETF Vanguard FTSE All-World (VWCE)',
    categoriaId: 'cat_etf_acoes',
    tipo: 'investimento',
    contaId: 'acc_degiro',
    valor: 300.00,
    status: 'pendente',
    observacoes: 'Aporte regular DCA na bolsa Euronext'
  },
  {
    id: 'tx_pt_112',
    data: '2026-11-18',
    descricao: 'Copagamento Seguro de Saúde Médis & Farmácia',
    categoriaId: 'cat_saude',
    tipo: 'despesa',
    contaId: 'acc_cgd',
    valor: 48.00,
    status: 'pendente',
    observacoes: 'Consulta médica de rotina'
  },
  {
    id: 'tx_pt_113',
    data: '2026-11-20',
    descricao: 'Mensalidade Ginásio Solinca & Subscrições',
    categoriaId: 'cat_lazer',
    tipo: 'despesa',
    contaId: 'acc_wizink',
    valor: 44.90,
    status: 'pendente',
    observacoes: 'Ginásio + Spotify Premium'
  },

  // Outubro 2026 (Mês Anterior - histórico)
  {
    id: 'tx_pt_001',
    data: '2026-10-01',
    descricao: 'Vencimento Líquido Mensal + Subsídio',
    categoriaId: 'cat_vencimento',
    tipo: 'receita',
    contaId: 'acc_cgd',
    valor: 2480.00,
    status: 'liquidado',
    observacoes: 'Outubro 2026'
  },
  {
    id: 'tx_pt_002',
    data: '2026-10-02',
    descricao: 'Prestação Crédito Habitação & Condomínio',
    categoriaId: 'cat_habitacao',
    tipo: 'despesa',
    contaId: 'acc_cgd',
    valor: 780.00,
    status: 'liquidado',
    observacoes: 'Pago'
  },
  {
    id: 'tx_pt_003',
    data: '2026-10-05',
    descricao: 'Hipermercado Pingo Doce & Feira',
    categoriaId: 'cat_supermercado',
    tipo: 'despesa',
    contaId: 'acc_wizink',
    valor: 412.30,
    status: 'liquidado',
    observacoes: 'Compras mensais'
  },
  {
    id: 'tx_pt_004',
    data: '2026-10-08',
    descricao: 'Consultoria Informática - Empresa Parceira',
    categoriaId: 'cat_recibos_verdes',
    tipo: 'receita',
    contaId: 'acc_activobank',
    valor: 920.00,
    status: 'liquidado',
    observacoes: 'Recebido via transferência bancária'
  },
  {
    id: 'tx_pt_005',
    data: '2026-10-10',
    descricao: 'Entrega Anual PPR Alves Ribeiro',
    categoriaId: 'cat_ppr',
    tipo: 'investimento',
    contaId: 'acc_millennium',
    valor: 400.00,
    status: 'liquidado',
    observacoes: 'Benefício fiscal IRS de 20%'
  },
  {
    id: 'tx_pt_006',
    data: '2026-10-15',
    descricao: 'Inscrição em Curso e Certificação Profissional',
    categoriaId: 'cat_educacao',
    tipo: 'despesa',
    contaId: 'acc_cgd',
    valor: 95.00,
    status: 'liquidado',
    observacoes: 'Dedutível no e-Fatura'
  },
  {
    id: 'tx_pt_007',
    data: '2026-10-22',
    descricao: 'Revisão Automóvel & Inspeção Periódica (IPO)',
    categoriaId: 'cat_transportes',
    tipo: 'despesa',
    contaId: 'acc_cgd',
    valor: 145.00,
    status: 'liquidado',
    observacoes: 'Oficina e centro de inspeções'
  }
];

export const INITIAL_GOALS: FinancialGoal[] = [
  {
    id: 'goal_fundo_emergencia',
    titulo: 'Fundo de Emergência (6 Meses)',
    valorAlvo: 9000.00,
    valorAtual: 6250.00,
    dataLimite: '2027-04-30',
    cor: '#0284C7',
    categoria: 'Segurança & Estabilidade'
  },
  {
    id: 'goal_ferias',
    titulo: 'Férias de Verão no Algarve / Açores',
    valorAlvo: 2200.00,
    valorAtual: 1450.00,
    dataLimite: '2027-07-31',
    cor: '#10B981',
    categoria: 'Lazer & Família'
  },
  {
    id: 'goal_habitacao',
    titulo: 'Amortização Antecipada do Crédito Habitação',
    valorAlvo: 15000.00,
    valorAtual: 7800.00,
    dataLimite: '2028-12-31',
    cor: '#8B5CF6',
    categoria: 'Património Imobiliário'
  }
];

export const INITIAL_BUDGETS: BudgetPlan[] = [
  { categoriaId: 'cat_habitacao', mesAno: '2026-11', valorPlanejado: 850 },
  { categoriaId: 'cat_supermercado', mesAno: '2026-11', valorPlanejado: 450 },
  { categoriaId: 'cat_restauracao', mesAno: '2026-11', valorPlanejado: 200 },
  { categoriaId: 'cat_transportes', mesAno: '2026-11', valorPlanejado: 180 },
  { categoriaId: 'cat_servicos', mesAno: '2026-11', valorPlanejado: 160 },
  { categoriaId: 'cat_saude', mesAno: '2026-11', valorPlanejado: 100 },
  { categoriaId: 'cat_educacao', mesAno: '2026-11', valorPlanejado: 80 },
  { categoriaId: 'cat_lazer', mesAno: '2026-11', valorPlanejado: 150 },
  { categoriaId: 'cat_outros_desp', mesAno: '2026-11', valorPlanejado: 120 },
  { categoriaId: 'cat_fundo_emergencia', mesAno: '2026-11', valorPlanejado: 250 },
  { categoriaId: 'cat_etf_acoes', mesAno: '2026-11', valorPlanejado: 300 },
  { categoriaId: 'cat_ppr', mesAno: '2026-11', valorPlanejado: 150 }
];
