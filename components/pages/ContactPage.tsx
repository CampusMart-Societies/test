import React, { useState } from 'react';
import { Button } from '../Button';
import { EnvelopeIcon, MapPinIcon } from '../icons/Icons';
import { Page } from '../../types';

interface ContactPageProps {
    onNavigate: (page: Page) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd handle form submission here
        console.log({ name, email, message });
        setSubmitted(true);
    };

    const formInputClass = "mt-1 block w-full px-4 py-3 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-base text-slate-900 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors";
    const formLabelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 text-left";

    return (
        <section className="py-20 lg:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Get in Touch
                    </h2>
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Have a question or feedback? We'd love to hear from you. Fill out the form below or reach out to us directly.
                    </p>
                </div>

                <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary-500/10 text-primary-500 dark:text-primary-400 rounded-lg flex items-center justify-center">
                                <EnvelopeIcon className="h-6 w-6"/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Email Us</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Our support team will get back to you within 24 hours.</p>
                                <a href="mailto:adi.campusmart@gmail.com" className="text-primary-500 dark:text-primary-400 font-medium hover:underline mt-2 inline-block">adi.campusmart@gmail.com</a>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex items-start gap-4">
                             <div className="flex-shrink-0 w-12 h-12 bg-primary-500/10 text-primary-500 dark:text-primary-400 rounded-lg flex items-center justify-center">
                                <MapPinIcon className="h-6 w-6"/>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Visit Us</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">Sancta Maria International School</p>
                            </div>
                        </div>
                         <div className="p-4 text-center bg-slate-100 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700/30">
                           <p className="text-sm text-slate-500 dark:text-slate-400">
                                P.S. Have you checked our <button onClick={() => onNavigate('how-it-works')} className="font-semibold text-primary-500 dark:text-primary-400 hover:underline">How It Works</button> page? Your question might be answered there!
                           </p>
                        </div>
                    </div>
                    <div>
                        {submitted ? (
                            <div className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50 text-center h-full flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-primary-500 dark:text-primary-400">Thank You!</h3>
                                <p className="mt-2 text-slate-600 dark:text-slate-300">Your message has been sent. We'll get back to you as soon as possible.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50 space-y-6">
                                <div>
                                    <label htmlFor="name" className={formLabelClass}>Full Name</label>
                                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={formInputClass} required />
                                </div>
                                <div>
                                    <label htmlFor="email" className={formLabelClass}>Email Address</label>
                                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={formInputClass} required />
                                </div>
                                <div>
                                    <label htmlFor="message" className={formLabelClass}>Message</label>
                                    <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} className={formInputClass} rows={5} required></textarea>
                                </div>
                                <div className="text-right">
                                    <Button type="submit" className="!py-3 !px-6">
                                        Send Message
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};