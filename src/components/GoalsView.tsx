import React, { useState } from 'react';
import { FinancialGoal } from '../types/finance';
import { formatCurrency, parseCurrencyInput, formatDateBR } from '../utils/formatters';
import { Target, Plus, CheckCircle, Trash2, Calendar, TrendingUp } from 'lucide-react';

interface GoalsViewProps {
  goals: FinancialGoal[];
  onAddGoal: (goal: FinancialGoal) => void;
  onUpdateGoal: (goal: FinancialGoal) => void;
  onDeleteGoal: (id: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCurrent, setNewCurrent] = useState('');
  const [newDate, setNewDate] = useState('2027-12-31');
  const [newCategory, setNewCategory] = useState('Patrimônio');

  // Quick deposit modal/inline
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const targetVal = parseCurrencyInput(newTarget);
    const currVal = parseCurrencyInput(newCurrent);

    const newGoal: FinancialGoal = {
      id: `goal_${Date.now()}`,
      titulo: newTitle.trim(),
      valorAlvo: targetVal,
      valorAtual: currVal,
      dataLimite: newDate,
      cor: '#10B981',
      categoria: newCategory,
    };

    onAddGoal(newGoal);
    setNewTitle('');
    setNewTarget('');
    setNewCurrent('');
    setIsAdding(false);
  };

  const handleApplyDeposit = (goal: FinancialGoal) => {
    const val = parseCurrencyInput(depositAmount);
    if (val <= 0) return;
    onUpdateGoal({
      ...goal,
      valorAtual: goal.valorAtual + val,
    });
    setDepositGoalId(null);
    setDepositAmount('');
  };

  const totalAlvo = goals.reduce((acc, g) => acc + g.valorAlvo, 0);
  const totalGuardado = goals.reduce((acc, g) => acc + g.valorAtual, 0);
  const percGeral = totalAlvo > 0 ? (totalGuardado / totalAlvo) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Total em Metas & Objetivos
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {formatCurrency(totalGuardado)}
          </div>
          <span className="text-xs text-slate-500 mt-2 block">
            {goals.length} objetivos em andamento
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
            Total Alvo a Atingir
          </span>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalAlvo)}
          </div>
          <span className="text-xs text-slate-500 mt-2 block">
            Faltam {formatCurrency(Math.max(0, totalAlvo - totalGuardado))}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
              Progresso Geral das Metas
            </span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mt-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(percGeral, 100)}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between mt-2">
            <span>{percGeral.toFixed(1)}% Realizado</span>
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="text-emerald-600 hover:underline font-semibold"
            >
              + Nova Meta
            </button>
          </div>
        </div>
      </div>

      {/* New Goal Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" />
              Criar Nova Meta Financeira
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nome do Objetivo
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Troca de Carro, Reserva 12 meses..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Valor Alvo (R$)
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 50.000,00"
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Valor Já Guardado (R$)
              </label>
              <input
                type="text"
                placeholder="Ex: 5.000,00"
                value={newCurrent}
                onChange={e => setNewCurrent(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Prazo Alvo
              </label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
            >
              Salvar Meta
            </button>
          </div>
        </form>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map(goal => {
          const perc = goal.valorAlvo > 0 ? (goal.valorAtual / goal.valorAlvo) * 100 : 0;
          const isComplete = perc >= 100;
          const faltante = Math.max(0, goal.valorAlvo - goal.valorAtual);

          return (
            <div
              key={goal.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:shadow-xs transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                      {goal.categoria}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {goal.titulo}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteGoal(goal.id)}
                    title="Excluir meta"
                    className="text-slate-400 hover:text-rose-600 p-1 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 my-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500">Acumulado</span>
                    <span className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {formatCurrency(goal.valorAtual)}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-slate-500">
                    <span>Meta Final</span>
                    <span className="font-mono tabular-nums font-medium text-slate-700 dark:text-slate-300">
                      {formatCurrency(goal.valorAlvo)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isComplete ? 'bg-emerald-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(perc, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                      {perc.toFixed(1)}% concluído
                    </span>
                    <span>
                      {isComplete ? 'Meta alcançada!' : `Falta ${formatCurrency(faltante)}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Prazo: {formatDateBR(goal.dataLimite)}</span>
                  </span>
                  {isComplete && (
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Atingido
                    </span>
                  )}
                </div>

                {depositGoalId === goal.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Valor aporte (R$)"
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                      className="w-full text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded font-mono"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyDeposit(goal)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded hover:bg-emerald-700 whitespace-nowrap"
                    >
                      Aportar
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositGoalId(null)}
                      className="text-xs text-slate-400 hover:text-slate-600 p-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setDepositGoalId(goal.id);
                      setDepositAmount('');
                    }}
                    className="w-full py-1.5 px-3 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Registrar Aporte
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
