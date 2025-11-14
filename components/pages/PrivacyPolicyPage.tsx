import React from 'react';

const H1: React.FC<{children: React.ReactNode}> = ({ children }) => <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">{children}</h1>;
const H2: React.FC<{children: React.ReactNode}> = ({ children }) => <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">{children}</h2>;
const P: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className }) => <p className={`text-slate-600 dark:text-slate-300 leading-relaxed ${className}`}>{children}</p>;

export const PrivacyPolicyPage: React.FC = () => {
    return (
        <section className="py-20 lg:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <H1>Privacy Policy</H1>
                <P className="text-slate-500 dark:text-slate-400 mb-8">Last updated: {new Date().toLocaleDateString()}</P>
                <P>
                    Welcome to Campusmart. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
                </P>
                <H2>1. Information We Collect</H2>
                <P>
                    We collect personal information that you voluntarily provide to us when you register on the Campusmart, express an interest in obtaining information about us or our products and services, when you participate in activities on the Campusmart or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the Campusmart, the choices you make and the products and features you use.
                </P>
                <H2>2. How We Use Your Information</H2>
                <P>
                    We use personal information collected via our Campusmart for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                </P>
                 <H2>3. Will Your Information Be Shared With Anyone?</H2>
                <P>
                    We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data that we hold based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, Legal Obligations.
                </P>
            </div>
        </section>
    );
};