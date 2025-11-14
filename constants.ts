import { Currency, ItemCondition } from './types';

export const CATEGORIES = [
  'All',
  'Digital Art',
  'VR/AR Assets',
  'UI Kits',
  'Code Scripts',
  '3D Models',
  'Synthwave Tracks',
];

export const SCHOOL_LEVELS = [
  'Primary School',
  'Middle School',
  'High School',
  'College',
];

export const GRADE_LEVELS_BY_SCHOOL: { [key: string]: string[] } = {
  'Primary School': ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade'],
  'Middle School': ['6th Grade', '7th Grade', '8th Grade'],
  'High School': ['9th Grade (Freshman)', '10th Grade (Sophomore)', '11th Grade (Junior)', '12th Grade (Senior)'],
  'College': [
    'Freshman',
    'Sophomore',
    'Junior',
    'Senior',
    'Graduate Student',
    'PhD Candidate',
  ],
};

export const ITEM_CONDITIONS: ItemCondition[] = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'];

export const CURRENCY_CONVERSION_RATE = 83; // 1 USD = 83 INR

export const formatPrice = (priceInr: number, currency: Currency) => {
    if (currency === 'USD') {
        return `$${(priceInr / CURRENCY_CONVERSION_RATE).toFixed(2)}`;
    }
    return `₹${priceInr.toFixed(0)}`;
};