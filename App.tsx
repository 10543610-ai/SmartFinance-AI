
import React, { useState, useEffect } from 'react';
import { User, BankAccount, Transaction, Budget, DreamAccount, TransactionType, AppView } from './types';
import { INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS, INITIAL_BUDGETS, INITIAL_DREAMS } from './constants';
import { loadFromStorage, saveToStorage } from './services/storageService';
import { auth, db, isFirebaseActive } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

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
  // Use defined AppView type for currentView state
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  // 初始化登入狀態
  useEffect(() => {
    if (!isFirebaseActive()) {
      const savedUser = loadFromStorage('user', null);
      if (savedUser) {
        setUser(savedUser);
      }
      setAuthLoading(false);
      return;
    }

    // Firebase 認證監聽
    const unsubscribe = onAuthStateChanged(auth!, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ 
          id: firebaseUser.uid, 
          email: firebaseUser.email || '', 
          name: firebaseUser.displayName || '使用者' 
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 資料同步邏輯
  useEffect(() => {
    if (!user) return;

    if (!isFirebaseActive()) {
      // 離線/展示模式：從 LocalStorage 讀取
      setAccounts(loadFromStorage('accounts', INITIAL_ACCOUNTS));
      setTransactions(loadFromStorage('transactions', INITIAL_TRANSACTIONS));
      setBudgets(loadFromStorage('budgets', INITIAL_BUDGETS));
      setDreams(loadFromStorage('dreams', INITIAL_DREAMS));
      return;
    }

    // Firebase 線上模式：從 Firestore 實時同步
    const userDocRef = doc(db!, "users", user.id);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAccounts(data.accounts || INITIAL_ACCOUNTS);
        setTransactions(data.transactions || INITIAL_TRANSACTIONS);
        setBudgets(data.budgets || INITIAL_BUDGETS);
        setDreams(data.dreams || INITIAL_DREAMS);
      } else {
        // 首次使用：初始化雲端資料庫
        setDoc(userDocRef, {
          accounts: INITIAL_ACCOUNTS,
          transactions: INITIAL_TRANSACTIONS,
          budgets: INITIAL_BUDGETS,
          dreams: INITIAL_DREAMS
        });
      }
    }, (error) => {
      console.error("Firestore 同步錯誤:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // 更新資料的統一方法
  const syncData = async (type: string, newData: any) => {
    if (user && isFirebaseActive()) {
      try {
        const userDocRef = doc(db!, "users", user.id);
        await setDoc(userDocRef, { [type]: newData }, { merge: true });
      } catch (e) {
        console.error("更新雲端資料失敗:", e);
      }
    } else {
      saveToStorage(type, newData);
      // 手動更新本地狀態，因為沒有 Firebase 的實時監聽
      if (type === 'accounts') setAccounts(newData);
      if (type === 'transactions') setTransactions(newData);
      if (type === 'budgets') setBudgets(newData);
      if (type === 'dreams') setDreams(newData);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">安全載入中...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onLogin={(u) => { setUser(u); saveToStorage('user', u); }} />;
  }

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
        return { 
          ...acc, 
          balance: t.type === 'INCOME' ? acc.balance + t.amount : acc.balance - t.amount 
        };
      }
      return acc;
    });
    
    // 更新狀態
    if (isFirebaseActive()) {
      syncData('transactions', updatedTxs);
      syncData('accounts', updatedAccs);
    } else {
      setTransactions(updatedTxs);
      setAccounts(updatedAccs);
      saveToStorage('transactions', updatedTxs);
      saveToStorage('accounts', updatedAccs);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <nav className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 z-20">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-100">$</div>
            <h1 className="text-xl font-bold text-slate-800">SmartFinance</h1>
          </div>
          <div className="flex-grow space-y-1">
            {[
              { id: 'dashboard', label: '總覽', icon: 'M4 6h16M4 12h16M4 18h16' },
              { id: 'accounts', label: '帳戶', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
              { id: 'transactions', label: '紀錄', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { id: 'budget', label: '預算', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
              { id: 'dreams', label: '夢想', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
              { id: 'reports', label: '報表', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as AppView)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  currentView === item.id 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-auto pt-6 border-t border-slate-100">
            <LuckyItemDraw />
            <div className="mt-4 flex items-center gap-3 px-2">
              <div className="flex-grow min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="登出系統"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow overflow-y-auto bg-slate-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-in fade-in duration-500">
            {currentView === 'dashboard' && <Dashboard accounts={accounts} transactions={transactions} budgets={budgets} dreams={dreams} onNavigate={setCurrentView} />}
            {currentView === 'accounts' && <AccountManager accounts={accounts} setAccounts={(v) => syncData('accounts', v)} />}
            {currentView === 'transactions' && <TransactionManager transactions={transactions} accounts={accounts} onAdd={addTransaction} onDelete={(id) => syncData('transactions', transactions.filter(t => t.id !== id))} />}
            {currentView === 'budget' && <BudgetManager budgets={budgets} setBudgets={(v) => syncData('budgets', v)} />}
            {currentView === 'dreams' && <DreamAccountManager dreams={dreams} setDreams={(v) => syncData('dreams', v)} />}
            {currentView === 'reports' && <Reports transactions={transactions} budgets={budgets} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;