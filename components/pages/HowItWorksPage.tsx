import React from 'react';
import { CameraIcon, ChatBubbleLeftRightIcon, ArrowPathIcon, MagnifyingGlassIcon, ShieldCheckIcon } from '../icons/Icons';

const sellerSteps = [
    {
        icon: CameraIcon,
        title: '1. Snap & List in Seconds',
        description: 'It takes less than 60 seconds. Add a title, description, price, and a photo. Can\'t find a good picture? Generate one instantly with our AI tool!'
    },
    {
        icon: ChatBubbleLeftRightIcon,
        title: '2. Connect & Chat Securely',
        description: 'Get instant notifications for messages from interested buyers. Chat securely within the app to negotiate prices and arrange a meetup.'
    },
    {
        icon: ArrowPathIcon,
        title: '3. Meet Up & Get Paid',
        description: 'Meet the buyer at a safe, public spot on campus like the library or student center. Exchange your item for cash. It\'s that easy!'
    }
];

const buyerSteps = [
    {
        icon: MagnifyingGlassIcon,
        title: '1. Discover & Search',
        description: 'Browse listings from students across campus or use our powerful search and filters to find exactly what you need, from textbooks to tech.'
    },
    {
        icon: ChatBubbleLeftRightIcon,
        title: '2. Ask Questions & Arrange',
        description: 'Have a question about an item? Message the seller directly to get more details or make an offer. Agree on a time and place to meet.'
    },
    {
        icon: ArrowPathIcon,
        title: '3. Inspect & Pay',
        description: 'Meet the seller, check that the item is as described, and pay them directly. No shipping fees, no waiting for delivery.'
    }
];

export const HowItWorksPage: React.FC = () => {
    return (
        <>
            <section id="how-it-works" className="py-20 lg:py-32">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                           Get Started in Three Easy Steps
                        </h2>
                        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                            Trading on Campusmart is fast, simple, and secure, whether you're buying or selling.
                        </p>
                    </div>

                    {/* For Sellers */}
                    <div className="mt-20">
                        <h3 className="text-2xl font-bold text-primary-500 dark:text-primary-400 text-center">For Sellers</h3>
                        <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            <div className="absolute top-10 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700/50 hidden md:block"></div>
                            {sellerSteps.map((step) => (
                                <div key={step.title} className="relative z-10 text-center flex flex-col items-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-slate-900 text-primary-500 dark:text-primary-400 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                                        <step.icon className="h-10 w-10" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                                    <p className="mt-2 text-slate-500 dark:text-slate-400">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* For Buyers */}
                     <div className="mt-24">
                        <h3 className="text-2xl font-bold text-secondary-500 dark:text-secondary-400 text-center">For Buyers</h3>
                        <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            <div className="absolute top-10 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700/50 hidden md:block"></div>
                            {buyerSteps.map((step) => (
                                <div key={step.title} className="relative z-10 text-center flex flex-col items-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-slate-900 text-secondary-500 dark:text-secondary-400 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                                        <step.icon className="h-10 w-10" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                                    <p className="mt-2 text-slate-500 dark:text-slate-400">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="py-20 lg:py-32 bg-slate-100 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <ShieldCheckIcon className="h-12 w-12 text-green-500 dark:text-green-400 mx-auto" />
                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                           Campus Safety Tips
                        </h2>
                         <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                            Your safety is our priority. Follow these tips for a secure trading experience.
                        </p>
                        <ul className="mt-8 text-left space-y-4 text-slate-600 dark:text-slate-300 list-disc list-inside">
                            <li><strong>Meet in Public:</strong> Always arrange to meet in well-lit, public places on campus, like the library, student union, or a busy cafe.</li>
                            <li><strong>Bring a Friend:</strong> If you can, bring a friend along with you for the exchange.</li>
                            <li><strong>Inspect Before Paying:</strong> Thoroughly check the item to ensure it matches the description before you hand over any money.</li>
                            <li><strong>Trust Your Gut:</strong> If a deal feels too good to be true or a situation feels unsafe, it's okay to walk away.</li>
                            <li><strong>Keep Chats in the App:</strong> Use the built-in messenger to communicate. Avoid sharing personal contact information until you're comfortable.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
};