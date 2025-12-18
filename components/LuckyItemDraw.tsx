
import React, { useState, useEffect } from 'react';
import { LUCKY_ITEMS, LUCKY_COLORS } from '../constants';

const LuckyItemDraw: React.FC = () => {
  const [lucky, setLucky] = useState<{ item: string, color: string } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const draw = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const item = LUCKY_ITEMS[Math.floor(Math.random() * LUCKY_ITEMS.length)];
      const color = LUCKY_COLORS[Math.floor(Math.random() * LUCKY_COLORS.length)];
      setLucky({ item, color });
      setIsSpinning(false);
    }, 800);
  };

  useEffect(() => {
    // Check if drawn today (simulated)
    const today = new Date().toDateString();
    const lastDraw = localStorage.getItem('last_draw_date');
    const savedLucky = localStorage.getItem('last_lucky');
    
    if (lastDraw === today && savedLucky) {
      setLucky(JSON.parse(savedLucky));
    }
  }, []);

  useEffect(() => {
    if (lucky) {
      localStorage.setItem('last_draw_date', new Date().toDateString());
      localStorage.setItem('last_lucky', JSON.stringify(lucky));
    }
  }, [lucky]);

  return (
    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">✨</span>
        <h4 className="text-sm font-bold text-amber-900">今日幸運小物</h4>
      </div>
      
      {lucky ? (
        <div className="text-center animate-in fade-in zoom-in-95 duration-500">
          <p className="text-xs text-amber-700 mb-1">今日建議搭配</p>
          <p className="text-lg font-black text-amber-900 leading-tight">
            {lucky.color} 的 {lucky.item}
          </p>
          <button 
            onClick={draw}
            className="mt-3 text-[10px] text-amber-600 font-bold hover:underline"
          >
            不滿意？重新抽取
          </button>
        </div>
      ) : (
        <button 
          onClick={draw}
          disabled={isSpinning}
          className="w-full py-3 bg-amber-200 hover:bg-amber-300 text-amber-800 rounded-xl text-sm font-bold transition-all shadow-sm shadow-amber-100"
        >
          {isSpinning ? '正在開運中...' : '看看今日好運物'}
        </button>
      )}
    </div>
  );
};

export default LuckyItemDraw;
