import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { XMarkIcon, SparklesIcon, SpinnerIcon } from './icons/Icons';
import { Button } from './Button';

interface MartBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const MartBotModal: React.FC<MartBotModalProps> = ({ isOpen, onClose }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are MartBot, a friendly and helpful AI assistant for Campusmart, a student marketplace. Your goal is to help students find items, understand how to use the platform, and answer questions about listings. Keep your answers concise and friendly. Start the conversation with a greeting and ask how you can help.',
        },
      });
      setChat(newChat);
      setMessages([]); // Clear previous messages
      setIsLoading(true);

      // Start the conversation with a greeting from the bot
      const sendInitialMessage = async () => {
        if (!newChat) return;
        try {
            // Send a message to trigger the greeting based on system instruction
            const response = await newChat.sendMessageStream({ message: "Introduce yourself." });
            let botResponse = '';
            // Pre-add an empty model message to be populated by the stream
            setMessages([{ role: 'model', text: '' }]); 
            for await (const chunk of response) {
                botResponse += chunk.text;
                setMessages(prev => {
                    if (prev.length > 0) {
                        const newMessages = [...prev];
                        newMessages[0].text = botResponse;
                        return newMessages;
                    }
                    return [{role: 'model', text: botResponse}];
                });
            }
        } catch (error) {
            console.error('Error sending initial message:', error);
            setMessages([{ role: 'model', text: 'Sorry, I\'m having trouble connecting. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
      };
      sendInitialMessage();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessageStream({ message: currentInput });
      let botResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      for await (const chunk of response) {
        botResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = botResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Oops! Something went wrong.' }]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className={`fixed bottom-24 right-6 z-[60] w-[90vw] max-w-sm h-[60vh] max-h-[500px] flex flex-col transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full h-full overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800/50">
        <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-primary-500 dark:text-primary-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">MartBot Assistant</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>

        <main className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary-500 text-white rounded-br-lg'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-bl-lg'
                }`}
              >
                {msg.text.split('\n').map((line, i) => <p key={i}>{line || '\u00A0'}</p>)}
              </div>
            </div>
          ))}
          {isLoading && (!messages.length || messages[messages.length-1]?.role === 'user') && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg flex items-center gap-2">
                <SpinnerIcon className="h-4 w-4" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about items, pricing..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="!py-2.5 !px-4">
              Send
            </Button>
          </form>
        </footer>
      </div>
    </div>
  );
};