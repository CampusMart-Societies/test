import React from 'react';

const H1: React.FC<{children: React.ReactNode}> = ({ children }) => <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">{children}</h1>;
const H2: React.FC<{children: React.ReactNode}> = ({ children }) => <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">{children}</h2>;
const P: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className }) => <p className={`text-slate-600 dark:text-slate-300 leading-relaxed ${className}`}>{children}</p>;

export const TermsOfServicePage: React.FC = () => {
    return (
        <section className="py-20 lg:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <H1>Terms of Service</H1>
                <P className="text-slate-500 dark:text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString()}</P>
                <P>
                    Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Campusmart application (the "Service") operated by us.
                </P>
                <H2>1. Agreement to Terms</H2>
                <P>
                    By using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                </P>
                <H2>2. Accounts</H2>
                <P>
                    When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </P>
                 <H2>3. User Conduct</H2>
                <P>
                    You agree not to use the Service to: post any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.
                </P>
                 <H2>4. Termination</H2>
                <P>
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </P>
            </div>
        </section>
    );
};