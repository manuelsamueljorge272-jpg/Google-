import { Transaction, Category, Account } from '../types/finance';

export const formatCurrency = (value: number, currency = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const parseCurrencyInput = (input: string | number): number => {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  if (!input) return 0;
  // Handle PT-BR inputs like "1.250,50" or "1250.50"
  let clean = input.trim().replace(/[R$\s]/g, '');
  if (clean.includes(',') && clean.includes('.')) {
    clean = clean.replace(/\./g, '').replace(',', '.');
  } else if (clean.includes(',')) {
    clean = clean.replace(',', '.');
  }
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatDateBR = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[monthIndex] || '';
};

export const formatMonthYear = (ym: string): string => {
  if (!ym) return '';
  const [year, month] = ym.split('-');
  const monthNum = parseInt(month, 10) - 1;
  return `${getMonthName(monthNum)} de ${year}`;
};

export const exportTransactionsToCsv = (
  transactions: Transaction[],
  categories: Category[],
  accounts: Account[]
): string => {
  const catMap = new Map(categories.map(c => [c.id, c.nome]));
  const accMap = new Map(accounts.map(a => [a.id, a.nome]));

  const headers = ['ID', 'Data', 'Descricao', 'Categoria', 'Tipo', 'Conta', 'Valor', 'Status', 'Observacoes'];
  const rows = transactions.map(t => {
    return [
      t.id,
      t.data,
      `"${(t.descricao || '').replace(/"/g, '""')}"`,
      `"${catMap.get(t.categoriaId) || t.categoriaId}"`,
      t.tipo,
      `"${accMap.get(t.contaId) || t.contaId}"`,
      t.valor.toFixed(2).replace('.', ','),
      t.status,
      `"${(t.observacoes || '').replace(/"/g, '""')}"`
    ].join(';');
  });

  return [headers.join(';'), ...rows].join('\r\n');
};

export const parseCsvToTransactions = (
  csvText: string,
  categories: Category[],
  accounts: Account[]
): Partial<Transaction>[] => {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const delimiter = lines[0].includes(';') ? ';' : ',';
  const newTransactions: Partial<Transaction>[] = [];

  // Map category and account names (lowercase trimmed) to IDs
  const catNameToId = new Map(categories.map(c => [c.nome.toLowerCase().trim(), c.id]));
  const accNameToId = new Map(accounts.map(a => [a.nome.toLowerCase().trim(), a.id]));

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(delimiter);
    if (rawCols.length < 5) continue;

    const cols = rawCols.map(c => c.trim().replace(/^"|"$/g, ''));
    
    // Attempt parsing: either (ID, Data, Descricao, Categoria, Tipo, Conta, Valor, Status, Obs) or (Data, Descricao, Categoria, Tipo, Conta, Valor)
    let data = '';
    let descricao = '';
    let categoriaStr = '';
    let tipoStr = 'despesa';
    let contaStr = '';
    let valorStr = '0';
    let statusStr = 'liquidado';
    let observacoes = '';

    if (cols.length >= 8 && cols[0].startsWith('tx_')) {
      // Full export format
      data = cols[1];
      descricao = cols[2];
      categoriaStr = cols[3];
      tipoStr = cols[4].toLowerCase();
      contaStr = cols[5];
      valorStr = cols[6];
      statusStr = cols[7].toLowerCase();
      observacoes = cols[8] || '';
    } else {
      // Standard format
      data = cols[0];
      descricao = cols[1];
      categoriaStr = cols[2];
      tipoStr = cols[3]?.toLowerCase() || 'despesa';
      contaStr = cols[4] || '';
      valorStr = cols[5] || '0';
      statusStr = cols[6]?.toLowerCase() || 'liquidado';
      observacoes = cols[7] || '';
    }

    // Normalize date (support DD/MM/YYYY or YYYY-MM-DD)
    if (data.includes('/')) {
      const parts = data.split('/');
      if (parts.length === 3) {
        data = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    const tipo: Transaction['tipo'] = tipoStr === 'receita' ? 'receita' : tipoStr === 'investimento' ? 'investimento' : 'despesa';
    const status: Transaction['status'] = statusStr.includes('pend') ? 'pendente' : 'liquidado';
    const valor = parseCurrencyInput(valorStr);

    const categoriaId = catNameToId.get(categoriaStr.toLowerCase().trim()) || categories[0]?.id || 'cat_outros';
    const contaId = accNameToId.get(contaStr.toLowerCase().trim()) || accounts[0]?.id || 'acc_nubank';

    newTransactions.push({
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      data: data || new Date().toISOString().split('T')[0],
      descricao: descricao || 'Lançamento importado',
      categoriaId,
      tipo,
      contaId,
      valor: Math.abs(valor),
      status,
      observacoes
    });
  }

  return newTransactions;
};
