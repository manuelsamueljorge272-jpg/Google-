import React, { useState, useMemo } from 'react';
import { Category, Transaction, BudgetPlan } from '../types/finance';
import { formatCurrency, parseCurrencyInput } from '../utils/formatters';
import { AlertCircle, CheckCircle, ShieldAlert, Edit3 } from 'lucide-react';

interface BudgetViewProps {
  categories: Category[];
  transactions: Transaction[];
  budgets: BudgetPlan[];
  onUpdateBudget: (categoriaId: string, mesAno: string, valorPlanejado: number) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  categories,
  transactions,
  budgets,
  onUpdateBudget,
  selectedMonth,
  onMonthChange,
}) => {
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Default to November 2026 if selectedMonth is 'all'
  const activeMonth = selectedMonth === 'all' ? '2026-11' : selectedMonth;

  // Available expense and investment categories
  const targetCategories = useMemo(() => {
    return categories.filter(c => c.tipo === 'despesa' || c.tipo === 'investimento');
  }, [categories]);

  // Map of planned budgets for activeMonth
  const budgetMap = useMemo(() => {
    const map = new Map<string, number>();
    budgets
      .filter(b => b.mesAno === activeMonth)
      .forEach(b => map.set(b.categoriaId, b.valorPlanejado));
    return map;
  }, [budgets, activeMonth]);

  // Actual spent in activeMonth per category
  const actualSpentMap = useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter(t => t.data.startsWith(activeMonth))
      .forEach(t => {
        const current = map.get(t.categoriaId) || 0;
        map.set(t.categoriaId, current + t.valor);
      });
    return map;
  }, [transactions, activeMonth]);

  // Compute overall budget metrics
  const summary = useMemo(() => {
    let totalPlanejado = 0;
    let totalRealizado = 0;

    targetCategories.forEach(cat => {
      const planejado = budgetMap.get(cat.id) ?? cat.orcamentoPadrao ?? 0;
      const realizado = actualSpentMap.get(cat.id) ?? 0;
      totalPlanejado += planejado;
      totalRealizado += realizado;
    });

    const saldoRestante = totalPlanejado - totalRealizado;
    const percConsumido = totalPlanejado > 0 ? (totalRealizado / totalPlanejado) * 100 : 0;

    return {
      totalPlanejado,
      totalRealizado,
      saldoRestante,
      percConsumido
    };
  }, [targetCategories, budgetMap, actualSpentMap]);

  const handleStartEdit = (catId: string, currentVal: number) => {
    setEditingCatId(catId);
    setEditValue(currentVal.toString());
  };

  const handleSaveEdit = (catId: string) => {
    const parsed = parseCurrencyInput(editValue);
    onUpdateBudget(catId, activeMonth, parsed);
    setEditingCatId(null);
  };

  return (
    <div className="space-y-6">
      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Teto Total Planejado
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatCurrency(summary.totalPlanejado)}
          </div>
          <span className="text-xs text-slate-500 mt-2 block">
            Referência: {activeMonth}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Total Já Comprometido
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            {formatCurrency(summary.totalRealizado)}
          </div>
          <span className="text-xs text-slate-500 mt-2 block">
            {summary.percConsumido.toFixed(1)}% do limite planejado
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Saldo Restante para Gastar
          </span>
          <div className={`text-2xl font-bold font-mono tabular-nums ${
            summary.saldoRestante >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {formatCurrency(summary.saldoRestante)}
          </div>
          <span className="text-xs text-slate-500 mt-2 block">
            {summary.saldoRestante >= 0 ? 'Dentro do planejado' : 'Orçamento estourado'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Consumo Global do Orçamento
            </span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  summary.percConsumido > 100
                    ? 'bg-rose-500'
                    : summary.percConsumido > 85
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(summary.percConsumido, 100)}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between mt-2">
            <span>{summary.percConsumido.toFixed(0)}% Utilizado</span>
            <span>Meta: &le; 100%</span>
          </div>
        </div>
      </div>

      {/* Budget Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Planejamento por Categoria (Planejado vs. Realizado)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Clique no valor planejado para ajustar o teto da categoria para este mês.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Mês de referência:</span>
            <input
              type="month"
              value={activeMonth}
              onChange={e => onMonthChange(e.target.value)}
              className="text-xs py-1 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <th className="py-2.5 px-4 font-semibold">Categoria</th>
                <th className="py-2.5 px-4 font-semibold">Tipo</th>
                <th className="py-2.5 px-4 font-semibold text-right">Planejado (Teto)</th>
                <th className="py-2.5 px-4 font-semibold text-right">Realizado (Gasto)</th>
                <th className="py-2.5 px-4 font-semibold text-right">Saldo Restante</th>
                <th className="py-2.5 px-4 font-semibold w-48">Progresso & Consumo</th>
                <th className="py-2.5 px-4 font-semibold text-center w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {targetCategories.map(cat => {
                const planejado = budgetMap.get(cat.id) ?? cat.orcamentoPadrao ?? 0;
                const realizado = actualSpentMap.get(cat.id) ?? 0;
                const restante = planejado - realizado;
                const perc = planejado > 0 ? (realizado / planejado) * 100 : 0;
                const isOverBudget = realizado > planejado && planejado > 0;
                const isWarning = perc >= 80 && !isOverBudget;
                const isEditing = editingCatId === cat.id;

                return (
                  <tr key={cat.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.cor }} />
                      <span>{cat.nome}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 capitalize">
                      {cat.tipo}
                    </td>

                    {/* Planejado with inline edit */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveEdit(cat.id)}
                            className="w-24 text-right py-0.5 px-1 bg-white dark:bg-slate-800 border border-emerald-500 rounded text-xs font-mono"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(cat.id)}
                            className="text-xs text-emerald-600 font-bold px-1"
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat.id, planejado)}
                          className="hover:underline hover:text-emerald-600 inline-flex items-center gap-1 group"
                          title="Clique para editar teto orçamentário"
                        >
                          <span>{formatCurrency(planejado)}</span>
                          <Edit3 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}
                    </td>

                    {/* Realizado */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(realizado)}
                    </td>

                    {/* Saldo Restante */}
                    <td className={`py-3 px-4 text-right font-mono tabular-nums font-semibold ${
                      restante >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {formatCurrency(restante)}
                    </td>

                    {/* Barra de Progresso */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isOverBudget
                                ? 'bg-rose-500'
                                : isWarning
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(perc, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 font-mono tabular-nums">
                          <span>{perc.toFixed(0)}%</span>
                          <span>{restante >= 0 ? `Resta ${formatCurrency(restante)}` : `Excedeu ${formatCurrency(Math.abs(restante))}`}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status indicator */}
                    <td className="py-3 px-4 text-center">
                      {isOverBudget ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium text-[11px]">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Excedido</span>
                        </span>
                      ) : isWarning ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Atenção</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>No Limite</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
