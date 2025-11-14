import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ArrowUturnLeftIcon, LogoIcon } from './icons/Icons';

interface LoginPageProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => void;
  onNavigateToRegister: () => void;
  onContinueAsGuest: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  onNavigateBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToRegister, onContinueAsGuest, showToast, onNavigateBack }) => {
  const [view, setView] = useState<'login' | 'forgotPassword'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('campusmart_remembered_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password, rememberMe);
    } else {
      showToast("Please enter both email and password.");
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      showToast('Please enter your email address.');
      return;
    }
    // Simulate sending reset instructions
    console.log(`Password reset instructions sent to ${resetEmail}`);
    showToast('Password reset instructions will be sent to your email.', 'success');
    setResetEmail('');
    setView('login');
  };

  const formInputClass = "mt-1 block w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-base text-slate-800 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors";
  const formLabelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300";

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 p-4 sm:p-6 lg:p-8">
            <Button variant="ghost" onClick={onNavigateBack} className="!px-3">
                <ArrowUturnLeftIcon className="h-5 w-5 mr-2" />
                Back to Home
            </Button>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <div className="flex justify-center items-center gap-3">
                <LogoIcon className="h-10 w-10 text-primary-500 dark:text-primary-400" />
                <h1 className="text-4xl font-bold tracking-tighter text-slate-900 dark:text-white">Campusmart</h1>
            </div>
             {view === 'login' ? (
                <>
                    <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
                      Welcome Back, Forger!
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Or{' '}
                      <button
                          onClick={onNavigateToRegister}
                          className="font-medium text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 focus:outline-none focus:underline"
                        >
                          join the digital frontier
                      </button>
                    </p>
                </>
            ) : (
                 <>
                    <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Enter your email to receive reset instructions.
                    </p>
                </>
            )}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg py-8 px-4 shadow-2xl shadow-black/20 border border-slate-200 dark:border-slate-800/50 sm:rounded-2xl sm:px-10">
              {view === 'login' ? (
                <>
                  <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                      <label htmlFor="email" className={formLabelClass}>
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={formInputClass}
                        placeholder="you@campus.edu"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className={formLabelClass}>
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={formInputClass}
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 dark:border-slate-600 rounded bg-slate-200 dark:bg-slate-700"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                          Remember me
                        </label>
                      </div>

                      <div className="text-sm">
                        <button type="button" onClick={() => setView('forgotPassword')} className="font-medium text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 focus:outline-none focus:underline">
                          Forgot password?
                        </button>
                      </div>
                    </div>

                    <div>
                      <Button type="submit" className="w-full !py-3 text-base font-bold">
                        Sign in
                      </Button>
                    </div>
                  </form>
                   <div className="mt-6 text-center text-sm">
                    <button onClick={onContinueAsGuest} className="font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-300 focus:outline-none focus:underline">
                        Continue as Guest
                    </button>
                  </div>
                </>
              ) : (
                 <>
                    <form className="space-y-6" onSubmit={handleForgotPassword}>
                        <div>
                            <label htmlFor="reset-email" className={formLabelClass}>
                                Email address
                            </label>
                            <input
                                id="reset-email"
                                name="reset-email"
                                type="email"
                                autoComplete="email"
                                required
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className={formInputClass}
                                placeholder="you@campus.edu"
                            />
                        </div>
                        <div>
                            <Button type="submit" className="w-full !py-3">
                                Send Reset Instructions
                            </Button>
                        </div>
                    </form>
                    <div className="mt-6 text-center text-sm">
                        <button onClick={() => setView('login')} className="font-medium text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-300 focus:outline-none focus:underline">
                            Back to Login
                        </button>
                    </div>
                </>
              )}
            </div>
        </div>
    </div>
  );
};