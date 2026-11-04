import React, { useState, useMemo } from 'react';
import { Transaction, Category, Account, TransactionType, TransactionStatus } from '../types/finance';
import { formatCurrency, parseCurrencyInput } from '../utils/formatters';
import { 
  Search, 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  Upload, 
  CheckCircle2, 
  Clock, 
  ArrowUpDown,
  FilterX
} from 'lucide-react';

interface SpreadsheetViewProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  onUpdateTransaction: (updated: Transaction) => void;
  onAddTransaction: (newTx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onBatchDelete: (ids: string[]) => void;
  onBatchUpdateStatus: (ids: string[], status: TransactionStatus) => void;
  onOpenExportModal: () => void;
  onOpenImportModal: () => void;
  selectedMonth: string; // YYYY-MM or 'all'
  onMonthChange: (month: string) => void;
}

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  transactions,
  categories,
  accounts,
  onUpdateTransaction,
  onAddTransaction,
  onDeleteTransaction,
  onBatchDelete,
  onBatchUpdateStatus,
  onOpenExportModal,
  onOpenImportModal,
  selectedMonth,
  onMonthChange,
}) => {
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');

  // Sorting
  const [sortField, setSortField] = useState<'data' | 'valor' | 'descricao'>('data');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Category and Account lookup maps
  const catMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);
  const accMap = useMemo(() => new Map(accounts.map(a => [a.id, a])), [accounts]);

  // Available unique months from all transactions
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    // Always include current and recent months
    monthsSet.add('2026-11');
    monthsSet.add('2026-10');
    transactions.forEach(t => {
      if (t.data && t.data.length >= 7) {
        monthsSet.add(t.data.substring(0, 7));
      }
    });
    return Array.from(monthsSet).sort().reverse();
  }, [transactions]);

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        // Month filter
        if (selectedMonth !== 'all' && (!t.data || !t.data.startsWith(selectedMonth))) {
          return false;
        }
        // Type filter
        if (typeFilter !== 'all' && t.tipo !== typeFilter) {
          return false;
        }
        // Status filter
        if (statusFilter !== 'all' && t.status !== statusFilter) {
          return false;
        }
        // Category filter
        if (categoryFilter !== 'all' && t.categoriaId !== categoryFilter) {
          return false;
        }
        // Account filter
        if (accountFilter !== 'all' && t.contaId !== accountFilter) {
          return false;
        }
        // Search term (description or notes)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const descMatch = t.descricao.toLowerCase().includes(term);
          const obsMatch = t.observacoes?.toLowerCase().includes(term) || false;
          const catName = catMap.get(t.categoriaId)?.nome.toLowerCase() || '';
          const accName = accMap.get(t.contaId)?.nome.toLowerCase() || '';
          if (!descMatch && !obsMatch && !catName.includes(term) && !accName.includes(term)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'data') {
          cmp = a.data.localeCompare(b.data);
        } else if (sortField === 'valor') {
          cmp = a.valor - b.valor;
        } else if (sortField === 'descricao') {
          cmp = a.descricao.localeCompare(b.descricao);
        }
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [
    transactions,
    selectedMonth,
    typeFilter,
    statusFilter,
    categoryFilter,
    accountFilter,
    searchTerm,
    sortField,
    sortOrder,
    catMap,
    accMap
  ]);

  // Totals of currently filtered items
  const totals = useMemo(() => {
    let receitas = 0;
    let despesas = 0;
    let investimentos = 0;
    filteredTransactions.forEach(t => {
      if (t.tipo === 'receita') receitas += t.valor;
      else if (t.tipo === 'despesa') despesas += t.valor;
      else if (t.tipo === 'investimento') investimentos += t.valor;
    });
    return {
      receitas,
      despesas,
      investimentos,
      saldo: receitas - despesas,
      totalCount: filteredTransactions.length
    };
  }, [filteredTransactions]);

  // Selected items sum
  const selectedSum = useMemo(() => {
    if (selectedIds.size === 0) return 0;
    let sum = 0;
    transactions.forEach(t => {
      if (selectedIds.has(t.id)) {
        if (t.tipo === 'receita') sum += t.valor;
        else if (t.tipo === 'despesa') sum -= t.valor;
      }
    });
    return sum;
  }, [selectedIds, transactions]);

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredTransactions.map(t => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (field: 'data' | 'valor' | 'descricao') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleAddQuickRow = () => {
    const today = new Date().toISOString().split('T')[0];
    const newTx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      data: selectedMonth !== 'all' ? `${selectedMonth}-01` : today,
      descricao: 'Novo movimento',
      categoriaId: categories[0]?.id || 'cat_outros',
      tipo: 'despesa',
      contaId: accounts[0]?.id || 'acc_cgd',
      valor: 0,
      status: 'liquidado',
      observacoes: ''
    };
    onAddTransaction(newTx);
  };

  const handleDuplicateRow = (t: Transaction) => {
    const copy: Transaction = {
      ...t,
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      descricao: `${t.descricao} (Cópia)`,
    };
    onAddTransaction(copy);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setCategoryFilter('all');
    setAccountFilter('all');
  };

  return (
    <div className="space-y-4">
      {/* Spreadsheet Top Control Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Left: Search & Filter Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Pesquisar movimentos..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Month Selector */}
            <select
              value={selectedMonth}
              onChange={e => onMonthChange(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            >
              <option value="all">Todos os meses</option>
              {availableMonths.map(ym => {
                const [year, month] = ym.split('-');
                const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                const label = `${monthNames[parseInt(month, 10) - 1]} / ${year}`;
                return (
                  <option key={ym} value={ym}>
                    {label}
                  </option>
                );
              })}
            </select>

            {/* Type Filter Segmented Control */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('receita')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                  typeFilter === 'receita'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Receitas
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('despesa')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                  typeFilter === 'despesa'
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Despesas
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('investimento')}
                className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                  typeFilter === 'investimento'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Poupança
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="py-1.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Status: Todos</option>
              <option value="liquidado">Apenas Liquidados</option>
              <option value="pendente">Apenas Pendentes</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[160px] truncate"
            >
              <option value="all">Categoria: Todas</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            {(searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all' || accountFilter !== 'all') && (
              <button
                type="button"
                onClick={clearAllFilters}
                title="Limpar todos os filtros"
                className="p-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Limpar</span>
              </button>
            )}
          </div>

          {/* Right: Actions Toolbar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAddQuickRow}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Linha</span>
            </button>
            <button
              type="button"
              onClick={onOpenExportModal}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
            <button
              type="button"
              onClick={onOpenImportModal}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importar</span>
            </button>
          </div>
        </div>

        {/* Batch Operations Bar (if items selected) */}
        {selectedIds.size > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-900 dark:text-white">
                {selectedIds.size} {selectedIds.size === 1 ? 'linha selecionada' : 'linhas selecionadas'}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Soma líquida: <strong className="font-mono tabular-nums text-slate-900 dark:text-white">{formatCurrency(selectedSum)}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onBatchUpdateStatus(Array.from(selectedIds), 'liquidado')}
                className="px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded hover:bg-emerald-100 transition-colors"
              >
                Marcar como Liquidado
              </button>
              <button
                type="button"
                onClick={() => onBatchUpdateStatus(Array.from(selectedIds), 'pendente')}
                className="px-2.5 py-1 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded hover:bg-amber-100 transition-colors"
              >
                Marcar como Pendente
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Deseja eliminar ${selectedIds.size} movimentos selecionados?`)) {
                    onBatchDelete(Array.from(selectedIds));
                    setSelectedIds(new Set());
                  }
                }}
                className="px-2.5 py-1 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded hover:bg-rose-100 transition-colors"
              >
                Eliminar Selecionados
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Primary Spreadsheet Grid Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 select-none">
                {/* Checkbox */}
                <th className="py-2.5 px-3 w-8 text-center border-r border-slate-200 dark:border-slate-800">
                  <input
                    type="checkbox"
                    checked={filteredTransactions.length > 0 && selectedIds.size === filteredTransactions.length}
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                {/* Row # */}
                <th className="py-2.5 px-2.5 w-10 text-center font-mono text-[11px] text-slate-400 border-r border-slate-200 dark:border-slate-800">
                  #
                </th>
                {/* Data */}
                <th 
                  onClick={() => handleSort('data')} 
                  className="py-2.5 px-3 font-semibold w-28 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 border-r border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>Data</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                {/* Descrição */}
                <th 
                  onClick={() => handleSort('descricao')} 
                  className="py-2.5 px-3 font-semibold min-w-[220px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 border-r border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>Descrição do Movimento</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                {/* Categoria */}
                <th className="py-2.5 px-3 font-semibold w-44 border-r border-slate-200 dark:border-slate-800">
                  Categoria
                </th>
                {/* Tipo */}
                <th className="py-2.5 px-3 font-semibold w-28 text-center border-r border-slate-200 dark:border-slate-800">
                  Tipo
                </th>
                {/* Conta */}
                <th className="py-2.5 px-3 font-semibold w-36 border-r border-slate-200 dark:border-slate-800">
                  Conta / Cartão
                </th>
                {/* Valor */}
                <th 
                  onClick={() => handleSort('valor')} 
                  className="py-2.5 px-3 font-semibold w-32 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 border-r border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Valor (€)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                {/* Status */}
                <th className="py-2.5 px-3 font-semibold w-28 text-center border-r border-slate-200 dark:border-slate-800">
                  Estado
                </th>
                {/* Observações */}
                <th className="py-2.5 px-3 font-semibold min-w-[150px] border-r border-slate-200 dark:border-slate-800">
                  Observações
                </th>
                {/* Ações */}
                <th className="py-2.5 px-2.5 font-semibold w-16 text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-sans">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="max-w-sm mx-auto space-y-3">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Nenhum movimento encontrado
                      </p>
                      <p className="text-xs text-slate-500">
                        Altere os filtros acima ou adicione uma nova linha à folha para começar.
                      </p>
                      <button
                        type="button"
                        onClick={handleAddQuickRow}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Inserir Movimento
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t, idx) => {
                  const isSelected = selectedIds.has(t.id);
                  const isPendente = t.status === 'pendente';

                  return (
                    <tr
                      key={t.id}
                      className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2 px-3 text-center border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(t.id)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* Row # */}
                      <td className="py-2 px-2.5 text-center font-mono text-[11px] text-slate-400 border-r border-slate-200 dark:border-slate-800">
                        {idx + 1}
                      </td>

                      {/* Data cell (inline input) */}
                      <td className="py-1 px-2 border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="date"
                          value={t.data}
                          onChange={e => onUpdateTransaction({ ...t, data: e.target.value })}
                          className="w-full bg-transparent border-0 px-1 py-1 text-slate-800 dark:text-slate-200 font-mono text-xs focus:ring-1 focus:ring-emerald-500 rounded"
                        />
                      </td>

                      {/* Descrição cell (inline editable) */}
                      <td className="py-1 px-2 border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="text"
                          value={t.descricao}
                          onChange={e => onUpdateTransaction({ ...t, descricao: e.target.value })}
                          className="w-full bg-transparent border-0 px-1 py-1 text-slate-900 dark:text-white font-medium text-xs focus:ring-1 focus:ring-emerald-500 rounded truncate"
                        />
                      </td>

                      {/* Categoria dropdown */}
                      <td className="py-1 px-2 border-r border-slate-200 dark:border-slate-800">
                        <select
                          value={t.categoriaId}
                          onChange={e => onUpdateTransaction({ ...t, categoriaId: e.target.value })}
                          className="w-full bg-transparent border-0 px-1 py-1 text-slate-700 dark:text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 rounded truncate"
                        >
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id} className="dark:bg-slate-900">
                              {cat.nome}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Tipo selector */}
                      <td className="py-1 px-2 text-center border-r border-slate-200 dark:border-slate-800">
                        <select
                          value={t.tipo}
                          onChange={e => onUpdateTransaction({ ...t, tipo: e.target.value as TransactionType })}
                          className={`bg-transparent border-0 px-1 py-1 text-xs font-medium focus:ring-1 focus:ring-emerald-500 rounded ${
                            t.tipo === 'receita'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : t.tipo === 'despesa'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-sky-600 dark:text-sky-400'
                          }`}
                        >
                          <option value="receita" className="dark:bg-slate-900 text-emerald-600">Receita (+)</option>
                          <option value="despesa" className="dark:bg-slate-900 text-rose-600">Despesa (-)</option>
                          <option value="investimento" className="dark:bg-slate-900 text-sky-600">Poupança (•)</option>
                        </select>
                      </td>

                      {/* Conta dropdown */}
                      <td className="py-1 px-2 border-r border-slate-200 dark:border-slate-800">
                        <select
                          value={t.contaId}
                          onChange={e => onUpdateTransaction({ ...t, contaId: e.target.value })}
                          className="w-full bg-transparent border-0 px-1 py-1 text-slate-700 dark:text-slate-300 text-xs focus:ring-1 focus:ring-emerald-500 rounded truncate"
                        >
                          {accounts.map(acc => (
                            <option key={acc.id} value={acc.id} className="dark:bg-slate-900">
                              {acc.nome}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Valor (inline editable number) */}
                      <td className="py-1 px-2 text-right border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="text"
                          defaultValue={t.valor.toFixed(2).replace('.', ',')}
                          key={`${t.id}_${t.valor}`}
                          onBlur={e => {
                            const parsed = parseCurrencyInput(e.target.value);
                            onUpdateTransaction({ ...t, valor: parsed });
                          }}
                          className={`w-full text-right bg-transparent border-0 px-1 py-1 font-mono tabular-nums text-xs font-semibold focus:ring-1 focus:ring-emerald-500 rounded ${
                            t.tipo === 'receita'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : t.tipo === 'despesa'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-sky-600 dark:text-sky-400'
                          }`}
                        />
                      </td>

                      {/* Status toggle */}
                      <td className="py-1 px-2 text-center border-r border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => onUpdateTransaction({
                            ...t,
                            status: isPendente ? 'liquidado' : 'pendente'
                          })}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                            isPendente
                              ? 'text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                              : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                          }`}
                          title="Clique para alternar estado"
                        >
                          {isPendente ? (
                            <>
                              <Clock className="w-3 h-3 text-amber-500" />
                              <span>Pendente</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>Liquidado</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Observações */}
                      <td className="py-1 px-2 border-r border-slate-200 dark:border-slate-800">
                        <input
                          type="text"
                          value={t.observacoes || ''}
                          onChange={e => onUpdateTransaction({ ...t, observacoes: e.target.value })}
                          placeholder="Adicionar nota..."
                          className="w-full bg-transparent border-0 px-1 py-1 text-slate-500 dark:text-slate-400 placeholder-slate-400 text-xs focus:ring-1 focus:ring-emerald-500 rounded truncate"
                        />
                      </td>

                      {/* Actions */}
                      <td className="py-1 px-2 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleDuplicateRow(t)}
                            title="Duplicar linha"
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteTransaction(t.id)}
                            title="Eliminar linha"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Spreadsheet Total Formula Row */}
            <tfoot>
              <tr className="bg-slate-100 dark:bg-slate-800 font-semibold border-t-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
                <td className="py-3 px-3 text-center border-r border-slate-200 dark:border-slate-800">
                  ∑
                </td>
                <td className="py-3 px-2 text-center font-mono text-xs border-r border-slate-200 dark:border-slate-800 text-slate-500">
                  {totals.totalCount}
                </td>
                <td colSpan={5} className="py-3 px-3 text-xs text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <span><strong>Fórmula:</strong> =SOMA(Valores Filtrados)</span>
                    <span aria-hidden="true" className="text-slate-300">|</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                      + Receitas: {formatCurrency(totals.receitas)}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">|</span>
                    <span className="text-rose-600 dark:text-rose-400 font-mono tabular-nums">
                      - Despesas: {formatCurrency(totals.despesas)}
                    </span>
                    {totals.investimentos > 0 && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">|</span>
                        <span className="text-sky-600 dark:text-sky-400 font-mono tabular-nums">
                          • Poupança: {formatCurrency(totals.investimentos)}
                        </span>
                      </>
                    )}
                  </div>
                </td>
                {/* Total Net Value */}
                <td className={`py-3 px-3 text-right font-mono tabular-nums text-sm font-bold border-r border-slate-200 dark:border-slate-800 ${
                  totals.saldo >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {formatCurrency(totals.saldo)}
                </td>
                <td colSpan={3} className="py-3 px-3 text-xs text-slate-500 text-left">
                  <span>Saldo operacional</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
