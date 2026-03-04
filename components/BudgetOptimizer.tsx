import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ConstructionDetails, AiEstimateOption, OptimizationSuggestion } from '../types';
import { getBudgetOptimizations } from '../services/geminiService';

interface BudgetOptimizerProps {
  details: ConstructionDetails;
  currentEstimate: AiEstimateOption;
  targetBudget: number;
  onApply: (suggestion: OptimizationSuggestion) => void;
  onClose: () => void;
}

const BudgetOptimizer: React.FC<BudgetOptimizerProps> = ({
  details,
  currentEstimate,
  targetBudget,
  onApply,
  onClose
}) => {
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      const data = await getBudgetOptimizations(details, currentEstimate, targetBudget);
      setSuggestions(data);
      setLoading(false);
    };
    fetchSuggestions();
  }, [details, currentEstimate, targetBudget]);

  const currentTotal = currentEstimate.material + currentEstimate.labor;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-construction-slate text-white">
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">AI Budget Optimizer</h2>
            <p className="text-xs font-bold text-construction-yellow/80 uppercase tracking-widest">Bridging the gap: ₹{(currentTotal - targetBudget).toLocaleString()} over budget</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-construction-yellow border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-500 font-black uppercase italic text-sm animate-pulse">Analyzing cost-saving opportunities...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <i className="fas fa-exclamation-triangle text-4xl text-amber-500"></i>
              <p className="text-slate-600 font-bold">Could not generate optimizations. Please try again.</p>
              <button onClick={onClose} className="px-6 py-2 bg-slate-100 rounded-xl font-bold">Close</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestions.map((s) => (
                <div 
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col h-full ${
                    selectedId === s.id 
                      ? 'border-construction-yellow bg-construction-yellow/5 shadow-xl scale-[1.02]' 
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex-1">
                    <h3 className="font-black uppercase italic text-lg mb-2 leading-tight">{s.title}</h3>
                    <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">{s.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {s.changes.map((change, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[10px] font-bold text-slate-600">
                          <i className="fas fa-check-circle text-emerald-500 mt-0.5"></i>
                          <span>{change}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/50 mt-auto">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] font-black uppercase text-slate-400">New Cost</span>
                      <span className="text-xl font-black text-construction-slate">₹{s.optimizedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-emerald-500">Total Savings</span>
                      <span className="text-sm font-black text-emerald-600">₹{s.savings.toLocaleString()}</span>
                    </div>
                  </div>

                  {selectedId === s.id && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-construction-yellow rounded-full flex items-center justify-center shadow-lg">
                      <i className="fas fa-check text-construction-slate"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && suggestions.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-black uppercase text-slate-400">Selected Plan</p>
              <p className="font-black text-construction-slate italic">
                {selectedId ? suggestions.find(s => s.id === selectedId)?.title : 'Please select an option'}
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={onClose}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest text-slate-500 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={!selectedId}
                onClick={() => {
                  const selected = suggestions.find(s => s.id === selectedId);
                  if (selected) onApply(selected);
                }}
                className={`flex-1 sm:flex-none px-10 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${
                  selectedId 
                    ? 'bg-construction-slate text-construction-yellow hover:bg-black shadow-lg' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Apply & Regenerate
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BudgetOptimizer;
