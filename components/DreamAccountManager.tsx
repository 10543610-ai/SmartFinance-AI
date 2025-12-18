
import React, { useState } from 'react';
import { DreamAccount } from '../types';

interface DreamAccountManagerProps {
  dreams: DreamAccount[];
  setDreams: React.Dispatch<React.SetStateAction<DreamAccount[]>>;
}

const DreamAccountManager: React.FC<DreamAccountManagerProps> = ({ dreams, setDreams }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newDream, setNewDream] = useState({ title: '', targetAmount: 0, icon: '⭐' });
  const [depositAmount, setDepositAmount] = useState<{[key: string]: number}>({});

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const colors = ['bg-rose-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-amber-500', 'bg-purple-500'];
    const dream: DreamAccount = {
      ...newDream,
      id: Math.random().toString(36).substr(2, 9),
      currentAmount: 0,
      color: colors[dreams.length % colors.length]
    };
    setDreams([...dreams, dream]);
    setIsAdding(false);
    setNewDream({ title: '', targetAmount: 0, icon: '⭐' });
  };

  const deleteDream = (id: string) => {
    if (confirm('確定要放棄這個夢想嗎？')) {
      setDreams(dreams.filter(d => d.id !== id));
    }
  };

  const handleDeposit = (id: string) => {
    const amount = depositAmount[id] || 0;
    if (amount <= 0) return;
    
    setDreams(prev => prev.map(d => 
      d.id === id ? { ...d, currentAmount: d.currentAmount + amount } : d
    ));
    setDepositAmount(prev => ({ ...prev, [id]: 0 }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">夢想儲蓄清單</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-rose-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-rose-600 transition-all flex items-center gap-2 shadow-lg shadow-rose-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          新增夢想
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dreams.map(dream => {
          const progress = Math.min(100, (dream.currentAmount / dream.targetAmount) * 100);
          return (
            <div key={dream.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative group overflow-hidden">
              <button 
                onClick={() => deleteDream(dream.id)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl ${dream.color} flex items-center justify-center text-2xl shadow-inner`}>
                  {dream.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{dream.title}</h4>
                  <p className="text-xs text-slate-500">目標: ${dream.targetAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>已儲蓄 ${dream.currentAmount.toLocaleString()}</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${dream.color} transition-all duration-1000`} 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <input 
                  type="number"
                  placeholder="存入金額"
                  className="flex-grow px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  value={depositAmount[dream.id] || ''}
                  onChange={e => setDepositAmount({ ...depositAmount, [dream.id]: Number(e.target.value) })}
                />
                <button 
                  onClick={() => handleDeposit(dream.id)}
                  className={`${dream.color} text-white px-4 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all`}
                >
                  存入
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">設定新夢想</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">夢想標題</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-2 border rounded-xl"
                  value={newDream.title}
                  onChange={e => setNewDream({...newDream, title: e.target.value})}
                  placeholder="例如：馬爾地夫旅遊、買房頭期款"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">目標金額</label>
                  <input 
                    type="number" required 
                    className="w-full px-4 py-2 border rounded-xl"
                    value={newDream.targetAmount}
                    onChange={e => setNewDream({...newDream, targetAmount: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">圖示 (Emoji)</label>
                  <input 
                    type="text" required 
                    className="w-full px-4 py-2 border rounded-xl"
                    value={newDream.icon}
                    onChange={e => setNewDream({...newDream, icon: e.target.value})}
                  />
                </div>
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
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold"
                >
                  開始追夢
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DreamAccountManager;
