
import React, { useState } from 'react';
import { User } from '../types';
import { auth, isFirebaseActive } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface AuthFormProps {
  onLogin: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isFirebaseActive()) {
      // 展示模式下的模擬登入
      onLogin({ id: 'demo-user', email, name: name || '展示使用者' });
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await signInWithEmailAndPassword(auth!, email, password);
        onLogin({ id: res.user.uid, email: res.user.email!, name: res.user.displayName || '使用者' });
      } else {
        const res = await createUserWithEmailAndPassword(auth!, email, password);
        await updateProfile(res.user, { displayName: name });
        onLogin({ id: res.user.uid, email: res.user.email!, name: name });
      }
    } catch (err: any) {
      setError(err.message || '認證失敗，請檢查輸入資訊');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg shadow-indigo-200">
            $
          </div>
          <h2 className="text-2xl font-bold text-slate-800">SmartFinance AI</h2>
          {!isFirebaseActive() && (
            <div className="mt-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full inline-block font-bold">
              離線展示模式 (無 Firebase)
            </div>
          )}
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">姓名</label>
              <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">電子郵件</label>
            <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">密碼</label>
            <input type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? '處理中...' : (isLogin ? '登入' : '註冊')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 font-semibold hover:underline">
            {isLogin ? '還沒有帳戶嗎？立即註冊' : '已經有帳戶了？點此登入'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
