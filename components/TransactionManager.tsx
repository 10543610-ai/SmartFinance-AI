
import React, { useState } from 'react';
import { Transaction, BankAccount, Category, TransactionType } from '../types';

interface TransactionManagerProps {
  transactions: Transaction[];
  accounts: BankAccount[];
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({ transactions, accounts, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    accountId: accounts[0]?.id || '',
    amount: 0,
    type: TransactionType.EXPENSE,
    category: Category.FOOD,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.amount <= 0) return alert('金額必須大於 0');
    onAdd(form);
    setIsAdding(false);
    setForm({ ...form, amount: 0, description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">所有收支明細</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          新增紀錄
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">日期</th>
                <th className="px-6 py-4">帳戶</th>
                <th className="px-6 py-4">分類</th>
                <th className="px-6 py-4">說明</th>
                <th className="px-6 py-4 text-right">金額</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map(t => {
                const acc = accounts.find(a => a.id === t.accountId);
                return (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{t.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-800 font-medium">{acc?.name || '未知帳戶'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-xs">{t.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{t.description}</td>
                    <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onDelete(t.id)}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="p-20 text-center text-slate-400 italic">尚未有交易紀錄</div>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">新增交易紀錄</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">類型</label>
                  <select 
                    className="w-full px-4 py-2 border rounded-xl"
                    value={form.type}
                    onChange={e => setForm({...form, type: e.target.value as TransactionType})}
                  >
                    <option value={TransactionType.EXPENSE}>支出</option>
                    <option value={TransactionType.INCOME}>收入</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">帳戶</label>
                  <select 
                    className="w-full px-4 py-2 border rounded-xl"
                    value={form.accountId}
                    onChange={e => setForm({...form, accountId: e.target.value})}
                  >
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">分類</label>
                  <select 
                    className="w-full px-4 py-2 border rounded-xl"
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value as Category})}
                  >
                    {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">金額</label>
                  <input 
                    type="number" required 
                    className="w-full px-4 py-2 border rounded-xl"
                    value={form.amount}
                    onChange={e => setForm({...form, amount: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">說明</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-2 border rounded-xl"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  placeholder="買了什麼？"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">日期</label>
                <input 
                  type="date" required 
                  className="w-full px-4 py-2 border rounded-xl"
                  value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 text-slate-500 font-medium"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  確認儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManager;
