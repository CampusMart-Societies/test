import React from 'react';
import { MagnifyingGlassIcon, ShieldCheckIcon, CameraIcon, ChatBubbleOvalLeftEllipsisIcon, HeartIcon, UserCircleIcon, SparklesIcon, ArrowDownTrayIcon } from '../icons/Icons';

const features = [
  {
    icon: MagnifyingGlassIcon,
    title: 'Advanced Search & Filtering',
    description: "Pinpoint exactly what you need with powerful search and filters for category, price, condition, and location on campus.",
  },
  {
    icon: CameraIcon,
    title: 'Effortless Listing',
    description: "Declutter and earn. Listing items takes less than a minute. Just snap a photo, add details, and post.",
  },
  {
    icon: ShieldCheckIcon,
    title: 'Safe & Secure',
    description: "Transact with confidence. Meet fellow students on campus for safe exchanges, and rely on our user rating system to build trust.",
  },
   {
    icon: ChatBubbleOvalLeftEllipsisIcon,
    title: 'Instant Messaging',
    description: "Securely chat with buyers and sellers in real-time without leaving the app to ask questions and coordinate meetups.",
  },
   {
    icon: HeartIcon,
    title: 'Wishlist & Alerts',
    description: "Save items you're interested in and get notified when new items matching your criteria are listed or prices drop.",
  },
   {
    icon: UserCircleIcon,
    title: 'User Profiles & Reviews',
    description: "Build trust within the community. Check seller ratings and read reviews from other students before you make a deal.",
  },
  {
    icon: SparklesIcon,
    title: 'AI-Powered Tools',
    description: "Use MartBot to get help navigating the marketplace, or instantly generate placeholder images for your listings with AI.",
  },
   {
    icon: ArrowDownTrayIcon,
    title: 'PWA-Ready Experience',
    description: "Install Campusmart on your device for a native app-like experience, offline access, and push notifications.",
  }
];

export const FeaturesPage: React.FC = () => {
    return (
        <section id="features" className="py-20 lg:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        A Marketplace That Works For You
                    </h2>
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        We've packed Campusmart with features designed to make buying and selling on campus safer, faster, and easier than ever before.
                    </p>
                </div>
                <div className="mt-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500 dark:text-primary-400">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};