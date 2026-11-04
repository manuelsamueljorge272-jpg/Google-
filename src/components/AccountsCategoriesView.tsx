import React, { useState } from 'react';
import { Account, Category, TransactionType } from '../types/finance';
import { formatCurrency, parseCurrencyInput } from '../utils/formatters';
import { Landmark, CreditCard, Wallet, Plus, Trash2, Edit2, Check } from 'lucide-react';

interface AccountsCategoriesViewProps {
  accounts: Account[];
  categories: Category[];
  onAddAccount: (acc: Account) => void;
  onUpdateAccount: (acc: Account) => void;
  onDeleteAccount: (id: string) => void;
  onAddCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
}

export const AccountsCategoriesView: React.FC<AccountsCategoriesViewProps> = ({
  accounts,
  categories,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  onAddCategory,
  onDeleteCategory,
}) => {
  // New account state
  const [isAddingAcc, setIsAddingAcc] = useState(false);
  const [accName, setAccName] = useState('');
  const [accInstitution, setAccInstitution] = useState('');
  const [accType, setAccType] = useState<Account['tipo']>('corrente');
  const [accInitialBalance, setAccInitialBalance] = useState('');

  // Edit account balance state
  const [editingAccId, setEditingAccId] = useState<string | null>(null);
  const [editBalanceVal, setEditBalanceVal] = useState('');

  // New category state
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState<TransactionType>('despesa');
  const [catColor, setCatColor] = useState('#3B82F6');

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accName.trim()) return;

    const initial = parseCurrencyInput(accInitialBalance);
    const newAcc: Account = {
      id: `acc_${Date.now()}`,
      nome: accName.trim(),
      instituicao: accInstitution.trim() || accName.trim(),
      tipo: accType,
      saldoInicial: initial,
      cor: '#3B82F6',
    };

    onAddAccount(newAcc);
    setAccName('');
    setAccInstitution('');
    setAccInitialBalance('');
    setIsAddingAcc(false);
  };

  const handleSaveAccountBalance = (acc: Account) => {
    const parsed = parseCurrencyInput(editBalanceVal);
    onUpdateAccount({
      ...acc,
      saldoInicial: parsed,
    });
    setEditingAccId(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const newCat: Category = {
      id: `cat_${Date.now()}`,
      nome: catName.trim(),
      tipo: catType,
      cor: catColor,
      orcamentoPadrao: catType === 'despesa' ? 500 : 0,
    };

    onAddCategory(newCat);
    setCatName('');
    setIsAddingCat(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Contas Bancárias & Cartões */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Contas & Cartões Registados
            </h3>
            <p className="text-xs text-slate-500">
              Instituições financeiras e saldo inicial
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingAcc(!isAddingAcc)}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Conta
          </button>
        </div>

        {isAddingAcc && (
          <form
            onSubmit={handleCreateAccount}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nome da Conta
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: CGD Ordem, Millennium, ActivoBank..."
                  value={accName}
                  onChange={e => setAccName(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Instituição
                </label>
                <input
                  type="text"
                  placeholder="Ex: Caixa Geral de Depósitos"
                  value={accInstitution}
                  onChange={e => setAccInstitution(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Conta
                </label>
                <select
                  value={accType}
                  onChange={e => setAccType(e.target.value as any)}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="ordem">Conta à Ordem</option>
                  <option value="poupanca">Conta Poupança / Prazo</option>
                  <option value="investimento">Conta Investimento / Corretora</option>
                  <option value="cartao">Cartão de Crédito</option>
                  <option value="carteira">Numerário / Carteira</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Saldo Inicial (€)
                </label>
                <input
                  type="text"
                  placeholder="0,00"
                  value={accInitialBalance}
                  onChange={e => setAccInitialBalance(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingAcc(false)}
                className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 text-xs font-semibold text-white bg-emerald-600 rounded hover:bg-emerald-700"
              >
                Adicionar Conta
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {accounts.map(acc => {
            const isEditing = editingAccId === acc.id;

            return (
              <div
                key={acc.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    {acc.tipo === 'cartao' ? (
                      <CreditCard className="w-5 h-5" />
                    ) : acc.tipo === 'carteira' ? (
                      <Wallet className="w-5 h-5" />
                    ) : (
                      <Landmark className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {acc.nome}
                    </h4>
                    <span className="text-xs text-slate-500 capitalize">
                      {acc.instituicao} · {acc.tipo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editBalanceVal}
                        onChange={e => setEditBalanceVal(e.target.value)}
                        className="w-24 text-right py-1 px-1.5 bg-slate-50 dark:bg-slate-800 border border-emerald-500 rounded text-xs font-mono"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveAccountBalance(acc)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                        {formatCurrency(acc.saldoInicial)}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAccId(acc.id);
                          setEditBalanceVal(acc.saldoInicial.toString());
                        }}
                        className="text-[11px] text-slate-400 hover:text-emerald-600 inline-flex items-center gap-0.5"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Ajustar Saldo</span>
                      </button>
                    </div>
                  )}

                  {accounts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteAccount(acc.id)}
                      title="Eliminar conta"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categorias */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Categorias de Movimento
            </h3>
            <p className="text-xs text-slate-500">
              Classificação para receitas, despesas e investimentos
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingCat(!isAddingCat)}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Categoria
          </button>
        </div>

        {isAddingCat && (
          <form
            onSubmit={handleCreateCategory}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3"
          >
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Subscrições, Oficinas..."
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tipo
                </label>
                <select
                  value={catType}
                  onChange={e => setCatType(e.target.value as any)}
                  className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="despesa">Despesa</option>
                  <option value="receita">Receita</option>
                  <option value="investimento">Investimento</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingCat(false)}
                className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 text-xs font-semibold text-white bg-emerald-600 rounded hover:bg-emerald-700"
              >
                Guardar Categoria
              </button>
            </div>
          </form>
        )}

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.cor }} />
                <span className="font-medium text-slate-900 dark:text-white">{cat.nome}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className={`capitalize text-[11px] font-medium px-2 py-0.5 rounded ${
                  cat.tipo === 'receita'
                    ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : cat.tipo === 'despesa'
                    ? 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400'
                    : 'text-sky-700 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400'
                }`}>
                  {cat.tipo}
                </span>

                {categories.length > 3 && (
                  <button
                    type="button"
                    onClick={() => onDeleteCategory(cat.id)}
                    title="Eliminar categoria"
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
