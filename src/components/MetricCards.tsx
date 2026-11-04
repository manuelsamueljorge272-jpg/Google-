import React from 'react';
import { Transaction, Account } from '../types/finance';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

interface MetricCardsProps {
  transactions: Transaction[];
  accounts: Account[];
  periodLabel: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  transactions,
  accounts,
  periodLabel,
}) => {
  // Total balance across all accounts based on initial + all completed transactions in history
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.saldoInicial, 0);

  // Period totals
  const periodReceitas = transactions
    .filter(t => t.tipo === 'receita')
    .reduce((sum, t) => sum + t.valor, 0);

  const periodReceitasLiquidadas = transactions
    .filter(t => t.tipo === 'receita' && t.status === 'liquidado')
    .reduce((sum, t) => sum + t.valor, 0);

  const periodDespesas = transactions
    .filter(t => t.tipo === 'despesa')
    .reduce((sum, t) => sum + t.valor, 0);

  const periodDespesasLiquidadas = transactions
    .filter(t => t.tipo === 'despesa' && t.status === 'liquidado')
    .reduce((sum, t) => sum + t.valor, 0);

  const periodInvestimentos = transactions
    .filter(t => t.tipo === 'investimento')
    .reduce((sum, t) => sum + t.valor, 0);

  // Net balance for period
  const saldoPeriodo = periodReceitas - periodDespesas;
  
  // Savings rate = (Receitas - Despesas) / Receitas
  const taxaPoupanca = periodReceitas > 0 ? ((periodReceitas - periodDespesas) / periodReceitas) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Saldo Consolidado */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium">Saldo em Caixa & Bancos</span>
          <Wallet className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
          {formatCurrency(totalBalance)}
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>{accounts.length} contas registadas</span>
          <span aria-hidden="true">·</span>
          <span>Atualizado hoje</span>
        </div>
      </div>

      {/* Card 2: Receitas do Período */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium">Receitas ({periodLabel})</span>
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
          {formatCurrency(periodReceitas)}
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>Recebido: {formatCurrency(periodReceitasLiquidadas)}</span>
          <span aria-hidden="true">·</span>
          <span>A receber: {formatCurrency(periodReceitas - periodReceitasLiquidadas)}</span>
        </div>
      </div>

      {/* Card 3: Despesas do Período */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium">Despesas ({periodLabel})</span>
          <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 font-mono tabular-nums">
          {formatCurrency(periodDespesas)}
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>Pago: {formatCurrency(periodDespesasLiquidadas)}</span>
          <span aria-hidden="true">·</span>
          <span>A pagar: {formatCurrency(periodDespesas - periodDespesasLiquidadas)}</span>
        </div>
      </div>

      {/* Card 4: Balanço & Taxa de Poupança */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium">Resultado do Período</span>
          <PiggyBank className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className={`text-2xl font-bold tracking-tight font-mono tabular-nums ${
          saldoPeriodo >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'
        }`}>
          {formatCurrency(saldoPeriodo)}
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            {taxaPoupanca > 0 ? `${taxaPoupanca.toFixed(1)}% taxa de poupança` : '0% poupado'}
          </span>
          <span aria-hidden="true">·</span>
          <span>Poupança: {formatCurrency(periodInvestimentos)}</span>
        </div>
      </div>
    </div>
  );
};
