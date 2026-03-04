
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, CreditCard, Wallet, Landmark, Smartphone, Banknote, Clock, X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (method: string) => void;
  amount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSelect, amount }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'wallets', label: 'Wallets', icon: <Wallet className="w-5 h-5" /> },
    { id: 'cards', label: 'Add credit or debit cards', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'netbanking', label: 'Netbanking', icon: <Landmark className="w-5 h-5" /> },
    { id: 'upi', label: 'UPI', icon: <Smartphone className="w-5 h-5" /> },
    { id: 'cash', label: 'Cash', icon: <Banknote className="w-5 h-5" /> },
    { id: 'paylater', label: 'Pay Later', icon: <Clock className="w-5 h-5" /> },
  ];

  const banks = [
    { id: 'hdfc', name: 'HDFC', logo: 'https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/60d84420-942f-482f-871d-53a53077755f?', color: 'bg-blue-900' },
    { id: 'kotak', name: 'Kotak', logo: 'https://www.kotak.com/content/dam/Kotak/kotak-logo.png', color: 'bg-red-600' },
    { id: 'icici', name: 'ICICI', logo: 'https://www.icicibank.com/content/dam/icicibank/india/managed-assets/images/logo/icici-bank-logo.png', color: 'bg-orange-600' },
    { id: 'sbi', name: 'SBI', logo: 'https://www.sbi.co.in/o/sbi-themes/images/logo.png', color: 'bg-blue-500' },
    { id: 'axis', name: 'Axis', logo: 'https://www.axisbank.com/assets/images/logo.png', color: 'bg-rose-800' },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Payment Method</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Token Amount: {formatCurrency(amount)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {paymentMethods.map((method) => (
            <div key={method.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === method.id ? null : method.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-slate-400 group-hover:text-construction-slate transition-colors">
                    {method.icon}
                  </div>
                  <span className="text-lg font-bold text-slate-800 tracking-tight">{method.label}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${expanded === method.id ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {expanded === method.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-slate-50 border-t border-slate-100"
                  >
                    {method.id === 'cards' ? (
                      <div className="p-4">
                        <div className="border-2 border-teal-500/30 rounded-xl p-4 bg-white shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-5 h-5 rounded-full border-2 border-teal-500 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 bg-teal-500 rounded-full" />
                            </div>
                            <span className="font-bold text-slate-700 text-sm">Add Debit / Credit / ATM Card</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-6">
                            {['VISA', 'Mastercard', 'RuPay', 'Pluxee', 'AMEX', 'Diners'].map((logo) => (
                              <div key={logo} className="px-2 py-1 border border-slate-200 rounded text-[10px] font-black text-slate-400 bg-slate-50">
                                {logo}
                              </div>
                            ))}
                          </div>

                          <div className="space-y-4">
                            <input 
                              type="text" 
                              placeholder="Name on Card" 
                              className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:border-teal-500 outline-none transition-all"
                            />
                            <input 
                              type="text" 
                              placeholder="Card Number" 
                              className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:border-teal-500 outline-none transition-all font-mono"
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <input 
                                type="text" 
                                placeholder="Expiry Date (MM/YY)" 
                                className="p-3 border border-slate-200 rounded-lg text-sm focus:border-teal-500 outline-none transition-all"
                              />
                              <input 
                                type="password" 
                                placeholder="CVV" 
                                className="p-3 border border-slate-200 rounded-lg text-sm focus:border-teal-500 outline-none transition-all"
                              />
                            </div>
                            <input 
                              type="text" 
                              placeholder="Nickname for card (Optional)" 
                              className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:border-teal-500 outline-none transition-all"
                            />
                          </div>

                          <button 
                            onClick={() => onSelect('cards')}
                            className="w-full mt-6 bg-[#558B2F] hover:bg-[#33691E] text-white py-4 rounded-lg font-bold text-lg transition-all shadow-md"
                          >
                            Checkout
                          </button>

                          <div className="mt-4">
                            <p className="text-[10px] text-slate-500 leading-tight">
                              We accept Credit and Debit Cards from Visa, Mastercard, Rupay, Pluxee, American Express & Diners.
                            </p>
                            <div className="flex gap-4 mt-3 opacity-50">
                              <div className="text-[10px] font-black border border-slate-300 px-1 rounded">PCI DSS</div>
                              <div className="text-[10px] font-black border border-slate-300 px-1 rounded italic text-blue-800">Verified by VISA</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : method.id === 'netbanking' ? (
                      <div className="p-4 bg-white">
                        <div className="grid grid-cols-4 gap-3 mb-6">
                          {banks.map((bank) => (
                            <button
                              key={bank.id}
                              onClick={() => {
                                setSelectedBank(bank.id);
                                onSelect(`netbanking_${bank.id}`);
                              }}
                              className={`relative group flex flex-col items-center justify-center p-4 border rounded-2xl transition-all aspect-square bg-white ${selectedBank === bank.id ? 'border-construction-yellow shadow-md' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                              <div className="absolute top-2 right-2">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedBank === bank.id ? 'bg-construction-yellow border-construction-yellow' : 'border-slate-200 bg-white'}`}>
                                  {selectedBank === bank.id && (
                                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-none stroke-current stroke-[4]">
                                      <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <div className="w-12 h-12 flex items-center justify-center mb-3">
                                <img 
                                  src={bank.logo} 
                                  alt={bank.name} 
                                  className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    // Fallback if logo fails
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${bank.name}&background=random&color=fff&bold=true`;
                                  }}
                                />
                              </div>
                              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{bank.name}</span>
                            </button>
                          ))}
                        </div>
                        
                        <div className="relative">
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <i className="fas fa-search text-slate-300 text-sm"></i>
                          </div>
                          <button className="w-full p-4 pl-10 pr-10 border border-slate-100 rounded-2xl text-left flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <span className="text-sm font-bold text-slate-300 uppercase tracking-widest group-hover:text-slate-500 transition-colors">All Banks</span>
                            <ChevronDown className="w-4 h-4 text-slate-300" />
                          </button>
                        </div>
                      </div>
                    ) : method.id === 'upi' ? (
                      <div className="p-6 bg-white">
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-1">Scan QR to pay</h3>
                          <p className="text-sm text-slate-500 font-medium">Use any UPI app on your phone to scan and pay</p>
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                          <div className="flex gap-2">
                            <div className="px-3 py-1.5 border border-slate-200 rounded-lg flex items-center gap-2 bg-white shadow-sm">
                              <img src="https://www.gstatic.com/images/branding/product/1x/gpay_64dp.png" alt="GPay" className="w-4 h-4" referrerPolicy="no-referrer" />
                              <span className="text-[10px] font-bold text-slate-600">Pay</span>
                            </div>
                            <div className="px-3 py-1.5 border border-slate-200 rounded-lg flex items-center gap-2 bg-white shadow-sm">
                              <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center text-[8px] text-white font-bold">पे</div>
                              <span className="text-[10px] font-bold text-slate-600">PhonePe</span>
                            </div>
                            <div className="px-3 py-1.5 border border-slate-200 rounded-lg flex items-center gap-2 bg-white shadow-sm">
                              <span className="text-[10px] font-black text-blue-500 italic">Paytm</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or others</span>
                        </div>

                        <div className="relative aspect-square max-w-[280px] mx-auto bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center overflow-hidden group">
                          {/* QR Code Pattern Placeholder */}
                          <div className="absolute inset-0 opacity-20 grid grid-cols-10 gap-1 p-4">
                            {Array.from({ length: 100 }).map((_, i) => (
                              <div key={i} className={`aspect-square rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`} />
                            ))}
                          </div>
                          
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl mb-6 shadow-2xl">
                              <Smartphone className="w-12 h-12 text-white opacity-80" />
                            </div>
                            <button 
                              onClick={() => onSelect('upi_qr')}
                              className="bg-[#E53935] hover:bg-[#C62828] text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-xl hover:scale-105 active:scale-95"
                            >
                              Generate QR
                            </button>
                          </div>

                          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">
                            <span className="text-[8px] font-black text-white uppercase tracking-widest">UPI</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 flex flex-col items-center text-center">
                        <p className="text-sm text-slate-500 font-medium mb-4">Secure payment gateway for {method.label}</p>
                        <button 
                          onClick={() => onSelect(method.id)}
                          className="w-full bg-construction-slate text-construction-yellow py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                        >
                          Proceed to Pay {formatCurrency(amount)}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <i className="fas fa-shield-alt mr-2"></i> 256-bit SSL Secured Payment
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
