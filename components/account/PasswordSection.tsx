import React, { useState } from 'react';
import { Button } from '../Button';

interface PasswordSectionProps {
    onChangePassword: (passwords: { current: string; new: string }) => boolean;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const getPasswordStrength = (password: string) => {
    let score = 0;
    if (!password) return { score: 0, label: '', color: '' };
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score === 3) return { score, label: 'Medium', color: 'bg-yellow-500' };
    if (score === 4) return { score, label: 'Strong', color: 'bg-green-500' };
    return { score, label: 'Very Strong', color: 'bg-emerald-500' };
};

export const PasswordSection: React.FC<PasswordSectionProps> = React.memo(({ onChangePassword, showToast }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ current?: string; new?: string; confirm?: string }>({});

    const passwordStrength = getPasswordStrength(newPassword);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { current?: string; new?: string; confirm?: string } = {};

        if (!currentPassword) newErrors.current = 'Current password is required.';
        if (!newPassword) newErrors.new = 'New password is required.';
        if (!confirmPassword) newErrors.confirm = 'Please confirm your new password.';
        
        if (newPassword && newPassword.length < 8) {
            newErrors.new = 'Password must be at least 8 characters long.';
        } else if (newPassword && passwordStrength.score <= 2) {
            newErrors.new = 'Password is too weak. Please choose a stronger password.';
        }

        if (newPassword && confirmPassword && newPassword !== confirmPassword) {
            newErrors.confirm = 'New passwords do not match.';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            showToast('Please correct the errors before saving.');
            return;
        }

        setErrors({});
        const success = onChangePassword({ current: currentPassword, new: newPassword });

        if(success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            // The only failure case from the parent is an incorrect current password.
            setErrors({ current: 'The current password you entered is incorrect.' });
        }
    };

    const formInputClass = "mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500";
    const formLabelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300";
    const errorInputClass = "border-red-500/50 focus:border-red-500 focus:ring-red-500";
    const errorTextClass = "mt-1 text-xs text-red-400";

    return (
        <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Change Password</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="current-password" className={formLabelClass}>Current Password</label>
                    <input type="password" id="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={`${formInputClass} ${errors.current ? errorInputClass : ''}`} required />
                    {errors.current && <p className={errorTextClass}>{errors.current}</p>}
                </div>
                <div>
                    <label htmlFor="new-password" className={formLabelClass}>New Password</label>
                    <input type="password" id="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={`${formInputClass} ${errors.new ? errorInputClass : ''}`} required />
                    {errors.new && <p className={errorTextClass}>{errors.new}</p>}
                     {newPassword && !errors.new && (
                        <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Password Strength</span>
                                <span className={`text-xs font-bold ${passwordStrength.score <= 2 ? 'text-red-400' : 'text-green-400'}`}>{passwordStrength.label}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5">
                                <div className={`h-1 rounded-full ${passwordStrength.score > 0 ? passwordStrength.color : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                                <div className={`h-1 rounded-full ${passwordStrength.score > 1 ? passwordStrength.color : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                                <div className={`h-1 rounded-full ${passwordStrength.score > 2 ? passwordStrength.color : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                                <div className={`h-1 rounded-full ${passwordStrength.score > 3 ? passwordStrength.color : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="confirm-new-password" className={formLabelClass}>Confirm New Password</label>
                    <input type="password" id="confirm-new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={`${formInputClass} ${errors.confirm ? errorInputClass : ''}`} required />
                    {errors.confirm && <p className={errorTextClass}>{errors.confirm}</p>}
                </div>
                 <div className="pt-4 flex justify-end">
                    <Button type="submit">Update Password</Button>
                </div>
            </form>
        </div>
    );
});