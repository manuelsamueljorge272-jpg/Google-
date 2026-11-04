import React, { useMemo } from 'react';
import { Transaction, Category, Account } from '../types/finance';
import { formatCurrency, formatMonthYear } from '../utils/formatters';

interface ReportsViewProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  transactions,
  categories,
  accounts,
  selectedMonth,
  onMonthChange,
}) => {
  const activeMonth = selectedMonth === 'all' ? '2026-11' : selectedMonth;
  const catMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);
  const accMap = useMemo(() => new Map(accounts.map(a => [a.id, a])), [accounts]);

  // Breakdown for selected month
  const monthTransactions = useMemo(() => {
    return transactions.filter(t => t.data.startsWith(activeMonth));
  }, [transactions, activeMonth]);

  // Expenses by Category
  const expensesByCategory = useMemo(() => {
    const map = new Map<string, number>();
    let totalExpense = 0;

    monthTransactions
      .filter(t => t.tipo === 'despesa')
      .forEach(t => {
        const cur = map.get(t.categoriaId) || 0;
        map.set(t.categoriaId, cur + t.valor);
        totalExpense += t.valor;
      });

    const list = Array.from(map.entries()).map(([catId, amount]) => ({
      catId,
      name: catMap.get(catId)?.nome || 'Outros',
      color: catMap.get(catId)?.cor || '#94A3B8',
      amount,
      percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
    }));

    return list.sort((a, b) => b.amount - a.amount);
  }, [monthTransactions, catMap]);

  // Income by Category
  const incomeByCategory = useMemo(() => {
    const map = new Map<string, number>();
    let totalIncome = 0;

    monthTransactions
      .filter(t => t.tipo === 'receita')
      .forEach(t => {
        const cur = map.get(t.categoriaId) || 0;
        map.set(t.categoriaId, cur + t.valor);
        totalIncome += t.valor;
      });

    const list = Array.from(map.entries()).map(([catId, amount]) => ({
      catId,
      name: catMap.get(catId)?.nome || 'Outros',
      color: catMap.get(catId)?.cor || '#10B981',
      amount,
      percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0,
    }));

    return list.sort((a, b) => b.amount - a.amount);
  }, [monthTransactions, catMap]);

  // Monthly Evolution Comparison (e.g. October vs November 2026)
  const monthlyComparison = useMemo(() => {
    const months = ['2026-10', '2026-11'];
    return months.map(m => {
      let rec = 0;
      let desp = 0;
      let inv = 0;

      transactions
        .filter(t => t.data.startsWith(m))
        .forEach(t => {
          if (t.tipo === 'receita') rec += t.valor;
          else if (t.tipo === 'despesa') desp += t.valor;
          else if (t.tipo === 'investimento') inv += t.valor;
        });

      return {
        month: m,
        receitas: rec,
        despesas: desp,
        investimentos: inv,
        saldo: rec - desp,
      };
    });
  }, [transactions]);

  // Simplified Financial Statement (DRE) for the active month
  const totalReceitas = monthTransactions
    .filter(t => t.tipo === 'receita')
    .reduce((s, t) => s + t.valor, 0);

  const totalDespesas = monthTransactions
    .filter(t => t.tipo === 'despesa')
    .reduce((s, t) => s + t.valor, 0);

  const totalInvestimentos = monthTransactions
    .filter(t => t.tipo === 'investimento')
    .reduce((s, t) => s + t.valor, 0);

  const resultadoOperacional = totalReceitas - totalDespesas;
  const saldoFinalCaixa = resultadoOperacional - totalInvestimentos;

  return (
    <div className="space-y-6">
      {/* Month picker header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Relatórios Financeiros & Análise de Resultados
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Período selecionado: {formatMonthYear(activeMonth)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Mês de Análise:
          </label>
          <input
            type="month"
            value={activeMonth}
            onChange={e => onMonthChange(e.target.value)}
            className="text-xs py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-mono"
          />
        </div>
      </div>

      {/* Evolution comparison bars */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
          Comparativo Mensal (Entradas vs. Saídas vs. Saldo)
        </h4>

        <div className="space-y-6">
          {monthlyComparison.map(mc => {
            const maxVal = Math.max(mc.receitas, mc.despesas, 1);
            return (
              <div key={mc.month} className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatMonthYear(mc.month)}
                  </span>
                  <div className="flex items-center gap-3 font-mono tabular-nums text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Entradas: {formatCurrency(mc.receitas)}
                    </span>
                    <span className="text-rose-600 dark:text-rose-400">
                      Saídas: {formatCurrency(mc.despesas)}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Líquido: {formatCurrency(mc.saldo)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 h-5 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden p-0.5">
                  <div className="flex justify-end">
                    <div
                      className="h-full bg-emerald-500 rounded-sm transition-all"
                      style={{ width: `${(mc.receitas / maxVal) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-start">
                    <div
                      className="h-full bg-rose-500 rounded-sm transition-all"
                      style={{ width: `${(mc.despesas / maxVal) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-column category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Despesas por Categoria
            </h4>
            <span className="text-xs font-mono tabular-nums font-bold text-rose-600 dark:text-rose-400">
              Total: {formatCurrency(totalDespesas)}
            </span>
          </div>

          {expensesByCategory.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">Nenhuma despesa registada neste mês.</p>
          ) : (
            <div className="space-y-3">
              {expensesByCategory.map(item => (
                <div key={item.catId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="text-slate-500">{item.percentage.toFixed(1)}%</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.amount)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Income by Category */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Fontes de Receita
            </h4>
            <span className="text-xs font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
              Total: {formatCurrency(totalReceitas)}
            </span>
          </div>

          {incomeByCategory.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">Nenhuma receita registada neste mês.</p>
          ) : (
            <div className="space-y-3">
              {incomeByCategory.map(item => (
                <div key={item.catId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-800 dark:text-slate-200 font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="text-slate-500">{item.percentage.toFixed(1)}%</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.amount)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DRE Simplificado Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            Demonstração Financeira do Mês (Resumo Operacional)
          </h4>
          <p className="text-xs text-slate-500">
            Resumo de receitas, despesas e poupança retida.
          </p>
        </div>

        <table className="w-full text-xs text-left border-collapse">
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                (+) Receita Bruta Total
              </td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalReceitas)}
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 pl-8">
                (-) Despesas Totais do Período
              </td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums font-medium text-rose-600 dark:text-rose-400">
                - {formatCurrency(totalDespesas)}
              </td>
            </tr>
            <tr className="bg-slate-50 dark:bg-slate-800/60 font-semibold">
              <td className="py-2.5 px-4 text-slate-900 dark:text-white">
                (=) Resultado Operacional Líquido
              </td>
              <td className={`py-2.5 px-4 text-right font-mono tabular-nums font-bold ${
                resultadoOperacional >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {formatCurrency(resultadoOperacional)}
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 pl-8">
                (-) Poupança & Investimentos Realizados
              </td>
              <td className="py-2.5 px-4 text-right font-mono tabular-nums font-medium text-sky-600 dark:text-sky-400">
                - {formatCurrency(totalInvestimentos)}
              </td>
            </tr>
            <tr className="bg-slate-100 dark:bg-slate-800 font-bold border-t-2 border-slate-200 dark:border-slate-700">
              <td className="py-3 px-4 text-slate-900 dark:text-white">
                (=) Saldo Final Livre em Caixa / Contas
              </td>
              <td className={`py-3 px-4 text-right font-mono tabular-nums text-sm ${
                saldoFinalCaixa >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {formatCurrency(saldoFinalCaixa)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
