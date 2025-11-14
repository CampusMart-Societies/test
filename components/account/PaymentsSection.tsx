import React, { useState } from 'react';
import { User, Currency, PaymentMethod } from '../../types';
import { Button } from '../Button';
import { PlusCircleIcon, XMarkIcon, VisaIcon, MastercardIcon, GooglePayIcon } from '../icons/Icons';
import { formatPrice } from '../../constants';
import { AddPaymentMethodModal } from '../AddPaymentMethodModal';

interface PaymentsSectionProps {
    user: User;
    currency: Currency;
    onDeletePaymentMethod: (paymentMethod: PaymentMethod) => void;
    onAddPaymentMethod: (newMethod: Omit<PaymentMethod, 'id'>) => void;
    onSetDefaultPaymentMethod: (paymentMethodId: string) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const getCardIcon = (brand: 'visa' | 'mastercard' | 'google-pay') => {
    switch (brand) {
        case 'visa':
            return <VisaIcon className="h-5" />;
        case 'mastercard':
            return <MastercardIcon className="h-6" />;
        case 'google-pay':
            return <GooglePayIcon className="h-5" />;
        default:
            return null;
    }
};

const StatusBadge: React.FC<{ status: 'completed' | 'pending' | 'failed' }> = ({ status }) => {
    const baseClasses = "text-xs font-semibold px-2 py-0.5 rounded-full capitalize";
    const statusClasses = {
        completed: "bg-green-500/10 text-green-400",
        pending: "bg-yellow-500/10 text-yellow-400",
        failed: "bg-red-500/10 text-red-400",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

export const PaymentsSection: React.FC<PaymentsSectionProps> = React.memo(({ user, currency, onDeletePaymentMethod, onAddPaymentMethod, onSetDefaultPaymentMethod, showToast }) => {
    const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState(false);
    
    const handleDelete = (pm: PaymentMethod) => {
        if(pm.isDefault && user.paymentMethods.length > 1) {
            showToast('Cannot delete the default payment method. Please set another method as default first.');
            return;
        }
        onDeletePaymentMethod(pm);
    };
    
    return (
        <>
            <div>
                <h3 className="text-2xl font-bold text-white mb-6">Payments</h3>

                {/* Payment Methods */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xl font-semibold text-slate-100">Payment Methods</h4>
                        <Button variant="secondary" onClick={() => setIsAddMethodModalOpen(true)}>
                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                            Add Method
                        </Button>
                    </div>
                    {user.paymentMethods.length > 0 ? (
                        <div className="space-y-4">
                            {user.paymentMethods.map(pm => (
                                <div key={pm.id} className="flex items-center gap-4 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                                    <div className="flex-shrink-0 w-12 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">{getCardIcon(pm.brand)}</div>
                                    <div className="flex-1 min-w-0">
                                        {pm.brand === 'google-pay' ? (
                                            <>
                                                <p className="font-semibold text-slate-100">Google Pay</p>
                                                <p className="text-sm text-slate-400">{pm.email}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-semibold text-slate-100">{pm.brand === 'visa' ? 'Visa' : 'Mastercard'} ending in {pm.last4}</p>
                                                <p className="text-sm text-slate-400">Expires {String(pm.expiryMonth).padStart(2, '0')}/{pm.expiryYear}</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {pm.isDefault ? (
                                            <span className="text-xs font-bold text-primary-300 bg-primary-500/20 px-2.5 py-1 rounded-full">Default</span>
                                        ) : (
                                            <Button variant="ghost" onClick={() => onSetDefaultPaymentMethod(pm.id)} className="!py-1 !px-3 text-xs">Set as Default</Button>
                                        )}
                                        <Button variant="ghost" onClick={() => handleDelete(pm)} className="!p-2.5" aria-label={`Delete payment method`}>
                                            <XMarkIcon className="h-5 w-5 text-red-400/80 hover:text-red-400" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-slate-400 py-10 bg-slate-900/50 border-2 border-dashed border-slate-700/50 rounded-xl">
                            <p className="font-medium">No payment methods saved.</p>
                            <p className="text-sm mt-1">Add a payment method to get started.</p>
                        </div>
                    )}
                    <div className="mt-6 flex items-center justify-center gap-4 text-slate-500 text-sm">
                        <p>We accept:</p>
                        <div className="flex items-center gap-4">
                            <VisaIcon className="h-4" />
                            <MastercardIcon className="h-5" />
                            <GooglePayIcon className="h-4" />
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div>
                    <h4 className="text-xl font-semibold text-slate-100 mb-4">Transaction History</h4>
                    {user.transactionHistory.length > 0 ? (
                         <div className="overflow-x-auto bg-slate-800/50 rounded-xl border border-slate-700/50">
                            <table className="w-full text-sm text-left text-slate-300">
                                <thead className="text-xs text-slate-400 uppercase bg-slate-800/30">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                        <th scope="col" className="px-6 py-3">Item</th>
                                        <th scope="col" className="px-6 py-3 text-right">Amount</th>
                                        <th scope="col" className="px-6 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.transactionHistory.map(txn => (
                                        <tr key={txn.id} className="border-t border-slate-700 hover:bg-slate-800/40 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(txn.date).toLocaleDateString()}</td>
                                            <th scope="row" className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap">{txn.itemTitle}</th>
                                            <td className="px-6 py-4 text-right font-semibold whitespace-nowrap">{formatPrice(txn.amount, currency)}</td>
                                            <td className="px-6 py-4 text-center"><StatusBadge status={txn.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center text-slate-400 py-10 bg-slate-900/50 border-2 border-dashed border-slate-700/50 rounded-xl">
                            <p className="font-medium">No transactions yet.</p>
                            <p className="text-sm mt-1">Your purchase history will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
            <AddPaymentMethodModal
                isOpen={isAddMethodModalOpen}
                onClose={() => setIsAddMethodModalOpen(false)}
                onAddPaymentMethod={onAddPaymentMethod}
                userEmail={user.email}
                userName={user.name}
                showToast={showToast}
            />
        </>
    );
});