
import { Category, TransactionType, BankAccount, Transaction, Budget, DreamAccount } from './types';

export const INITIAL_ACCOUNTS: BankAccount[] = [
  { id: '1', name: '主要帳戶', bankName: '國泰世華', balance: 50000, color: 'bg-emerald-500' },
  { id: '2', name: '數位帳戶', bankName: '台新 Richart', balance: 12000, color: 'bg-blue-500' },
  { id: '3', name: '日常錢包', bankName: '現金', balance: 3500, color: 'bg-amber-500' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', accountId: '1', amount: 45000, type: TransactionType.INCOME, category: Category.SALARY, description: '12月薪資', date: '2023-12-05' },
  { id: 't2', accountId: '1', amount: 120, type: TransactionType.EXPENSE, category: Category.FOOD, description: '午餐', date: '2023-12-06' },
  { id: 't3', accountId: '3', amount: 50, type: TransactionType.EXPENSE, category: Category.TRANSPORT, description: '捷運', date: '2023-12-06' },
  { id: 't4', accountId: '2', amount: 2000, type: TransactionType.EXPENSE, category: Category.SHOPPING, description: '聖誕禮物', date: '2023-12-07' },
];

export const INITIAL_BUDGETS: Budget[] = [
  { category: Category.FOOD, limit: 12000 },
  { category: Category.TRANSPORT, limit: 3000 },
  { category: Category.ENTERTAINMENT, limit: 5000 },
];

export const INITIAL_DREAMS: DreamAccount[] = [
  { id: 'd1', title: '日本京都之旅', targetAmount: 60000, currentAmount: 15000, icon: '✈️', color: 'bg-rose-500' },
  { id: 'd2', title: '聖誕大餐', targetAmount: 5000, currentAmount: 2400, icon: '🎄', color: 'bg-emerald-600' },
  { id: 'd3', title: '更換新款手機', targetAmount: 35000, currentAmount: 8000, icon: '📱', color: 'bg-indigo-500' },
];

export const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export const LUCKY_ITEMS = [
  '原子筆', 
  '悠遊卡', 
  '硬幣', 
  '鑰匙圈', 
  '手搖飲杯', 
  '衛生紙', 
  '手機殼', 
  '髮圈', 
  '水壺', 
  '便利貼', 
  '護唇膏', 
  '口罩', 
  '環保袋', 
  '充電線', 
  '指甲剪', 
  '耳機', 
  '眼鏡布', 
  '筆記本'
];

export const LUCKY_COLORS = ['寶石藍', '活力橙', '幸運紅', '清新綠', '暖心黃', '神秘紫', '簡約灰', '純淨白'];
