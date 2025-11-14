import React from 'react';
import { Button } from '../Button';
import { CheckIcon } from '../icons/Icons';
import { Page } from '../../types';

interface PricingPageProps {
    onNavigate: (page: Page) => void;
    onPlanSelect: (plan: { name: 'Free' | 'Pro' | 'Premier', price: number }) => void;
}

const pricingPlans = [
    {
        name: 'Free',
        price: '₹0',
        description: 'Perfect for casual sellers and buyers getting started.',
        features: [
            '5 active listings',
            'Standard placement in search',
            'Basic messaging with buyers',
            'Community support access'
        ],
        cta: 'Get Started',
        variant: 'secondary'
    },
    {
        name: 'Pro',
        price: '₹199',
        originalPrice: '₹499',
        priceSuffix: '/mo',
        description: 'For serious sellers who want to sell faster and build trust.',
        features: [
            '25 active listings',
            'Upload Video Listings',
            'Verified Seller Badge',
            'Weekly Listing "Bumps"',
            'Promoted placement for 5 items',
        ],
        cta: 'Upgrade to Pro',
        variant: 'primary',
        popular: true
    },
    {
        name: 'Premier',
        price: '₹499',
        originalPrice: '₹999',
        priceSuffix: '/mo',
        description: 'The ultimate toolkit for campus entrepreneurs.',
        features: [
            'Unlimited active listings',
            'All features from Pro plan',
            'Secure Payment Gateway (0% fee)',
            'Advanced Sales & Pricing Analytics',
            'Early Access to New Features',
        ],
        cta: 'Go Premier',
        variant: 'secondary'
    }
];

const featuresComparison = [
  { feature: 'Active Listings', free: '5', pro: '25', premier: 'Unlimited' },
  { feature: 'Video Listings', free: false, pro: true, premier: true },
  { feature: 'Verified Seller Badge', free: false, pro: true, premier: true },
  { feature: 'Weekly Listing "Bumps"', free: false, pro: '1 per week', premier: '3 per week' },
  { feature: 'Promoted Placements', free: false, pro: '5 items', premier: '15 items' },
  { feature: '0% Payment Gateway Fee', free: false, pro: false, premier: true },
  { feature: 'Sales Analytics', free: false, pro: false, premier: true },
  { feature: 'Priority Support', free: false, pro: false, premier: true },
];

const faqs = [
    {
        question: "Can I cancel my plan at any time?",
        answer: "Yes, absolutely! You can downgrade or cancel your Pro or Premier plan at any time from your account settings. You'll retain your premium features until the end of the current billing cycle."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, and UPI payments through our secure payment processor. For the Premier plan's payment gateway, we support a wide range of options for your customers."
    },
    {
        question: "Is there a free trial for paid plans?",
        answer: "We don't offer a traditional free trial, but our Free plan is fully-featured and available forever. This allows you to get a feel for the platform before deciding to upgrade for more powerful features."
    }
];


export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, onPlanSelect }) => {
    
    const handleSelect = (planName: string, price: string) => {
        const numericPrice = parseInt(price.replace('₹', ''), 10);
        onPlanSelect({ name: planName as 'Free' | 'Pro' | 'Premier', price: numericPrice });
    };

    return (
        <>
            <section id="pricing" className="py-20 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            Pricing Plans for Every Student
                        </h2>
                        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                            Choose the plan that fits your needs. Start for free or upgrade for more features.
                        </p>
                    </div>
                    <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {pricingPlans.map((plan) => (
                            <div key={plan.name} className={`bg-white dark:bg-slate-800/50 p-8 rounded-2xl border flex flex-col relative transition-all duration-300 ${plan.popular ? 'border-primary-500/50 md:-translate-y-4 shadow-2xl shadow-primary-500/10' : 'border-slate-200 dark:border-slate-700/50 hover:-translate-y-2'}`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-primary-500 text-white">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white text-center">{plan.name}</h3>
                                <p className="mt-2 text-slate-500 dark:text-slate-400 text-center h-12">{plan.description}</p>
                                <div className="my-8 text-center flex items-baseline justify-center gap-2">
                                    {plan.originalPrice && (
                                        <span className="text-3xl font-semibold text-slate-400 dark:text-slate-500 line-through">
                                            {plan.originalPrice}
                                        </span>
                                    )}
                                    <span className="text-5xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                                    {plan.priceSuffix && <span className="text-lg text-slate-500 dark:text-slate-400">{plan.priceSuffix}</span>}
                                </div>
                                <ul className="space-y-4 text-slate-600 dark:text-slate-300 flex-grow">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start">
                                            <CheckIcon className="h-6 w-6 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-10">
                                    <Button onClick={() => handleSelect(plan.name, plan.price)} variant={plan.variant as 'primary' | 'secondary'} className="w-full !py-3">
                                        {plan.cta}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="py-20 lg:py-32 bg-slate-100 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            Compare Features
                        </h2>
                        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                           Find the perfect set of tools for your campus hustle.
                        </p>
                    </div>

                    <div className="mt-16 max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                            <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                                <thead className="text-xs text-slate-700 dark:text-slate-100 uppercase bg-slate-100 dark:bg-slate-800/30">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Feature</th>
                                        <th scope="col" className="px-6 py-4 text-center">Free</th>
                                        <th scope="col" className="px-6 py-4 text-center">Pro</th>
                                        <th scope="col" className="px-6 py-4 text-center">Premier</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {featuresComparison.map((item, index) => (
                                        <tr key={index} className="border-t border-slate-200 dark:border-slate-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{item.feature}</th>
                                            <td className="px-6 py-4 text-center">{typeof item.free === 'boolean' ? (item.free ? <CheckIcon className="h-5 w-5 text-green-500 dark:text-green-400 mx-auto" /> : '—') : item.free}</td>
                                            <td className="px-6 py-4 text-center">{typeof item.pro === 'boolean' ? (item.pro ? <CheckIcon className="h-5 w-5 text-green-500 dark:text-green-400 mx-auto" /> : '—') : item.pro}</td>
                                            <td className="px-6 py-4 text-center">{typeof item.premier === 'boolean' ? (item.premier ? <CheckIcon className="h-5 w-5 text-green-500 dark:text-green-400 mx-auto" /> : '—') : item.premier}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

             <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            Frequently Asked Questions
                        </h2>
                    </div>
                    <div className="mt-12 max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                             <details key={index} className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 cursor-pointer group" open={index === 0}>
                                <summary className="text-md font-semibold text-slate-900 dark:text-slate-100 flex justify-between items-center list-none">
                                    {faq.question}
                                    <span className="transform transition-transform duration-200 group-open:rotate-180">
                                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </span>
                                </summary>
                                <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};