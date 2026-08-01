import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FiX, FiCheckCircle, FiShield, FiTag, FiAward, FiTrendingUp, FiCreditCard, FiCheck, FiArrowRight, FiArrowLeft, FiActivity 
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const PremiumUpgradeModal = ({ isOpen, onClose }) => {
  const { upgradeToPremium, isRecruiter } = useAuth();
  const [step, setStep] = useState(1); // 1 = Selection/Coupon, 2 = Payment form, 3 = Processing/Success
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Payment Details State
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'upi'
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardName, setCardName] = useState('Test User');
  const [upiId, setUpiId] = useState('talentai@okaxis');

  // Processing steps simulation
  const [processingMsg, setProcessingMsg] = useState('Connecting to gateway...');

  if (!isOpen) return null;

  const cost = isRecruiter ? '₹1,999' : '₹149';
  const planName = isRecruiter ? 'Recruiter Premium' : 'Candidate Premium';

  const resetModalState = () => {
    setStep(1);
    setCouponCode('');
    setLoading(false);
  };

  const handleClose = () => {
    resetModalState();
    onClose();
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.warn('Please enter a coupon code.');
      return;
    }
    setLoading(true);
    try {
      await upgradeToPremium(couponCode.trim());
      toast.success('Congratulations! Coupon code applied successfully.');
      setStep(3);
      setProcessingMsg('Success');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      toast.error(err || 'Invalid coupon code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    setStep(2);
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStep(3);
    
    // Simulate payment steps
    setProcessingMsg('Connecting to payment gateway...');
    
    setTimeout(() => {
      setProcessingMsg('Authorizing transaction...');
      
      setTimeout(() => {
        setProcessingMsg('Finalizing premium subscription...');
        
        setTimeout(async () => {
          try {
            // Call backend without a coupon code since payment is mock-completed successfully
            await upgradeToPremium('');
            setProcessingMsg('Success');
            toast.success(`${planName} subscription activated successfully!`);
            
            setTimeout(() => {
              handleClose();
            }, 2000);
          } catch (err) {
            toast.error(err || 'Failed to activate premium. Please try again.');
            setStep(2);
            setLoading(false);
          }
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-[32px] shadow-2xl p-6 md:p-8 overflow-hidden backdrop-blur-2xl transition-all duration-300">
        
        {/* Decorative background glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 dark:bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/10 dark:bg-secondary-container/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={handleClose}
          disabled={loading && step === 3}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all text-on-surface-variant dark:text-slate-300 hover:scale-105"
        >
          <FiX className="text-xl" />
        </button>

        {/* STEP 1: Feature Overview & Coupon */}
        {step === 1 && (
          <div className="space-y-6 relative">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-gradient-primary rounded-2xl text-white shadow-lg shadow-primary/20">
                <FiAward className="text-2xl" />
              </div>
              <h2 className="font-headline-lg text-2xl font-extrabold text-on-background dark:text-white leading-tight">
                Upgrade to <span className="text-primary dark:text-inverse-primary font-extrabold">TalentAI Premium</span>
              </h2>
              <p className="font-body-sm text-xs text-outline dark:text-slate-400 max-w-sm mx-auto">
                Supercharge your career matching and intelligence capabilities with cognitive AI.
              </p>
            </div>

            {/* Price Banner */}
            <div className="bg-primary/5 dark:bg-primary-container/10 border border-primary/25 rounded-2xl p-4 text-center space-y-1">
              <span className="text-xs font-semibold text-outline dark:text-slate-400 uppercase tracking-widest block">Premium Plan Price</span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-extrabold text-primary dark:text-inverse-primary">{cost}</span>
                <span className="text-xs text-outline dark:text-slate-400">/ Month</span>
              </div>
            </div>

            {/* Features Card list */}
            <div>
              {/* Candidate Tier */}
              {!isRecruiter ? (
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-outline-variant/30 dark:border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-primary dark:text-inverse-primary font-bold text-xs uppercase tracking-wider">
                    <FiShield /> Candidate Superpowers
                  </div>
                  
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5 text-[11px] text-on-surface-variant dark:text-slate-300 leading-snug">
                      <FiCheckCircle className="text-primary text-sm flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-on-background dark:text-white font-semibold">AI Resume Optimizer</strong>
                        Benchmark matches, isolate keyword gaps, and reorder core skills for top tech companies.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 text-[11px] text-on-surface-variant dark:text-slate-300 leading-snug">
                      <FiCheckCircle className="text-primary text-sm flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-on-background dark:text-white font-semibold">AI Career Roadmap</strong>
                        Generate timeline curricula mapping weekly study tasks, certs, and portfolio projects.
                      </div>
                    </li>
                  </ul>
                </div>
              ) : (
                /* Recruiter Tier */
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-outline-variant/30 dark:border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-secondary dark:text-secondary-fixed-dim font-bold text-xs uppercase tracking-wider">
                    <FiTrendingUp /> Recruiter Analytics
                  </div>
                  
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5 text-[11px] text-on-surface-variant dark:text-slate-300 leading-snug">
                      <FiCheckCircle className="text-secondary text-sm flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-on-background dark:text-white font-semibold">AI Job Description Matcher</strong>
                        Paste job descriptions to rank all candidates in your pool instantly by match quotients.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5 text-[11px] text-on-surface-variant dark:text-slate-300 leading-snug">
                      <FiCheckCircle className="text-secondary text-sm flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-on-background dark:text-white font-semibold">AI Candidate Comparison</strong>
                        Contrast up to 3 candidate profiles side-by-side on radar grids and get winner recommendations.
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button 
              onClick={handleProceedToPayment}
              className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3 rounded-xl hover:shadow-lg transition-all hover:scale-95 text-sm flex items-center justify-center gap-2"
            >
              Proceed to Payment ({cost}) <FiArrowRight />
            </button>

            {/* Coupon Code Alternative */}
            <div className="pt-4 border-t border-outline-variant/20 space-y-2">
              <span className="text-[10px] font-bold text-outline dark:text-slate-500 uppercase tracking-widest text-center block">Have a coupon code?</span>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="ENTER PROMO CODE" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-lg text-xs font-semibold text-on-background dark:text-white focus:outline-none uppercase"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-on-background dark:text-white font-bold px-4 rounded-lg text-xs"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        )}

        {/* STEP 2: Checkout Mock Payment Page */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            {/* Back Button */}
            <button 
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs text-primary dark:text-inverse-primary hover:underline"
            >
              <FiArrowLeft /> Back to pricing
            </button>

            {/* Header */}
            <div className="space-y-1">
              <h3 className="font-headline-sm text-lg font-extrabold text-on-background dark:text-white flex items-center gap-2">
                <FiCreditCard className="text-primary" /> Secure Checkout
              </h3>
              <p className="text-xs text-outline dark:text-slate-400">Complete payment to instantly unlock Premium advantages.</p>
            </div>

            {/* Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-outline-variant/20 flex justify-between items-center">
              <div>
                <strong className="block text-xs text-on-background dark:text-white font-bold">{planName}</strong>
                <span className="text-[10px] text-outline dark:text-slate-400">Monthly Billing</span>
              </div>
              <span className="text-lg font-black text-primary dark:text-inverse-primary">{cost}</span>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex border-b border-outline-variant/20">
              <button 
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 pb-2 text-xs font-bold border-b-2 text-center transition-colors ${
                  paymentMethod === 'card' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-outline dark:text-slate-400'
                }`}
              >
                Credit / Debit Card
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 pb-2 text-xs font-bold border-b-2 text-center transition-colors ${
                  paymentMethod === 'upi' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-outline dark:text-slate-400'
                }`}
              >
                UPI Payment
              </button>
            </div>

            {/* Payment Forms */}
            <form onSubmit={handlePayNow} className="space-y-4">
              {paymentMethod === 'card' ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-outline dark:text-slate-400 uppercase tracking-wide">Card Number</label>
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4111 2222 3333 4444" 
                      required
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-primary text-on-background dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-outline dark:text-slate-400 uppercase tracking-wide">Expiry Date</label>
                      <input 
                        type="text" 
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY" 
                        required
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-primary text-on-background dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-outline dark:text-slate-400 uppercase tracking-wide">CVV</label>
                      <input 
                        type="password" 
                        maxLength="3"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123" 
                        required
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-primary text-on-background dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-outline dark:text-slate-400 uppercase tracking-wide">Name on Card</label>
                    <input 
                      type="text" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Cardholder Name" 
                      required
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-primary text-on-background dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 py-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-outline dark:text-slate-400 uppercase tracking-wide">UPI ID / VPA</label>
                    <input 
                      type="text" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. name@upi" 
                      required
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-outline-variant/40 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-primary text-on-background dark:text-white"
                    />
                  </div>
                  <p className="text-[10px] text-outline dark:text-slate-500 leading-normal">
                    Enter your UPI ID and click Pay. You will receive a mock notification to approve the transaction.
                  </p>
                </div>
              )}

              {/* Pay Button */}
              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3 rounded-xl hover:shadow-lg transition-all hover:scale-95 text-xs flex items-center justify-center gap-1.5 mt-2"
              >
                Pay securely {cost}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: Processing & Success */}
        {step === 3 && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center animate-fade-in">
            {processingMsg !== 'Success' ? (
              <>
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <FiActivity className="absolute inset-0 m-auto text-primary text-xl animate-pulse-soft" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-on-background dark:text-white">Processing Secure Payment</h3>
                  <p className="text-xs text-outline dark:text-slate-400 animate-pulse">{processingMsg}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center shadow-lg border border-emerald-500/20 animate-scale-up">
                  <FiCheck className="text-3xl font-black" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-emerald-500">Payment Successful!</h3>
                  <p className="text-xs text-outline dark:text-slate-400">{planName} activated.</p>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default PremiumUpgradeModal;
