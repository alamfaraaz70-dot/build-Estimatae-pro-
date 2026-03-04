
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';

interface PaymentModalProps {
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

const PaymentModal: React.FC<PaymentModalProps> = ({ project, onClose, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { id: 'wallets', label: 'Wallets', icon: 'fa-wallet' },
    { id: 'cards', label: 'Add credit or debit cards', icon: 'fa-credit-card' },
    { id: 'netbanking', label: 'Netbanking', icon: 'fa-university' },
    { id: 'upi', label: 'UPI', icon: 'fa-mobile-alt' },
    { id: 'cash', label: 'Cash', icon: 'fa-money-bill-wave' },
    { id: 'paylater', label: 'Pay Later', icon: 'fa-clock' },
  ];

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  const tokenAmount = project.estimates?.[0]?.tokenAmount || 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Select Payment Method</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <i className="fas fa-times-circle text-2xl"></i>
            </button>
          </div>

          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount to Pay</p>
              <p className="text-2xl font-black text-construction-slate">{formatCurrency(tokenAmount)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Site ID</p>
              <p className="text-xs font-black text-slate-600">{project.id.toUpperCase()}</p>
            </div>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div 
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`group cursor-pointer border-2 rounded-2xl p-5 transition-all flex items-center justify-between ${
                  selectedMethod === method.id 
                  ? 'border-construction-yellow bg-construction-yellow/5 shadow-md' 
                  : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    selectedMethod === method.id ? 'bg-construction-yellow text-construction-slate' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <i className={`fas ${method.icon} text-lg`}></i>
                  </div>
                  <span className={`font-black uppercase tracking-wide text-sm ${
                    selectedMethod === method.id ? 'text-construction-slate' : 'text-slate-600'
                  }`}>
                    {method.label}
                  </span>
                </div>
                <i className={`fas fa-chevron-right text-xs transition-transform ${
                  selectedMethod === method.id ? 'text-construction-slate rotate-90' : 'text-slate-300'
                }`}></i>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {selectedMethod && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8"
              >
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-construction-slate text-construction-yellow py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Processing Secure Payment...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shield-alt"></i>
                      Confirm & Pay {formatCurrency(tokenAmount)}
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase mt-4 tracking-widest">
                  <i className="fas fa-lock mr-2"></i>
                  256-bit SSL Secure Encryption
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
