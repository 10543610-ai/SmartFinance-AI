
import React, { useState } from 'react';
import { Budget, Category } from '../types';

interface BudgetManagerProps {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({ budgets, setBudgets }) => {
  const [editing, setEditing] = useState<Category | null>(null);
  const [val, setVal] = useState(0);

  const startEdit = (cat: Category, currentLimit: number) => {
    setEditing(cat);
    setVal(currentLimit);
  };

  const saveEdit = () => {
    if (editing) {
      const exists = budgets.find(b => b.category === editing);
      if (exists) {
        setBudgets(budgets.map(b => b.category === editing ? { ...b, limit: val } : b));
      } else {
        setBudgets([...budgets, { category: editing, limit: val }]);
      }
      setEditing(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-lg shadow-indigo-100">
        <h3 className="text-xl font-bold mb-2">每月預算分配</h3>
        <p className="text-indigo-100 opacity-90 text-sm">設定每個分類的支出上限，聰明管控您的開銷。</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-50">
        {Object.values(Category).filter(c => c !== Category.SALARY && c !== Category.INVESTMENT).map(cat => {
          const budget = budgets.find(b => b.category === cat);
          const limit = budget?.limit || 0;

          return (
            <div key={cat} className="p-6 flex items-center justify-between group">
              <div>
                <h4 className="font-bold text-slate-800">{cat}</h4>
                <p className="text-sm text-slate-500">預算上限：${limit.toLocaleString()}</p>
              </div>
              
              {editing === cat ? (
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={val}
                    onChange={e => setVal(Number(e.target.value))}
                    autoFocus
                  />
                  <button 
                    onClick={saveEdit}
                    className="bg-emerald-500 text-white p-2 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </button>
                  <button 
                    onClick={() => setEditing(null)}
                    className="bg-slate-200 text-slate-500 p-2 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => startEdit(cat, limit)}
                  className="text-indigo-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  設定
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetManager;
