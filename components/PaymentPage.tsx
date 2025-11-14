import React, { useState, useMemo } from 'react';
import { User, Currency, PaymentMethod, Item, PurchaseContext } from '../types';
import { Button } from './Button';
import { XMarkIcon, GooglePayIcon, CreditCardIcon, ShieldCheckIcon, ArrowUturnLeftIcon, SpinnerIcon, CheckIcon, VisaIcon, MastercardIcon } from './icons/Icons';
import { formatPrice } from '../constants';

interface PaymentPageProps {
  user: User;
  purchaseContext: PurchaseContext;
  currency: Currency;
  onConfirmPurchase: (context: PurchaseContext, paymentMethod: PaymentMethod) => void;
  onCancel: () => void;
  onAddPaymentMethod: (newMethod: Omit<PaymentMethod, 'id'>) => PaymentMethod | undefined;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const getCardIcon = (brand?: 'visa' | 'mastercard' | 'google-pay') => {
    switch (brand) {
        case 'visa':
            return <VisaIcon className="h-5" />;
        case 'mastercard':
            return <MastercardIcon className="h-6" />;
        case 'google-pay':
             return <GooglePayIcon className="h-5" />;
        default:
            return <CreditCardIcon className="h-6 text-slate-400 dark:text-slate-500" />;
    }
};

export const PaymentPage: React.FC<PaymentPageProps> = ({ user, purchaseContext, currency, onConfirmPurchase, onCancel, onAddPaymentMethod, showToast }) => {
    const [selectedMethodId, setSelectedMethodId] = useState<string | 'new'>(
        user.paymentMethods.find(pm => pm.isDefault)?.id || (user.paymentMethods.length > 0 ? user.paymentMethods[0].id : 'new')
    );
    const [isLoading, setIsLoading] = useState(false);

    // Form state for new card
    const [cardHolder, setCardHolder] = useState(user.name);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [errors, setErrors] = useState<{ cardHolder?: string, cardNumber?: string, expiry?: string, cvc?: string }>({});

    const isCartPurchase = Array.isArray(purchaseContext);
    const isPlanPurchase = purchaseContext && 'type' in purchaseContext && purchaseContext.type === 'plan';
    
    const itemsToDisplay = isCartPurchase ? purchaseContext : (purchaseContext && !isPlanPurchase ? [purchaseContext as Item] : []);
    
    const totalAmount = useMemo(() => {
        if (isCartPurchase) {
            return purchaseContext.reduce((sum, item) => sum + item.price, 0);
        }
        if (purchaseContext) {
            return (purchaseContext as any).price;
        }
        return 0;
    }, [purchaseContext, isCartPurchase]);

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (!cardHolder.trim()) newErrors.cardHolder = 'Cardholder name is required.';
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Enter a valid 16-digit card number.';
        if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry.replace('/', ''))) {
            newErrors.expiry = 'Enter a valid expiry date (MM/YY).';
        } else {
            const [month, year] = expiry.split('/');
            const expiryDate = new Date(2000 + parseInt(year, 10), parseInt(month, 10)); // Month is 0-indexed
            if (expiryDate < new Date()) {
                newErrors.expiry = 'Card has expired.';
            }
        }
        if (!/^\d{3,4}$/.test(cvc)) newErrors.cvc = 'Enter a valid CVC.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const formatCardNumber = (value: string) => {
        return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    };
    
    const formatExpiry = (value: string) => {
        let cleanValue = value.replace(/[^\d]/g, '');
        if (cleanValue.length > 2) {
            return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
        }
        return cleanValue;
    };

    const handlePay = () => {
        let paymentMethodToUse: PaymentMethod | undefined | null;

        if (selectedMethodId === 'new') {
            if (!validateForm()) return;
            const newMethodData: Omit<PaymentMethod, 'id'> = {
                brand: cardNumber.startsWith('4') ? 'visa' : 'mastercard',
                last4: cardNumber.slice(-4),
                expiryMonth: parseInt(expiry.slice(0, 2), 10),
                expiryYear: 2000 + parseInt(expiry.slice(3), 10),
                isDefault: false, // Adding a new card during checkout doesn't make it default automatically
            };
            paymentMethodToUse = onAddPaymentMethod(newMethodData);
        } else {
             paymentMethodToUse = user.paymentMethods.find(pm => pm.id === selectedMethodId);
        }

        if (!paymentMethodToUse || !purchaseContext) {
            showToast('Please select a valid payment method.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            onConfirmPurchase(purchaseContext, paymentMethodToUse!);
            setIsLoading(false);
        }, 1500);
    };

    const formInputClass = "mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500";
    const formLabelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300";
    const errorInputClass = "border-red-500/50 focus:border-red-500 focus:ring-red-500";
    const errorTextClass = "mt-1 text-xs text-red-400";
    
    const cardBrand = useMemo(() => {
        if (cardNumber.startsWith('4')) return 'visa';
        if (cardNumber.startsWith('5')) return 'mastercard';
        return undefined;
    }, [cardNumber]);

    return (
        <div className="min-h-screen font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl mx-auto">
                 <div className="mb-6 text-left">
                    <Button variant="ghost" onClick={onCancel} disabled={isLoading} className="!px-3">
                        <ArrowUturnLeftIcon className="h-5 w-5 mr-2" />
                        Cancel Purchase
                    </Button>
                </div>

                <div className="space-y-8">
                    {/* Order Summary */}
                    <div className="bg-white dark:bg-slate-900/50 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800/50">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            {itemsToDisplay.length > 0 ? (
                                <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                                    {itemsToDisplay.map(item => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <p className="text-slate-600 dark:text-slate-300 truncate max-w-[70%]">{item.title}</p>
                                            <p className="font-medium text-slate-800 dark:text-slate-100">{formatPrice(item.price, currency)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <p className="text-slate-500 dark:text-slate-400">Item:</p>
                                    <p className="font-medium text-slate-800 dark:text-slate-100 text-right max-w-[70%]">{isPlanPurchase ? `${(purchaseContext as any).name} Plan Subscription` : ''}</p>
                                </div>
                            )}

                            <div className={`flex justify-between items-center text-lg ${itemsToDisplay.length > 0 ? 'border-t border-slate-200 dark:border-slate-700 pt-4' : ''}`}>
                                <p className="font-semibold text-slate-800 dark:text-slate-100">Total Amount</p>
                                <p className="font-bold text-primary-500 dark:text-primary-400 text-2xl">{formatPrice(totalAmount, currency)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white dark:bg-slate-900/50 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800/50">
                         <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Payment Method</h2>
                         <div className="space-y-4">
                            {user.paymentMethods.map(pm => (
                                <div key={pm.id} onClick={() => setSelectedMethodId(pm.id)} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethodId === pm.id ? 'bg-primary-500/10 border-primary-500 ring-2 ring-primary-500/50' : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                                    <div className="w-10 flex-shrink-0">{getCardIcon(pm.brand)}</div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{pm.brand === 'google-pay' ? 'Google Pay' : `${pm.brand.charAt(0).toUpperCase() + pm.brand.slice(1)} ending in ${pm.last4}`}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{pm.brand === 'google-pay' ? pm.email : `Expires ${String(pm.expiryMonth).padStart(2,'0')}/${pm.expiryYear.toString().slice(-2)}`}</p>
                                    </div>
                                    {selectedMethodId === pm.id && <CheckIcon className="h-6 w-6 text-primary-500 dark:text-primary-400 flex-shrink-0" />}
                                </div>
                            ))}
                             <div onClick={() => setSelectedMethodId('new')} className={`p-4 rounded-xl border-2 transition-all ${selectedMethodId === 'new' ? 'bg-primary-500/10 border-primary-500 ring-2 ring-primary-500/50' : 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                                <div className="flex items-center gap-4 cursor-pointer">
                                    <div className="w-10 flex-shrink-0"><CreditCardIcon className="h-6 text-slate-400 dark:text-slate-500" /></div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-100 flex-1">Add a new credit/debit card</p>
                                    {selectedMethodId === 'new' && <CheckIcon className="h-6 w-6 text-primary-500 dark:text-primary-400 flex-shrink-0" />}
                                </div>
                                 <div className={`transition-all duration-300 ease-in-out overflow-hidden ${selectedMethodId === 'new' ? 'max-h-[500px] pt-4 mt-4 border-t border-slate-200 dark:border-slate-700' : 'max-h-0'}`}>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="cardHolder" className={formLabelClass}>Cardholder Name</label>
                                            <input type="text" id="cardHolder" value={cardHolder} onChange={e => setCardHolder(e.target.value)} className={`${formInputClass} ${errors.cardHolder ? errorInputClass : ''}`} />
                                            {errors.cardHolder && <p className={errorTextClass}>{errors.cardHolder}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="cardNumber" className={formLabelClass}>Card Number</label>
                                            <div className="relative">
                                                <input type="text" id="cardNumber" value={formatCardNumber(cardNumber)} onChange={e => setCardNumber(e.target.value)} className={`${formInputClass} ${errors.cardNumber ? errorInputClass : ''}`} placeholder="0000 0000 0000 0000" />
                                                <div className="absolute inset-y-0 right-3 flex items-center">{getCardIcon(cardBrand)}</div>
                                            </div>
                                            {errors.cardNumber && <p className={errorTextClass}>{errors.cardNumber}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="expiry" className={formLabelClass}>Expiry</label>
                                                <input type="text" id="expiry" value={formatExpiry(expiry)} onChange={e => setExpiry(e.target.value)} className={`${formInputClass} ${errors.expiry ? errorInputClass : ''}`} placeholder="MM/YY" />
                                                {errors.expiry && <p className={errorTextClass}>{errors.expiry}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="cvc" className={formLabelClass}>CVC</label>
                                                <input type="text" id="cvc" value={cvc} onChange={e => setCvc(e.target.value.replace(/[^\d]/g, '').slice(0, 4))} className={`${formInputClass} ${errors.cvc ? errorInputClass : ''}`} placeholder="123" />
                                                {errors.cvc && <p className={errorTextClass}>{errors.cvc}</p>}
                                            </div>
                                        </div>
                                    </div>
                                 </div>
                            </div>
                         </div>
                    </div>

                    {/* Pay Button */}
                     <div className="mt-8">
                        <Button onClick={handlePay} disabled={isLoading} className="w-full !py-4 text-lg font-bold">
                           {isLoading ? (
                               <>
                                <SpinnerIcon className="h-6 w-6 mr-3" />
                                Processing...
                               </>
                           ) : `Pay ${formatPrice(totalAmount, currency)}`}
                        </Button>
                        <div className="mt-4 text-xs text-slate-500 dark:text-slate-500 flex items-center justify-center gap-2">
                            <ShieldCheckIcon className="h-4 w-4" />
                            <span>Payments are secure and encrypted.</span>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};