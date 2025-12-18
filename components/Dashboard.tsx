import React from 'react';
import { BankAccount, Transaction, DreamAccount, TransactionType, AppView } from '../types';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  dreams: DreamAccount[];
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, dreams, onNavigate }) => {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">總資產淨值</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-2">${totalBalance.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">本月總收入</p>
          <h3 className="text-3xl font-bold text-emerald-600 mt-2">${monthlyIncome.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">本月總支出</p>
          <h3 className="text-3xl font-bold text-red-500 mt-2">${monthlyExpense.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-800">最近收支紀錄</h4>
            <button onClick={() => onNavigate('transactions')} className="text-sm font-medium text-indigo-600">查看全部</button>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {recentTransactions.map(t => (
              <div key={t.id} className="p-4 flex items-center border-b border-slate-50 last:border-0">
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-slate-800">{t.description}</p>
                  <p className="text-xs text-slate-500">{t.category} • {t.date}</p>
                </div>
                <div className={`text-sm font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-slate-800">夢想進度</h4>
              <button onClick={() => onNavigate('dreams')} className="text-sm font-medium text-rose-500">查看全部</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dreams.slice(0, 2).map(dream => (
                <div key={dream.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <span>{dream.icon}</span>
                    <span className="text-sm font-bold text-slate-700">{dream.title}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${dream.color}`} style={{ width: `${(dream.currentAmount / dream.targetAmount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-800">帳戶概覽</h4>
          </div>
          <div className="space-y-4">
            {accounts.map(acc => (
              <div key={acc.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase">{acc.bankName}</p>
                <p className="text-sm font-medium text-slate-600">{acc.name}</p>
                <h5 className="text-xl font-bold text-slate-800">${acc.balance.toLocaleString()}</h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;