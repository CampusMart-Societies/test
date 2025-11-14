import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Item, ItemType, ItemCondition } from '../types';
import { Button } from './Button';
import { XMarkIcon, SparklesIcon, SpinnerIcon, ArrowUpTrayIcon, CameraIcon } from './icons/Icons';
import { CATEGORIES, ITEM_CONDITIONS } from '../constants';

interface ListItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem?: (item: Omit<Item, 'id' | 'postedDate' | 'seller' | 'sellerId'>) => void;
  onUpdateItem?: (item: Item) => void;
  itemToEdit?: Item | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MAX_DESC_LENGTH = 500;

export const ListItemModal: React.FC<ListItemModalProps> = React.memo(({ isOpen, onClose, onAddItem, onUpdateItem, itemToEdit, showToast }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<string[]>([]);
  const [type, setType] = useState(ItemType.SALE);
  const [condition, setCondition] = useState<ItemCondition>('New');
  const [imageUrl, setImageUrl] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEditMode = !!itemToEdit;

  useEffect(() => {
    if (isEditMode && itemToEdit) {
        setTitle(itemToEdit.title);
        setDescription(itemToEdit.description);
        setPrice(itemToEdit.price.toString());
        setCategory(itemToEdit.category);
        setType(itemToEdit.type);
        setCondition(itemToEdit.condition);
        setImageUrl(itemToEdit.imageUrl);
        setIsNegotiable(itemToEdit.isNegotiable ?? false);
    } else {
        // Reset form when closing or switching to "add" mode
        setTitle('');
        setDescription('');
        setPrice('');
        setCategory([]);
        setType(ItemType.SALE);
        setCondition('New');
        setImageUrl('');
        setIsNegotiable(false);
    }
  }, [itemToEdit, isEditMode, isOpen]);


  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        showToast('Invalid file type. Please upload a JPG, PNG, or WEBP.');
        e.target.value = '';
        return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeInBytes) {
        showToast('File is too large. Maximum size is 2MB.');
        e.target.value = '';
        return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
        setImageUrl(reader.result as string);
        showToast('Image uploaded successfully!', 'success');
    };
    reader.onerror = () => {
        showToast('Failed to read the file.');
    }
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCategoryToggle = (cat: string) => {
    setCategory(prev => 
        prev.includes(cat) 
            ? prev.filter(c => c !== cat) 
            : [...prev, cat]
    );
  };


  const handleGenerateImage = async () => {
    if (!title) {
      showToast('Please enter a title first to generate an image.');
      return;
    }
    setIsGeneratingImage(true);
    try {
      const prompt = `A visually appealing, high-quality placeholder image for a marketplace listing. The item is in the category "${category.join(', ')}". The item is titled "${title}". A brief description is: "${description}". The image should be clean, modern, and suitable for an e-commerce platform. Do not include any text in the image.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          const generatedImageUrl = `data:image/png;base64,${base64ImageBytes}`;
          setImageUrl(generatedImageUrl);
          showToast('Image generated successfully!', 'success');
          return;
        }
      }
      throw new Error("No image data returned from API.");

    } catch (error) {
      console.error('Error generating image:', error);
      showToast('Failed to generate image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || !imageUrl) {
        showToast("Please fill out all fields.");
        return;
    }
     if (category.length === 0) {
        showToast("Please select at least one category.");
        return;
    }

    if (isEditMode && onUpdateItem && itemToEdit) {
        const updatedItem: Item = {
            ...itemToEdit,
            title,
            description,
            price: parseFloat(price),
            category,
            type,
            condition,
            imageUrl,
            isNegotiable,
        };
        onUpdateItem(updatedItem);
    } else if (!isEditMode && onAddItem) {
        const newItem = {
          title,
          description,
          price: parseFloat(price),
          category,
          type,
          condition,
          imageUrl,
          isNegotiable,
        };
        onAddItem(newItem);
    }
    onClose();
  };

  const formInputClass = "mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500";
  const formLabelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300";
  const optionClass = "text-slate-800 bg-white dark:text-slate-100 dark:bg-slate-800";

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isEditMode ? 'Edit Item' : 'Forge a New Item'}</h2>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className={formLabelClass}>Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className={formInputClass} required />
          </div>
          <div>
            <label htmlFor="description" className={formLabelClass}>Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className={formInputClass} rows={3} required maxLength={MAX_DESC_LENGTH}></textarea>
            <p className={`text-xs text-right mt-1 ${description.length > MAX_DESC_LENGTH - 20 ? (description.length >= MAX_DESC_LENGTH ? 'text-red-500' : 'text-yellow-500') : 'text-slate-400 dark:text-slate-500'}`}>
                {description.length} / {MAX_DESC_LENGTH}
            </p>
          </div>
          <div>
            <label className={formLabelClass}>Item Image</label>
             <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button type="button" variant="secondary" onClick={handleUploadClick} className="w-full">
                    <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                    Upload Image
                </Button>
                <Button type="button" variant="secondary" onClick={handleGenerateImage} disabled={isGeneratingImage} className="w-full">
                    {isGeneratingImage ? <SpinnerIcon className="h-5 w-5 mr-2" /> : <SparklesIcon className="h-5 w-5 mr-2" />}
                    Generate with AI
                </Button>
            </div>
             <input 
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="hidden"
            />
            {imageUrl ? (
                <div className="mt-4">
                    <label className={formLabelClass}>Image Preview</label>
                    <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-center items-center">
                        <img src={imageUrl} alt="Current item image" className="max-h-64 w-auto object-contain rounded-md" />
                    </div>
                </div>
            ) : (
                 <div className="mt-4 flex justify-center items-center h-48 bg-slate-100 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
                    <div className="text-center text-slate-400 dark:text-slate-500">
                        <CameraIcon className="h-12 w-12 mx-auto" />
                        <p className="mt-2 text-sm">Upload or generate an image</p>
                    </div>
                </div>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Max 2MB (JPG, PNG, WEBP).</p>
          </div>
           <div>
              <label htmlFor="price" className={formLabelClass}>Price (₹)</label>
              <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className={formInputClass} min="0" step="0.01" required />
            </div>
            <div>
              <label className={formLabelClass}>Category (select one or more)</label>
              <div className="mt-2 flex flex-wrap gap-2">
                  {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryToggle(cat)}
                          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${
                              category.includes(cat)
                                  ? 'bg-primary-500 text-white'
                                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                          }`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="condition" className={formLabelClass}>Condition</label>
              <select id="condition" value={condition} onChange={e => setCondition(e.target.value as ItemCondition)} className={formInputClass}>
                {ITEM_CONDITIONS.map(cond => <option key={cond} value={cond} className={optionClass}>{cond}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <span className={formLabelClass}>Listing Type</span>
              <div className="mt-2 flex gap-4">
                <div className="flex items-center">
                  <input id="type-sale" name="type" type="radio" checked={type === ItemType.SALE} onChange={() => setType(ItemType.SALE)} className="h-4 w-4 text-primary-600 bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-primary-500" />
                  <label htmlFor="type-sale" className="ml-2 block text-sm text-slate-800 dark:text-slate-100">{ItemType.SALE}</label>
                </div>
                <div className="flex items-center">
                  <input id="type-rent" name="type" type="radio" checked={type === ItemType.RENT} onChange={() => setType(ItemType.RENT)} className="h-4 w-4 text-primary-600 bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-primary-500" />
                  <label htmlFor="type-rent" className="ml-2 block text-sm text-slate-800 dark:text-slate-100">{ItemType.RENT}</label>
                </div>
              </div>
            </div>
             <div className="flex items-end pb-1 md:justify-end">
                <div className="flex items-center">
                    <input
                        id="isNegotiable"
                        name="isNegotiable"
                        type="checkbox"
                        checked={isNegotiable}
                        onChange={e => setIsNegotiable(e.target.checked)}
                        className="h-4 w-4 text-primary-600 bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-primary-500 rounded"
                    />
                    <label htmlFor="isNegotiable" className="ml-2 block text-sm text-slate-800 dark:text-slate-100">
                        Price is negotiable
                    </label>
                </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">{isEditMode ? 'Save Changes' : 'Forge Item'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
});