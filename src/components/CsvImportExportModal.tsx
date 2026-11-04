import React, { useState } from 'react';
import { Transaction, Category, Account } from '../types/finance';
import { exportTransactionsToCsv, parseCsvToTransactions } from '../utils/formatters';
import { X, Download, Upload, RotateCcw, AlertTriangle, FileSpreadsheet } from 'lucide-react';

interface CsvImportExportModalProps {
  isOpen: boolean;
  mode: 'export' | 'import';
  onClose: () => void;
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  onImportTransactions: (imported: Partial<Transaction>[], replace: boolean) => void;
  onResetData: () => void;
}

export const CsvImportExportModal: React.FC<CsvImportExportModalProps> = ({
  isOpen,
  mode: initialMode,
  onClose,
  transactions,
  categories,
  accounts,
  onImportTransactions,
  onResetData,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'export' | 'import'>(initialMode);
  const [csvContent, setCsvContent] = useState('');
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<Partial<Transaction>[]>([]);

  // Handle CSV Download
  const handleDownloadCsv = () => {
    const csvData = exportTransactionsToCsv(transactions, categories, accounts);
    // Add UTF-8 BOM so Excel opens PT-BR accented characters without corruption
    const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `planilha_financeira_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  // Handle file selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      setCsvContent(text);
      const parsed = parseCsvToTransactions(text, categories, accounts);
      setParsedPreview(parsed);
    };
    reader.readAsText(file);
  };

  const handleTextChange = (text: string) => {
    setCsvContent(text);
    const parsed = parseCsvToTransactions(text, categories, accounts);
    setParsedPreview(parsed);
  };

  const handleConfirmImport = () => {
    if (parsedPreview.length === 0) return;
    onImportTransactions(parsedPreview, replaceExisting);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header with Switcher */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('export')}
                className={`px-3 py-1 font-medium rounded-md transition-colors ${
                  activeTab === 'export'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Exportar CSV
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('import')}
                className={`px-3 py-1 font-medium rounded-md transition-colors ${
                  activeTab === 'import'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Importar CSV
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 text-xs space-y-4">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-300">
                Exporte todos os lançamentos da planilha em formato <strong>.CSV (padrão Brasil/Excel)</strong>, compatível com Microsoft Excel, Google Planilhas, Numbers e outros softwares de contabilidade.
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total de lançamentos:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{transactions.length} linhas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Codificação:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">UTF-8 com BOM (acentos preservados)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Separador:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">Ponto e vírgula (;)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Deseja resetar a planilha para os dados iniciais de demonstração?')) {
                      onResetData();
                      onClose();
                    }
                  }}
                  className="text-rose-600 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restaurar dados de exemplo</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Arquivo CSV</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-600 dark:text-slate-300">
                Selecione um arquivo <strong>.CSV</strong> do seu computador ou cole o texto do arquivo abaixo.
              </p>

              {/* File upload input */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Selecione o arquivo CSV
                </label>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>

              {/* Paste textarea */}
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Ou cole os dados CSV diretamente:
                </label>
                <textarea
                  rows={4}
                  value={csvContent}
                  onChange={e => handleTextChange(e.target.value)}
                  placeholder="Data;Descricao;Categoria;Tipo;Conta;Valor;Status..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-[11px] text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Preview info */}
              {parsedPreview.length > 0 && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300">
                  <div className="font-semibold">
                    ✓ {parsedPreview.length} lançamentos identificados com sucesso!
                  </div>
                  <div className="text-[11px] mt-0.5 opacity-90">
                    Primeira linha: {parsedPreview[0]?.descricao} - {parsedPreview[0]?.data}
                  </div>
                </div>
              )}

              {/* Replace / Append mode */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="replaceCheck"
                  checked={replaceExisting}
                  onChange={e => setReplaceExisting(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="replaceCheck" className="text-slate-700 dark:text-slate-300 cursor-pointer">
                  Substituir todos os lançamentos existentes (limpar planilha antes de importar)
                </label>
              </div>

              {replaceExisting && (
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Atenção: todos os {transactions.length} registros atuais serão substituídos pelos importados.</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={parsedPreview.length === 0}
                  onClick={handleConfirmImport}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importar {parsedPreview.length} Lançamentos</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
