import React from 'react';
import { StarIcon, UserCircleIcon } from '../icons/Icons';
import { Button } from '../Button';
import { Page } from '../../types';

interface TestimonialsPageProps {
    onNavigate: (page: Page) => void;
}

const testimonials = [
  {
    quote: "Great platform! Found exactly what I needed for my project and the seller was a fellow student.",
    name: 'Aarush Gandhi',
    rating: 5,
  },
  {
    quote: "Super easy to use. I sold my old textbook in just a few days without any hassle.",
    name: 'Divay Raj Chawla',
    rating: 5,
  },
  {
    quote: "Love that it's just for students. Makes trading on campus so much simpler and safer.",
    name: 'Tapish Narwat',
    rating: 4,
  },
   {
    quote: "The interface is clean and the AI tools are a nice touch. Helped me list my item quickly.",
    name: 'Adhiraj Sailesh',
    rating: 5,
  },
  {
    quote: "Found a great deal on a UI kit for my capstone project. Highly recommend!",
    name: 'Aarush Gandhi',
    rating: 5,
  },
  {
    quote: "Selling my digital art here has been a breeze. Made some extra cash this semester.",
    name: 'Vandit Jajoo',
    rating: 4,
  },
];

const stats = [
    { name: 'Active Users', value: '0' },
    { name: 'Items Sold', value: '0' },
    { name: 'Average Rating', value: '4.8 / 5' },
];

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onNavigate }) => {
    return (
        <>
            <section id="testimonials" className="py-20 lg:py-32 bg-slate-100 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                            What Our Students Are Saying
                        </h2>
                        <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                            Thousands of students are already using Campusmart. Here's what they think.
                        </p>
                    </div>

                    <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                        {stats.map((stat) => (
                            <div key={stat.name} className="text-center">
                                <p className="text-4xl font-extrabold text-primary-500 dark:text-primary-400">{stat.value}</p>
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">{stat.name}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                                    ))}
                                </div>
                                <blockquote className="mt-4 text-slate-600 dark:text-slate-300 flex-grow">
                                    <p>"{testimonial.quote}"</p>
                                </blockquote>
                                <figcaption className="mt-6 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                        <UserCircleIcon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                                    </div>
                                </figcaption>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
             <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Have a story to share?
                    </h2>
                    <p className="mt-3 mx-auto max-w-xl text-md text-slate-500 dark:text-slate-400">
                        We'd love to hear about your experience with Campusmart. Your feedback helps us grow and improve.
                    </p>
                    <div className="mt-8">
                        <Button onClick={() => onNavigate('contact')} variant="secondary">
                            Share Your Story
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
};