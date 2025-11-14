import React, { useState, useMemo } from 'react';
import { Button } from './Button';
import { XMarkIcon, GooglePayIcon, CreditCardIcon, VisaIcon, MastercardIcon } from './icons/Icons';
import { PaymentMethod } from '../types';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPaymentMethod: (newMethod: Omit<PaymentMethod, 'id'>) => void;
  userEmail: string;
  userName: string;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({ isOpen, onClose, onAddPaymentMethod, userEmail, userName, showToast }) => {
    const [cardHolder, setCardHolder] = useState(userName);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [makeDefault, setMakeDefault] = useState(true);
    const [errors, setErrors] = useState<{ cardHolder?: string, cardNumber?: string, expiry?: string, cvc?: string }>({});

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!cardHolder.trim()) newErrors.cardHolder = 'Cardholder name is required.';
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Enter a valid 16-digit card number.';
        
        const expiryMatch = expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/);
        if (!expiryMatch) {
            newErrors.expiry = 'Enter a valid date in MM/YY format.';
        } else {
            const month = parseInt(expiryMatch[1], 10);
            const year = parseInt(expiryMatch[2], 10);
            const expiryDate = new Date(2000 + year, month, 0); // Day 0 gets last day of previous month
            if (expiryDate < new Date()) {
                newErrors.expiry = 'Card has expired.';
            }
        }
        
        if (!/^\d{3,4}$/.test(cvc)) newErrors.cvc = 'Enter a valid CVC.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            showToast("Please correct the errors in the form.");
            return;
        }
        
        const brand = cardNumber.startsWith('4') ? 'visa' : 'mastercard';

        onAddPaymentMethod({
            brand,
            last4: cardNumber.slice(-4),
            expiryMonth: parseInt(expiry.slice(0, 2), 10),
            expiryYear: 2000 + parseInt(expiry.slice(3), 10),
            isDefault: makeDefault,
        });
        
        onClose();
    };

    const handleAddGooglePay = () => {
        onAddPaymentMethod({
            brand: 'google-pay',
            email: userEmail,
            isDefault: makeDefault,
        });
        onClose();
    };
    
    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof typeof errors) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if(errors[field]) {
            setErrors(prev => ({...prev, [field]: undefined}));
        }
    }
    
    const formatCardNumber = (value: string) => {
        return value.replace(/[^\d]/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
    };
    
    const formatExpiry = (value: string) => {
        let cleanValue = value.replace(/[^\d]/g, '').slice(0, 4);
        if (cleanValue.length > 2) {
            return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
        }
        return cleanValue;
    };
    
    const cardBrand = useMemo(() => {
        if (cardNumber.startsWith('4')) return 'visa';
        if (cardNumber.startsWith('5')) return 'mastercard';
        return undefined;
    }, [cardNumber]);


    const formInputClass = "mt-1 block w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-100 shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500";
    const formLabelClass = "block text-sm font-medium text-slate-300";
    const errorInputClass = "border-red-500/50 focus:border-red-500 focus:ring-red-500";
    const errorTextClass = "mt-1 text-xs text-red-400";

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-800 animate-slide-up" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Add a Payment Method</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="space-y-6">
                        {/* Card Form */}
                        <form onSubmit={handleAddCard} className="space-y-4">
                             <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                                <CreditCardIcon className="h-5 w-5" />
                                Add a credit or debit card
                             </h3>
                             <div>
                                <label htmlFor="cardHolder" className={formLabelClass}>Cardholder Name</label>
                                <input type="text" id="cardHolder" value={cardHolder} onChange={handleInputChange(setCardHolder, 'cardHolder')} className={`${formInputClass} ${errors.cardHolder ? errorInputClass : ''}`} required />
                                {errors.cardHolder && <p className={errorTextClass}>{errors.cardHolder}</p>}
                             </div>
                             <div>
                                <label htmlFor="cardNumber" className={formLabelClass}>Card Number</label>
                                <div className="relative">
                                    <input type="text" id="cardNumber" value={formatCardNumber(cardNumber)} onChange={e => setCardNumber(e.target.value)} className={`${formInputClass} ${errors.cardNumber ? errorInputClass : ''}`} placeholder="0000 0000 0000 0000" required />
                                    <div className="absolute inset-y-0 right-3 flex items-center">
                                        {cardBrand === 'visa' && <VisaIcon className="h-5" />}
                                        {cardBrand === 'mastercard' && <MastercardIcon className="h-6" />}
                                    </div>
                                </div>
                                {errors.cardNumber && <p className={errorTextClass}>{errors.cardNumber}</p>}
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="expiry" className={formLabelClass}>Expiry (MM/YY)</label>
                                    <input type="text" id="expiry" value={formatExpiry(expiry)} onChange={e => setExpiry(e.target.value)} className={`${formInputClass} ${errors.expiry ? errorInputClass : ''}`} placeholder="MM/YY" required />
                                    {errors.expiry && <p className={errorTextClass}>{errors.expiry}</p>}
                                </div>
                                <div>
                                    <label htmlFor="cvc" className={formLabelClass}>CVC</label>
                                    <input type="text" id="cvc" value={cvc} onChange={e => setCvc(e.target.value.replace(/[^\d]/g, '').slice(0, 4))} className={`${formInputClass} ${errors.cvc ? errorInputClass : ''}`} placeholder="123" required />
                                    {errors.cvc && <p className={errorTextClass}>{errors.cvc}</p>}
                                </div>
                             </div>
                            <div className="flex items-center pt-2">
                                <input
                                    id="makeDefaultCard"
                                    name="makeDefault"
                                    type="checkbox"
                                    checked={makeDefault}
                                    onChange={e => setMakeDefault(e.target.checked)}
                                    className="h-4 w-4 text-primary-600 bg-slate-700 border-slate-600 focus:ring-primary-500 rounded"
                                />
                                <label htmlFor="makeDefaultCard" className="ml-2 block text-sm text-slate-100">
                                    Make this my default payment method
                                </label>
                            </div>
                             <Button type="submit" variant="secondary" className="w-full !py-2.5">Add Card</Button>
                        </form>
                        
                        <div className="relative flex py-3 items-center">
                            <div className="flex-grow border-t border-slate-700"></div>
                            <span className="flex-shrink mx-4 text-slate-400 text-sm">Or use a digital wallet</span>
                            <div className="flex-grow border-t border-slate-700"></div>
                        </div>

                        {/* Digital Wallets */}
                        <div>
                            <Button onClick={handleAddGooglePay} variant="secondary" className="w-full !py-2.5 bg-white text-black hover:bg-gray-200">
                                <GooglePayIcon className="h-6 mr-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};