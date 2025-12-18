
import React, { useState } from 'react';
import { BankAccount } from '../types';

interface AccountManagerProps {
  accounts: BankAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
}

const AccountManager: React.FC<AccountManagerProps> = ({ accounts, setAccounts }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAcc, setNewAcc] = useState({ name: '', bankName: '', balance: 0 });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-amber-500'];
    const acc: BankAccount = {
      ...newAcc,
      id: Math.random().toString(36).substr(2, 9),
      color: colors[accounts.length % colors.length]
    };
    setAccounts([...accounts, acc]);
    setIsAdding(false);
    setNewAcc({ name: '', bankName: '', balance: 0 });
  };

  const deleteAccount = (id: string) => {
    if (confirm('確定要刪除此帳戶嗎？所有相關餘額將遺失。')) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          新增帳戶
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-48 relative group">
            <button 
              onClick={() => deleteAccount(acc.id)}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${acc.color}`}></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{acc.bankName}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">{acc.name}</h3>
            </div>
            <div className="text-2xl font-black text-slate-800">
              ${acc.balance.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">新增銀行帳戶</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">帳戶名稱</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-2 border rounded-xl"
                  value={newAcc.name}
                  onChange={e => setNewAcc({...newAcc, name: e.target.value})}
                  placeholder="例如：主要儲蓄、生活費帳戶"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">銀行名稱</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-2 border rounded-xl"
                  value={newAcc.bankName}
                  onChange={e => setNewAcc({...newAcc, bankName: e.target.value})}
                  placeholder="例如：國泰、中信、現金"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">初始餘額</label>
                <input 
                  type="number" required 
                  className="w-full px-4 py-2 border rounded-xl"
                  value={newAcc.balance}
                  onChange={e => setNewAcc({...newAcc, balance: Number(e.target.value)})}
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
                  確認新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManager;
