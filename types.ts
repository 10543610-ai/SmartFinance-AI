
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum Category {
  FOOD = '飲食',
  TRANSPORT = '交通',
  HOUSING = '住屋',
  ENTERTAINMENT = '娛樂',
  SHOPPING = '購物',
  SALARY = '薪資',
  INVESTMENT = '投資',
  OTHER = '其他'
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  balance: number;
  color: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
  date: string;
}

export interface Budget {
  category: Category;
  limit: number;
}

export interface DreamAccount {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AppState {
  user: User | null;
  accounts: BankAccount[];
  transactions: Transaction[];
  budgets: Budget[];
  dreams: DreamAccount[];
  categories: Category[];
}
