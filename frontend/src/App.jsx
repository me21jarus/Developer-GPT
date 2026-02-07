import { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Loader2, User, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function App() {
  const [messages, setMessages] = useState([
    { role: 'model', text: "Ready to code. What's the plan?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', {
        message: userMessage
      });

      const reply = response.data.reply;
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Error: Could not connect to the backend. Is it running?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-mono overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <Terminal className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            DEV-GPT
          </h1>
          <p className="text-xs text-slate-500">Instructor Mode: Active</p>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "flex gap-4 max-w-3xl mx-auto",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-800 flex items-center justify-center shrink-0 mt-1">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div
                className={cn(
                  "p-4 rounded-2xl max-w-[80%] whitespace-pre-wrap shadow-lg",
                  msg.role === 'user'
                    ? "bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-tr-sm"
                    : "bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-tl-sm"
                )}
              >
                {msg.text}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-900/30 border border-blue-800 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 max-w-3xl mx-auto"
          >
            <div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-800 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-slate-900/50 border-t border-slate-800 backdrop-blur-md">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-end gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-700 focus-within:border-blue-500/50 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask a development question..."
            className="w-full bg-transparent border-none focus:ring-0 p-3 text-slate-200 placeholder:text-slate-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </footer>
    </div>
  );
}

export default App;
