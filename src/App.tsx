import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Search, Tag, Shield, Zap, ShoppingCart, Database, Play, StopCircle, RefreshCw } from 'lucide-react';
import { runAgents } from './services/gemini';

const AGENTS = [
  { id: 1, name: 'Market Research', icon: Search, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  { id: 2, name: 'Pricing Analyst', icon: Tag, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  { id: 3, name: 'Quality Analyst', icon: Shield, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  { id: 4, name: 'Conversion Opt', icon: Zap, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  { id: 5, name: 'Orchestrator', icon: BrainCircuit, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20' },
];

export default function App() {
  const [query, setQuery] = useState('Best budget noise cancelling headphones under $100 for commuting');
  const [products, setProducts] = useState(JSON.stringify([
    {
      "name": "Soundcore Anker Life Q20",
      "price": 59.99,
      "rating": 4.5,
      "reviews": 56000,
      "features": ["Active Noise Cancellation", "40H Playtime", "Hi-Res Audio"],
      "commission_rate": "4%"
    },
    {
      "name": "Sony WH-CH720N",
      "price": 98.00,
      "rating": 4.3,
      "reviews": 4200,
      "features": ["Noise Canceling", "Up to 35 Hours Battery", "Lightweight"],
      "commission_rate": "3%"
    },
    {
      "name": "JBL Tune 760NC",
      "price": 99.95,
      "rating": 4.4,
      "reviews": 12000,
      "features": ["Active Noise Cancelling", "35H Battery Limit", "Pure Bass Sound"],
      "commission_rate": "4.5%"
    }
  ], null, 2));
  
  const [isRunning, setIsRunning] = useState(false);
  const [activeAgent, setActiveAgent] = useState<number>(0);
  const [result, setResult] = useState('');

  const executeAnalysis = async () => {
    setIsRunning(true);
    setResult('');
    
    // Simulate agents waking up sequentially
    for (let i = 1; i <= 5; i++) {
        setActiveAgent(i);
        await new Promise(r => setTimeout(r, 500));
    }
    
    try {
        await runAgents(query, products, (text) => {
            setResult(text);
        });
    } catch (error) {
        console.error(error);
        setResult(`**System Error**: ${error instanceof Error ? error.message : String(error)}\n\nPlease ensure your Gemini API key is properly configured.`);
    } finally {
        setIsRunning(false);
        setActiveAgent(0);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0C10] text-slate-300 overflow-hidden font-sans">
      
      {/* LEFT PANEL: CONFIGURATION */}
      <div className="w-[400px] flex-shrink-0 border-r border-zinc-800/60 bg-[#0F1115] flex flex-col z-10 shadow-xl overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/60">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <ShoppingCart className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase">
              Product Intelligence<br/><span className="text-zinc-500 font-medium">Enterprise Engine</span>
            </h1>
          </div>
        </div>

        {/* Inputs */}
        <div className="p-6 flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              User Query
            </label>
            <textarea 
              className="bg-[#16181D] border border-zinc-800 text-sm text-zinc-200 rounded-lg p-3 h-24 resize-none focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium leading-relaxed"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. Best budget noise cancelling headphones..."
            />
          </div>

          <div className="flex flex-col gap-2 flex-1 min-h-0">
            <label className="text-xs uppercase tracking-wider font-semibold text-zinc-500 flex items-center gap-2">
              <Database className="w-3.5 h-3.5" />
              Product Dataset (JSON / CSV)
            </label>
            <textarea 
              className="bg-[#16181D] border border-zinc-800 text-xs text-zinc-300 rounded-lg p-4 flex-1 resize-none focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono leading-relaxed whitespace-pre"
              value={products}
              onChange={e => setProducts(e.target.value)}
              spellCheck="false"
            />
          </div>
        </div>

        {/* Action Bottom */}
        <div className="p-6 bg-[#0B0C10] border-t border-zinc-800/60 mt-auto">
          <button 
            onClick={executeAnalysis}
            disabled={isRunning || !query || !products}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.15)] hover:shadow-[0_0_25px_rgba(79,70,229,0.3)]"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Processing Engine...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Initialize Multi-Agent Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: EXECUTION & RESULTS */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-[#0C0D10]">
        
        {/* Agent Activity Header (HUD) */}
        <div className="h-24 border-b border-zinc-800/60 bg-[#0F1115]/50 flex items-center px-8 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-6 w-full justify-between max-w-4xl mx-auto">
            {AGENTS.map((agent, index) => {
              const Icon = agent.icon;
              const isActive = isRunning && (activeAgent >= agent.id);
              const isPulsing = isRunning && activeAgent === agent.id;
              
              return (
                <div key={agent.id} className="flex items-center gap-4 relative">
                  {/* Connector Line */}
                  {index < AGENTS.length - 1 && (
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-zinc-800">
                      <div 
                        className="h-full bg-indigo-500/50 transition-all duration-1000"
                        style={{ width: isActive ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 ${isActive ? `${agent.bg} ${agent.border}` : 'bg-zinc-900/50 border-zinc-800'} relative`}>
                      {isPulsing && (
                         <div className={`absolute inset-0 rounded-xl border border-current ${agent.color} opacity-40 animate-ping`} />
                      )}
                      <Icon className={`w-5 h-5 transition-all duration-500 ${isActive ? agent.color : 'text-zinc-600'}`} />
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-widest text-center transition-colors duration-500 ${isActive ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {agent.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto px-8 py-10 relative">
          
          {/* Empty State */}
          {!result && !isRunning && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 max-w-md mx-auto text-center">
              <BrainCircuit className="w-16 h-16 opacity-20 mb-6 text-zinc-500" />
              <h3 className="text-zinc-400 font-medium mb-2">Systems Standing By</h3>
              <p className="text-sm">Enter a query and product dataset, then initialize the multi-agent framework to generate a comprehensive enterprise report.</p>
            </div>
          )}

          {/* Markdown Output */}
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-[#14161B] border border-zinc-800/80 rounded-2xl p-8 md:p-12 shadow-2xl">
                <div className="markdown-body">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>

    </div>
  );
}
