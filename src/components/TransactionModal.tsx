import React, { useState } from 'react';
import { Transaction, Category, Account, TransactionType, TransactionStatus } from '../types/finance';
import { parseCurrencyInput } from '../utils/formatters';
import { X } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  accounts: Account[];
  onSave: (tx: Transaction) => void;
  initialData?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  categories,
  accounts,
  onSave,
  initialData,
}) => {
  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const [tipo, setTipo] = useState<TransactionType>(initialData?.tipo || 'despesa');
  const [descricao, setDescricao] = useState(initialData?.descricao || '');
  const [valor, setValor] = useState(initialData?.valor ? initialData.valor.toString() : '');
  const [data, setData] = useState(initialData?.data || today);
  const [categoriaId, setCategoriaId] = useState(
    initialData?.categoriaId || categories.find(c => c.tipo === (initialData?.tipo || 'despesa'))?.id || categories[0]?.id || ''
  );
  const [contaId, setContaId] = useState(initialData?.contaId || accounts[0]?.id || '');
  const [status, setStatus] = useState<TransactionStatus>(initialData?.status || 'liquidado');
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || '');

  // Filter categories by selected tipo
  const relevantCategories = categories.filter(c => c.tipo === tipo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    const parsedVal = parseCurrencyInput(valor);
    if (parsedVal <= 0) return;

    const tx: Transaction = {
      id: initialData?.id || `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      data,
      descricao: descricao.trim(),
      categoriaId: categoriaId || categories[0]?.id,
      tipo,
      contaId: contaId || accounts[0]?.id,
      valor: parsedVal,
      status,
      observacoes: observacoes.trim(),
    };

    onSave(tx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {initialData ? 'Editar Lançamento' : 'Novo Lançamento'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Tipo Segmented Control */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Tipo de Movimentação
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setTipo('despesa');
                  const firstCat = categories.find(c => c.tipo === 'despesa');
                  if (firstCat) setCategoriaId(firstCat.id);
                }}
                className={`py-2 font-semibold rounded-lg transition-colors ${
                  tipo === 'despesa'
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Despesa (-)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTipo('receita');
                  const firstCat = categories.find(c => c.tipo === 'receita');
                  if (firstCat) setCategoriaId(firstCat.id);
                }}
                className={`py-2 font-semibold rounded-lg transition-colors ${
                  tipo === 'receita'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Receita (+)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTipo('investimento');
                  const firstCat = categories.find(c => c.tipo === 'investimento');
                  if (firstCat) setCategoriaId(firstCat.id);
                }}
                className={`py-2 font-semibold rounded-lg transition-colors ${
                  tipo === 'investimento'
                    ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Aporte (•)
              </button>
            </div>
          </div>

          {/* Valor and Data */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Valor (R$) *
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="0,00"
                value={valor}
                onChange={e => setValor(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-sm font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Data do Lançamento *
              </label>
              <input
                type="date"
                required
                value={data}
                onChange={e => setData(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Descrição do Lançamento *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Supermercado, Salário, Internet..."
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Categoria and Conta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Categoria
              </label>
              <select
                value={categoriaId}
                onChange={e => setCategoriaId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
              >
                {relevantCategories.map(cat => (
                  <option key={cat.id} value={cat.id} className="dark:bg-slate-900">
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Conta / Cartão
              </label>
              <select
                value={contaId}
                onChange={e => setContaId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id} className="dark:bg-slate-900">
                    {acc.nome} ({acc.tipo})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Situação do Pagamento
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
                <input
                  type="radio"
                  name="status"
                  value="liquidado"
                  checked={status === 'liquidado'}
                  onChange={() => setStatus('liquidado')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span>Liquidado (Pago / Recebido)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
                <input
                  type="radio"
                  name="status"
                  value="pendente"
                  checked={status === 'pendente'}
                  onChange={() => setStatus('pendente')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span>Pendente (A pagar / A receber)</span>
              </label>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Observações & Tags (Opcional)
            </label>
            <input
              type="text"
              placeholder="Número de nota fiscal, parcelamento 2/10, etc."
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
            >
              {initialData ? 'Atualizar Lançamento' : 'Confirmar Lançamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
