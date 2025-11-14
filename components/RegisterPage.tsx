import React, { useState } from 'react';
import { Button } from './Button';
import { User } from '../types';
import { SCHOOL_LEVELS, GRADE_LEVELS_BY_SCHOOL } from '../constants';
import { ArrowUturnLeftIcon, LogoIcon } from './icons/Icons';

interface RegisterPageProps {
  onRegister: (userData: Omit<User, 'id' | 'reviewsReceived' | 'savedItemIds'>) => void;
  onNavigateToLogin: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  onNavigateBack: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigateToLogin, showToast, onNavigateBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [schoolLevel, setSchoolLevel] = useState('');
  const [grade, setGrade] = useState('');
  const [gradeOptions, setGradeOptions] = useState<string[]>([]);

  const handleSchoolLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSchoolLevel = e.target.value;
    setSchoolLevel(newSchoolLevel);
    setGrade(''); // Reset grade when school level changes
    setGradeOptions(GRADE_LEVELS_BY_SCHOOL[newSchoolLevel] || []);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords do not match.");
      return;
    }
    if (name && email && password && schoolLevel && grade) {
      onRegister({ name, email, password, schoolLevel, grade });
    } else {
      showToast("Please fill in all fields.");
    }
  };

  const formInputClass = "mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500";
  const formLabelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300";
  const optionClass = "text-slate-800 bg-white dark:text-slate-100 dark:bg-slate-800";

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
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
         <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
           Create your account
         </h2>
         <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
           Begin your journey in the digital marketplace!
         </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg py-8 px-4 shadow-2xl shadow-black/20 border border-slate-200 dark:border-slate-800/50 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="name" className={formLabelClass}>
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={formInputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="schoolLevel" className={formLabelClass}>
                  School Level
                </label>
                <div className="mt-1">
                  <select
                    id="schoolLevel"
                    name="schoolLevel"
                    required
                    value={schoolLevel}
                    onChange={handleSchoolLevelChange}
                    className={formInputClass}
                  >
                    <option value="" disabled className="text-slate-400 dark:text-slate-500">Select...</option>
                    {SCHOOL_LEVELS.map((level) => (
                      <option key={level} value={level} className={optionClass}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="grade" className={formLabelClass}>
                  Grade Level
                </label>
                <div className="mt-1">
                  <select
                    id="grade"
                    name="grade"
                    required
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    disabled={!schoolLevel}
                    className={`${formInputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="" disabled className="text-slate-400 dark:text-slate-500">Select...</option>
                    {gradeOptions.map((level) => (
                      <option key={level} value={level} className={optionClass}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className={formLabelClass}>
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={formInputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={formLabelClass}>
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={formInputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className={formLabelClass}>
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={formInputClass}
                />
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full !py-3">
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <button
                  onClick={onNavigateToLogin}
                  className="font-medium text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 focus:outline-none focus:underline"
                >
                  Sign in
                </button>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};