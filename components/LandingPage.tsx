import React from 'react';
import { Button } from './Button';
import { SparklesIcon, CameraIcon, ChatBubbleLeftRightIcon, ArrowPathIcon, StarIcon, UserCircleIcon } from './icons/Icons';
import { Page } from '../types';


interface LandingPageProps {
  onGetStarted: () => void;
  onNavigate: (page: Page) => void;
  isLoggedIn?: boolean;
}

const Marquee: React.FC = () => {
    const items = ['Textbooks', 'Electronics', 'Dorm Furniture', 'Bikes & Scooters', 'Clothing', 'Tutoring Services'];
    const marqueeContent = Array(4).fill(items).flat();

    return (
        <div className="relative flex overflow-x-hidden text-slate-500 font-semibold uppercase py-8 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="animate-marquee whitespace-nowrap flex gap-12">
                {marqueeContent.map((text, index) => (
                    <span key={index} className="text-xl mx-4 tracking-widest flex items-center gap-4">
                        <SparklesIcon className="h-4 w-4 text-secondary-500/50" /> {text}
                    </span>
                ))}
            </div>
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-12 py-8">
                 {marqueeContent.map((text, index) => (
                    <span key={index} className="text-xl mx-4 tracking-widest flex items-center gap-4">
                         <SparklesIcon className="h-4 w-4 text-secondary-500/50" /> {text}
                    </span>
                ))}
            </div>
        </div>
    );
};

const howItWorks = [
    {
        icon: CameraIcon,
        title: '1. List an Item',
        description: 'Snap a photo, add a quick description, and set your price.'
    },
    {
        icon: ChatBubbleLeftRightIcon,
        title: '2. Get Notified',
        description: 'Chat with interested buyers and agree on a price and meetup spot.'
    },
    {
        icon: ArrowPathIcon,
        title: '3. Meet & Exchange',
        description: 'Arrange a safe meetup on campus to exchange your item for cash.'
    }
];

export const LandingPage: React.FC<LandingPageProps> = React.memo(({ onGetStarted, onNavigate, isLoggedIn }) => {
  
  return (
    <>
        <section id="home" className="relative h-[90vh] min-h-[700px] lg:h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 -z-10 h-full w-full bg-slate-950">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="animate-float text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 leading-tight drop-shadow-md">
                        Your Campus,
                        <br />
                        <span className="bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Your Marketplace.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-300/90">
                       The easiest way for students to buy, sell, and trade textbooks, electronics, dorm essentials, and more.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button onClick={onGetStarted} variant="primary" className="px-8 py-4 text-lg w-full sm:w-auto">
                         {isLoggedIn ? 'Go to Dashboard' : 'Launch Marketplace'}
                        </Button>
                         <Button onClick={() => onNavigate('how-it-works')} variant="ghost" className="px-8 py-4 text-lg w-full sm:w-auto">
                            How It Works
                        </Button>
                    </div>
            </div>
        </section>

        <section>
            <Marquee />
        </section>

        <section id="how-it-works-summary" className="py-20 lg:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                       Get Started in Three Easy Steps
                    </h2>
                    <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                        Trading on Campusmart is fast, simple, and secure.
                    </p>
                </div>
                 <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                     <div className="absolute top-10 left-0 w-full h-0.5 bg-slate-700/50 hidden md:block"></div>
                     {howItWorks.map((step) => (
                         <div key={step.title} className="relative z-10 text-center flex flex-col items-center">
                             <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-secondary-400 border-2 border-slate-700 shadow-lg">
                                 <step.icon className="h-10 w-10" />
                             </div>
                             <h3 className="mt-6 text-xl font-semibold text-white">{step.title}</h3>
                             <p className="mt-2 text-slate-400">{step.description}</p>
                         </div>
                     ))}
                 </div>
                 <div className="mt-12 text-center">
                    <Button onClick={() => onNavigate('how-it-works')} variant="secondary">See a Detailed Guide</Button>
                </div>
            </div>
        </section>

         <section id="testimonials-summary" className="py-20 lg:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="flex justify-center text-amber-400 gap-1">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-6 w-6" />)}
                    </div>
                    <blockquote className="mt-6">
                        <p className="text-2xl font-medium text-white">
                            "Great platform! Found exactly what I needed for my project and the seller was a fellow student. Super easy to use."
                        </p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center justify-center gap-3">
                        <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <UserCircleIcon className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                        </div>
                        <div>
                            <div className="font-semibold text-white">Aarush Gandhi</div>
                        </div>
                    </figcaption>
                     <div className="mt-10">
                         <Button onClick={() => onNavigate('testimonials')} variant="ghost">Read More Stories</Button>
                    </div>
                </div>
            </div>
        </section>


        <section className="py-20 lg:py-32 bg-slate-900/50">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Ready to Start Trading?
                 </h2>
                 <p className="mt-4 mx-auto max-w-2xl text-lg text-slate-400">
                    Create your free account and join your campus marketplace today. It only takes a minute!
                 </p>
                 <div className="mt-8">
                     <Button onClick={onGetStarted} variant="primary" className="px-8 py-4 text-lg">
                        {isLoggedIn ? 'Explore Now' : 'Sign Up for Free'}
                    </Button>
                 </div>
             </div>
        </section>
    </>
  );
});