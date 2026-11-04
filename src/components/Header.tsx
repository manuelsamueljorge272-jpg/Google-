import React from 'react';
import { ActiveTab } from '../types/finance';
import { Plus, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onNewTransaction: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onNewTransaction,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single element, no subtitle badges) */}
        <button
          onClick={() => onTabChange('planilha')}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-mono font-bold text-base shadow-sm">
            €
          </span>
          FinPlanilha
        </button>

        {/* Zone 2: 4-5 clean single-line nav tabs */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onTabChange('planilha')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'planilha'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Movimentos
          </button>
          <button
            onClick={() => onTabChange('orcamento')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'orcamento'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Orçamento
          </button>
          <button
            onClick={() => onTabChange('metas')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'metas'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Objetivos
          </button>
          <button
            onClick={() => onTabChange('relatorios')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'relatorios'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Relatórios
          </button>
          <button
            onClick={() => onTabChange('contas')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              activeTab === 'contas'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Contas & Categorias
          </button>
        </nav>

        {/* Zone 3: 1 primary action button (+ optional theme toggle) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            aria-label="Alternar tema"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onNewTransaction}
            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <Plus className="w-4 h-4" />
            Novo Movimento
          </button>
        </div>
      </div>

      {/* Mobile nav subbar if screen < 768px */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium">
        <button
          onClick={() => onTabChange('planilha')}
          className={`px-2 py-1 rounded ${activeTab === 'planilha' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Movimentos
        </button>
        <button
          onClick={() => onTabChange('orcamento')}
          className={`px-2 py-1 rounded ${activeTab === 'orcamento' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Orçamento
        </button>
        <button
          onClick={() => onTabChange('metas')}
          className={`px-2 py-1 rounded ${activeTab === 'metas' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Objetivos
        </button>
        <button
          onClick={() => onTabChange('relatorios')}
          className={`px-2 py-1 rounded ${activeTab === 'relatorios' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Relatórios
        </button>
        <button
          onClick={() => onTabChange('contas')}
          className={`px-2 py-1 rounded ${activeTab === 'contas' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Contas
        </button>
      </div>
    </header>
  );
};
