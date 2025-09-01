import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { login, register, isLoading, error } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (isLoginView) {
            await login(email, password);
        } else {
            await register(name, email, password);
        }
    } catch (err) {
        // Erro já é tratado no AuthContext, este catch evita erros não capturados no console.
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-dark">Fábrica de Ideias</h1>
          <p className="text-gray-600 mt-2">{isLoginView ? 'Acesse sua conta para continuar' : 'Crie uma conta para começar'}</p>
        </div>
        
        <div className="flex justify-center border-b">
          <button onClick={() => setIsLoginView(true)} className={`px-6 py-2 text-lg font-semibold transition-colors focus:outline-none ${isLoginView ? 'text-brand-dark border-b-2 border-brand-dark' : 'text-gray-500 hover:text-brand-mid'}`}>
            Login
          </button>
          <button onClick={() => setIsLoginView(false)} className={`px-6 py-2 text-lg font-semibold transition-colors focus:outline-none ${!isLoginView ? 'text-brand-dark border-b-2 border-brand-dark' : 'text-gray-500 hover:text-brand-mid'}`}>
            Registrar
          </button>
        </div>

        {isLoading ? (
            <Loader text={isLoginView ? 'Entrando...' : 'Criando conta...'} />
        ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-mid focus:border-brand-mid" />
                </div>
            )}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-mid focus:border-brand-mid" />
            </div>
            <div>
                <label htmlFor="password"className="block text-sm font-medium text-gray-700">Senha</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-mid focus:border-brand-mid" />
            </div>

            {error && <p className="text-red-600 text-sm text-center font-semibold bg-red-50 p-3 rounded-md">{error}</p>}

            <div>
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-br from-brand-dark to-brand-mid hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-mid disabled:opacity-50">
                {isLoginView ? 'Entrar' : 'Criar Conta'}
                </button>
            </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;