import { useState, useEffect } from 'react';
import { 
  Transaction, 
  Category, 
  Account, 
  BudgetPlan, 
  FinancialGoal, 
  ActiveTab, 
  TransactionStatus 
} from './types/finance';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_ACCOUNTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_GOALS, 
  INITIAL_BUDGETS 
} from './data/initialData';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { SpreadsheetView } from './components/SpreadsheetView';
import { BudgetView } from './components/BudgetView';
import { GoalsView } from './components/GoalsView';
import { ReportsView } from './components/ReportsView';
import { AccountsCategoriesView } from './components/AccountsCategoriesView';
import { TransactionModal } from './components/TransactionModal';
import { CsvImportExportModal } from './components/CsvImportExportModal';
import { formatMonthYear } from './utils/formatters';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('fin_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fin_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fin_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Active Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('planilha');

  // Selected Month filter ('2026-11' as current default, or 'all')
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');

  // Core Financial State with LocalStorage Persistence
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('fin_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('fin_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const saved = localStorage.getItem('fin_accounts');
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const [budgets, setBudgets] = useState<BudgetPlan[]>(() => {
    try {
      const saved = localStorage.getItem('fin_budgets');
      return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
    } catch {
      return INITIAL_BUDGETS;
    }
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    try {
      const saved = localStorage.getItem('fin_goals');
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fin_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('fin_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('fin_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('fin_goals', JSON.stringify(goals));
  }, [goals]);

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvModalMode, setCsvModalMode] = useState<'export' | 'import'>('export');

  // Handlers for Transactions
  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleUpdateTransaction = (updated: Transaction) => {
    setTransactions(prev => prev.map(t => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleBatchDelete = (ids: string[]) => {
    const idSet = new Set(ids);
    setTransactions(prev => prev.filter(t => !idSet.has(t.id)));
  };

  const handleBatchUpdateStatus = (ids: string[], status: TransactionStatus) => {
    const idSet = new Set(ids);
    setTransactions(prev =>
      prev.map(t => (idSet.has(t.id) ? { ...t, status } : t))
    );
  };

  // Handlers for Budget
  const handleUpdateBudget = (categoriaId: string, mesAno: string, valorPlanejado: number) => {
    setBudgets(prev => {
      const existingIdx = prev.findIndex(b => b.categoriaId === categoriaId && b.mesAno === mesAno);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { categoriaId, mesAno, valorPlanejado };
        return copy;
      }
      return [...prev, { categoriaId, mesAno, valorPlanejado }];
    });
  };

  // Handlers for Goals
  const handleAddGoal = (goal: FinancialGoal) => {
    setGoals(prev => [...prev, goal]);
  };

  const handleUpdateGoal = (updated: FinancialGoal) => {
    setGoals(prev => prev.map(g => (g.id === updated.id ? updated : g)));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Handlers for Accounts & Categories
  const handleAddAccount = (acc: Account) => {
    setAccounts(prev => [...prev, acc]);
  };

  const handleUpdateAccount = (acc: Account) => {
    setAccounts(prev => prev.map(a => (a.id === acc.id ? acc : a)));
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const handleAddCategory = (cat: Category) => {
    setCategories(prev => [...prev, cat]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // CSV Import
  const handleImportTransactions = (imported: Partial<Transaction>[], replace: boolean) => {
    const valid: Transaction[] = imported.map((item, i) => ({
      id: item.id || `tx_imp_${Date.now()}_${i}`,
      data: item.data || new Date().toISOString().split('T')[0],
      descricao: item.descricao || 'Lançamento importado',
      categoriaId: item.categoriaId || categories[0]?.id || 'cat_outros',
      tipo: item.tipo || 'despesa',
      contaId: item.contaId || accounts[0]?.id || 'acc_nubank',
      valor: item.valor || 0,
      status: item.status || 'liquidado',
      observacoes: item.observacoes || '',
    }));

    if (replace) {
      setTransactions(valid);
    } else {
      setTransactions(prev => [...valid, ...prev]);
    }
  };

  // Reset to initial demo data
  const handleResetData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setCategories(INITIAL_CATEGORIES);
    setAccounts(INITIAL_ACCOUNTS);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
    localStorage.removeItem('fin_transactions');
    localStorage.removeItem('fin_categories');
    localStorage.removeItem('fin_accounts');
    localStorage.removeItem('fin_budgets');
    localStorage.removeItem('fin_goals');
  };

  // Period label for metric cards
  const periodLabel = selectedMonth === 'all' ? 'Consolidado' : formatMonthYear(selectedMonth);

  // Filter transactions for metric cards according to selected month
  const currentPeriodTransactions = selectedMonth === 'all'
    ? transactions
    : transactions.filter(t => t.data.startsWith(selectedMonth));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Contract (3 zones) */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewTransaction={() => {
          setEditingTx(null);
          setIsTxModalOpen(true);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Metric Cards Summary */}
        <MetricCards
          transactions={currentPeriodTransactions}
          accounts={accounts}
          periodLabel={periodLabel}
        />

        {/* Tab Subviews */}
        {activeTab === 'planilha' && (
          <SpreadsheetView
            transactions={transactions}
            categories={categories}
            accounts={accounts}
            onUpdateTransaction={handleUpdateTransaction}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onBatchDelete={handleBatchDelete}
            onBatchUpdateStatus={handleBatchUpdateStatus}
            onOpenExportModal={() => {
              setCsvModalMode('export');
              setIsCsvModalOpen(true);
            }}
            onOpenImportModal={() => {
              setCsvModalMode('import');
              setIsCsvModalOpen(true);
            }}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        )}

        {activeTab === 'orcamento' && (
          <BudgetView
            categories={categories}
            transactions={transactions}
            budgets={budgets}
            onUpdateBudget={handleUpdateBudget}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        )}

        {activeTab === 'metas' && (
          <GoalsView
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activeTab === 'relatorios' && (
          <ReportsView
            transactions={transactions}
            categories={categories}
            accounts={accounts}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        )}

        {activeTab === 'contas' && (
          <AccountsCategoriesView
            accounts={accounts}
            categories={categories}
            onAddAccount={handleAddAccount}
            onUpdateAccount={handleUpdateAccount}
            onDeleteAccount={handleDeleteAccount}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}
      </main>

      {/* Clean quiet footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Planilha de Controle Financeiro</span>
            <span aria-hidden="true">·</span>
            <span>Fluxo de Caixa, Orçamento e Metas</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleResetData}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Restaurar dados iniciais
            </button>
            <span aria-hidden="true">·</span>
            <span>Exportação compatível com Excel e Google Planilhas</span>
          </div>
        </div>
      </footer>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTx(null);
        }}
        categories={categories}
        accounts={accounts}
        onSave={tx => {
          if (editingTx) {
            handleUpdateTransaction(tx);
          } else {
            handleAddTransaction(tx);
          }
        }}
        initialData={editingTx}
      />

      {/* CSV Import / Export Modal */}
      <CsvImportExportModal
        isOpen={isCsvModalOpen}
        mode={csvModalMode}
        onClose={() => setIsCsvModalOpen(false)}
        transactions={transactions}
        categories={categories}
        accounts={accounts}
        onImportTransactions={handleImportTransactions}
        onResetData={handleResetData}
      />
    </div>
  );
}
