
import React, { useState, useRef, useEffect } from 'react';
import { askStemverse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { SendIcon, UserIcon, SparklesIcon, RefreshIcon } from '../components/icons';
import MarkdownRenderer from '../components/MarkdownRenderer';

const suggestedQuestions = [
    "Find scholarships for high school students in computer science",
    "Tell me about Dr. Mae Jemison",
    "What are some good resources for learning Python?"
];

const AskStemversePage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (messageToSend?: string) => {
    const currentInput = typeof messageToSend === 'string' ? messageToSend : input;
    if (currentInput.trim() === '' || isLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', text: currentInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = [...messages, userMessage];
    const responseText = await askStemverse(history.slice(0, -1), currentInput);
    
    const modelMessage: ChatMessage = { role: 'model', text: responseText };
    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto animate-fade-in-up">
      <div className="relative text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Ask STEMVerse</h1>
        <p className="text-gray-600">Your AI mentor for questions about STEM careers, challenges, and opportunities.</p>
         <button 
          onClick={handleClearChat}
          disabled={isLoading}
          className="absolute top-1/2 right-0 -translate-y-1/2 text-gray-500 hover:text-gray-900 disabled:opacity-50 transition-colors p-2"
          aria-label="Clear chat"
        >
          <RefreshIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-2xl p-4 md:p-6 space-y-6 border border-gray-200 shadow-inner no-scrollbar">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 h-full flex flex-col justify-center items-center p-4">
             <SparklesIcon className="w-16 h-16 mb-4 text-blue-400"/>
            <p className="font-medium text-lg text-gray-700">Welcome! How can I help you on your STEM journey?</p>
            <div className="mt-6 w-full max-w-lg">
                <p className="text-gray-500 mb-3 text-sm">Or try one of these prompts:</p>
                <div className="flex flex-col sm:flex-row gap-2">
                    {suggestedQuestions.slice(0, 3).map((q, i) => (
                        <button key={i} onClick={() => handleSend(q)} className="text-sm w-full text-left bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors text-gray-700">
                            {q}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-500 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white"/>
              </div>
            )}
            <div className={`max-w-xl p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none shadow-sm'}`}>
              {msg.role === 'model' ? <MarkdownRenderer content={msg.text} /> : <p className="whitespace-pre-wrap">{msg.text}</p>}
            </div>
             {msg.role === 'user' && (
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-gray-700"/>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-500 flex items-center justify-center">
               <SparklesIcon className="w-6 h-6 text-white"/>
            </div>
            <div className="max-w-xl p-4 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6">
        <div className="flex items-center bg-white rounded-full p-2 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="w-full bg-transparent px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || input.trim() === ''}
            className="p-3 rounded-full bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskStemversePage;