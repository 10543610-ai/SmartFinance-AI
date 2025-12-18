
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Transaction, Budget, TransactionType, Category } from '../types';
import { COLORS } from '../constants';
import { getFinancialAdvice } from '../services/geminiService';

interface ReportsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const Reports: React.FC<ReportsProps> = ({ transactions, budgets }) => {
  const [advice, setAdvice] = useState<string>('正在請 AI 專家分析您的收支現況...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      setIsLoading(true);
      const res = await getFinancialAdvice(transactions, budgets);
      setAdvice(res || "暫時無法取得建議。");
      setIsLoading(false);
    };
    fetchAdvice();
  }, []);

  const expenseData = Object.values(Category).map(cat => {
    const amount = transactions
      .filter(t => t.category === cat && t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat, value: amount };
  }).filter(d => d.value > 0);

  const budgetComparisonData = budgets.map(b => {
    const spent = transactions
      .filter(t => t.category === b.category && t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      category: b.category,
      預算: b.limit,
      已支出: spent
    };
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Category Distribution */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">收支類別分佈</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget vs Actual */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">預算 vs 實際支出</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetComparisonData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="預算" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="已支出" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Advice Section */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-32 h-32 text-indigo-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-indigo-900">AI 財務顧問建議</h3>
          </div>
          
          <div className="prose prose-indigo max-w-none text-indigo-800 leading-relaxed whitespace-pre-line">
            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                <p>正在分析數據...</p>
              </div>
            ) : advice}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
