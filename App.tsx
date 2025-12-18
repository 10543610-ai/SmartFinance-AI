
import React, { useState, useEffect } from 'react';
import { User, BankAccount, Transaction, Budget, DreamAccount, TransactionType } from './types';
import { INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS, INITIAL_BUDGETS, INITIAL_DREAMS } from './constants';
import { loadFromStorage, saveToStorage } from './services/storageService';
import { auth, db, isFirebaseActive } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import AccountManager from './components/AccountManager';
import TransactionManager from './components/TransactionManager';
import BudgetManager from './components/BudgetManager';
import DreamAccountManager from './components/DreamAccountManager';
import Reports from './components/Reports';
import LuckyItemDraw from './components/LuckyItemDraw';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [dreams, setDreams] = useState<DreamAccount[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'accounts' | 'transactions' | 'budget' | 'dreams' | 'reports'>('dashboard');

  // 初始化登入狀態
  useEffect(() => {
    if (!isFirebaseActive()) {
      const savedUser = loadFromStorage('user', null);
      if (savedUser) setUser(savedUser);
      setAuthLoading(false);
      return;
    }

    return onAuthStateChanged(auth!, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ id: firebaseUser.uid, email: firebaseUser.email!, name: firebaseUser.displayName || '使用者' });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
  }, []);

  // 資料同步 (Firebase 或 LocalStorage)
  useEffect(() => {
    if (!user) return;

    if (!isFirebaseActive()) {
      setAccounts(loadFromStorage('accounts', INITIAL_ACCOUNTS));
      setTransactions(loadFromStorage('transactions', INITIAL_TRANSACTIONS));
      setBudgets(loadFromStorage('budgets', INITIAL_BUDGETS));
      setDreams(loadFromStorage('dreams', INITIAL_DREAMS));
      return;
    }

    // Firestore 實時監聽
    const userDocRef = doc(db!, "users", user.id);
    return onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAccounts(data.accounts || INITIAL_ACCOUNTS);
        setTransactions(data.transactions || INITIAL_TRANSACTIONS);
        setBudgets(data.budgets || INITIAL_BUDGETS);
        setDreams(data.dreams || INITIAL_DREAMS);
      } else {
        // 第一次登入，初始化資料
        setDoc(userDocRef, {
          accounts: INITIAL_ACCOUNTS,
          transactions: INITIAL_TRANSACTIONS,
          budgets: INITIAL_BUDGETS,
          dreams: INITIAL_DREAMS
        });
      }
    });
  }, [user]);

  // 更新 Firestore
  const syncToCloud = async (newData: any) => {
    if (user && isFirebaseActive()) {
      const userDocRef = doc(db!, "users", user.id);
      await setDoc(userDocRef, newData, { merge: true });
    } else {
      Object.entries(newData).forEach(([key, val]) => saveToStorage(key, val));
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">載入中...</div>;
  if (!user) return <AuthForm onLogin={(u) => { setUser(u); saveToStorage('user', u); }} />;

  const handleLogout = async () => {
    if (isFirebaseActive()) await signOut(auth!);
    setUser(null);
    saveToStorage('user', null);
  };

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTx = { ...t, id: Date.now().toString() };
    const updatedTxs = [newTx, ...transactions];
    const updatedAccs = accounts.map(acc => {
      if (acc.id === t.accountId) {
        return { ...acc, balance: t.type === 'INCOME' ? acc.balance + t.amount : acc.balance - t.amount };
      }
      return acc;
    });
    setTransactions(updatedTxs);
    setAccounts(updatedAccs);
    syncToCloud({ transactions: updatedTxs, accounts: updatedAccs });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <nav className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">$</div>
            <h1 className="text-xl font-bold text-slate-800">SmartFinance</h1>
          </div>
          <div className="flex-grow space-y-2">
            {['dashboard', 'accounts', 'transactions', 'budget', 'dreams', 'reports'].map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view as any)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${currentView === view ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {view === 'dashboard' ? '總覽' : view === 'accounts' ? '帳戶' : view === 'transactions' ? '紀錄' : view === 'budget' ? '預算' : view === 'dreams' ? '夢想' : '報表'}
              </button>
            ))}
          </div>
          <div className="mt-auto pt-6 border-t">
            <LuckyItemDraw />
            <div className="mt-4 text-xs font-bold text-slate-400 mb-2 truncate">{user.email}</div>
            <button onClick={handleLogout} className="w-full py-2 text-sm text-red-500 font-bold hover:bg-red-50 rounded-lg">登出系統</button>
          </div>
        </div>
      </nav>
      <main className="flex-grow overflow-y-auto bg-slate-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {currentView === 'dashboard' && <Dashboard accounts={accounts} transactions={transactions} budgets={budgets} dreams={dreams} onNavigate={setCurrentView} />}
          {currentView === 'accounts' && <AccountManager accounts={accounts} setAccounts={(v) => { setAccounts(v as any); syncToCloud({ accounts: v }); }} />}
          {currentView === 'transactions' && <TransactionManager transactions={transactions} accounts={accounts} onAdd={addTransaction} onDelete={(id) => { const updated = transactions.filter(t => t.id !== id); setTransactions(updated); syncToCloud({ transactions: updated }); }} />}
          {currentView === 'budget' && <BudgetManager budgets={budgets} setBudgets={(v) => { setBudgets(v as any); syncToCloud({ budgets: v }); }} />}
          {currentView === 'dreams' && <DreamAccountManager dreams={dreams} setDreams={(v) => { setDreams(v as any); syncToCloud({ dreams: v }); }} />}
          {currentView === 'reports' && <Reports transactions={transactions} budgets={budgets} />}
        </div>
      </main>
    </div>
  );
};

export default App;
