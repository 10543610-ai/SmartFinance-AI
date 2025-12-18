
import React from 'react';
import { BankAccount, Transaction, Budget, DreamAccount, TransactionType, Category, AppView } from '../types';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  budgets: Budget[];
  dreams: DreamAccount[];
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, budgets, dreams, onNavigate }) => {
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">總資產淨值</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-2">${totalBalance.toLocaleString()}</h3>
          <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            2.4% vs 上月
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">本月總收入</p>
          <h3 className="text-3xl font-bold text-emerald-600 mt-2">${monthlyIncome.toLocaleString()}</h3>
          <p className="mt-4 text-slate-400 text-sm italic">來自 ${monthlyTransactions.filter(t => t.type === TransactionType.INCOME).length} 筆入帳</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">本月總支出</p>
          <h3 className="text-3xl font-bold text-red-500 mt-2">${monthlyExpense.toLocaleString()}</h3>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-400" 
              style={{ width: `${Math.min(100, (monthlyExpense / (monthlyIncome || 1)) * 100)}%` }} 
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">支出佔收入 {(monthlyExpense / (monthlyIncome || 1) * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-800">最近收支紀錄</h4>
            <button 
              onClick={() => onNavigate('transactions')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              查看全部
            </button>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {recentTransactions.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentTransactions.map(t => (
                  <div key={t.id} className="p-4 flex items-center hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                      t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {t.type === TransactionType.INCOME 
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                        }
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-semibold text-slate-800">{t.description}</p>
                      <p className="text-xs text-slate-500">{t.category} • {t.date}</p>
                    </div>
                    <div className={`text-sm font-bold ${
                      t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'
                    }`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 italic">尚未有交易紀錄</div>
            )}
          </div>

          {/* Dream Accounts Preview */}
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-slate-800">夢想進度追蹤</h4>
              <button 
                onClick={() => onNavigate('dreams')}
                className="text-sm font-medium text-rose-500 hover:text-rose-600"
              >
                查看全部
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dreams.slice(0, 2).map(dream => {
                const progress = Math.min(100, (dream.currentAmount / dream.targetAmount) * 100);
                return (
                  <div key={dream.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{dream.icon}</span>
                      <span className="text-sm font-bold text-slate-700">{dream.title}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full mb-2">
                      <div 
                        className={`h-full ${dream.color} rounded-full transition-all duration-1000`} 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span>已存 ${dream.currentAmount.toLocaleString()}</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* My Accounts Quick View */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-800">我的帳戶</h4>
            <button 
              onClick={() => onNavigate('accounts')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              編輯
            </button>
          </div>
          <div className="space-y-4">
            {accounts.map(acc => (
              <div key={acc.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 group hover:border-indigo-100 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-8 h-8 rounded-lg ${acc.color} opacity-20`}></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{acc.bankName}</span>
                </div>
                <p className="text-sm text-slate-600 font-medium">{acc.name}</p>
                <h5 className="text-xl font-bold text-slate-800 mt-1">${acc.balance.toLocaleString()}</h5>
              </div>
            ))}
            <button 
              onClick={() => onNavigate('accounts')}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 text-sm font-medium hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新增帳戶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;