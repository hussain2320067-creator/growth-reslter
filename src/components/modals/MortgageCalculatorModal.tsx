import React, { useState, useMemo } from 'react';
import { X, Calculator, DollarSign, Percent, Calendar, PieChart, ShieldCheck } from 'lucide-react';
import { formatPKRPrice } from '../common/PropertyCard';

interface MortgageCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrice?: number;
}

export const MortgageCalculatorModal: React.FC<MortgageCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialPrice = 50000000 // Default 5 Crore PKR
}) => {
  const [propertyPrice, setPropertyPrice] = useState<number>(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(14.5); // Standard KIBOR + spread in Pakistan
  const [loanTermYears, setLoanTermYears] = useState<number>(20);

  const calculations = useMemo(() => {
    const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100;
    const principalLoan = Math.max(0, propertyPrice - downPaymentAmount);
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanTermYears * 12;

    let monthlyPayment = 0;
    if (monthlyRate > 0 && principalLoan > 0) {
      monthlyPayment =
        (principalLoan * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = Math.max(0, totalPayment - principalLoan);

    return {
      downPaymentAmount,
      principalLoan,
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest)
    };
  }, [propertyPrice, downPaymentPercent, interestRate, loanTermYears]);

  if (!isOpen) return null;

  return (
    <div
      id="mortgage-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="mortgage-modal-container"
        className="relative w-full max-w-2xl bg-white border border-black/10 p-6 sm:p-8 shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto text-xs"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-black/40 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/10">
          <div className="w-12 h-12 bg-[#FDFCF9] text-[#B5945E] border border-black/10 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-[#B5945E]" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              Mortgage & Financing Calculator
            </h3>
            <p className="text-xs text-black/60">
              Estimate your monthly Islamic/Commercial banking installment for luxury estates in Pakistan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-black/70 mb-1">
                <span>Property Valuation (PKR)</span>
                <span className="text-[#B5945E] font-bold">{formatPKRPrice(propertyPrice)}</span>
              </label>
              <input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value) || 0)}
                step="1000000"
                className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-black/70 mb-1">
                <span>Down Payment ({downPaymentPercent}%)</span>
                <span className="text-[#B5945E] font-bold">{formatPKRPrice(calculations.downPaymentAmount)}</span>
              </label>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-[#B5945E] cursor-pointer"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-black/70 mb-1">
                <span>Annual Markup / Profit Rate ({interestRate}%)</span>
                <span className="text-black/40">KIBOR + Spread</span>
              </label>
              <input
                type="range"
                min="8"
                max="24"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#B5945E] cursor-pointer"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-black/70 mb-1">
                <span>Tenure ({loanTermYears} Years)</span>
                <span className="text-black/40">{loanTermYears * 12} Months</span>
              </label>
              <select
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
              >
                <option value={5}>5 Years (60 Months)</option>
                <option value={10}>10 Years (120 Months)</option>
                <option value={15}>15 Years (180 Months)</option>
                <option value={20}>20 Years (240 Months)</option>
                <option value={25}>25 Years (300 Months)</option>
              </select>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-[#FDFCF9] border border-black/10 p-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-black/50 block mb-1">
                Estimated Monthly Installment
              </span>
              <div className="font-serif text-3xl font-bold text-[#B5945E] mb-4">
                PKR {calculations.monthlyPayment.toLocaleString()}
                <span className="text-xs text-black/50 font-sans font-normal ml-1">/ month</span>
              </div>

              <div className="space-y-2.5 py-3 border-t border-black/10 text-xs">
                <div className="flex justify-between text-black/70">
                  <span>Financing Amount:</span>
                  <span className="font-semibold text-[#1A1A1A]">PKR {calculations.principalLoan.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>Down Payment Required:</span>
                  <span className="font-semibold text-[#1A1A1A]">PKR {calculations.downPaymentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>Total Markup Payable:</span>
                  <span className="font-semibold text-[#1A1A1A]">PKR {calculations.totalInterest.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-black/70 pt-2 border-t border-black/10">
                  <span className="font-bold text-[#1A1A1A]">Total Outflow Over Tenure:</span>
                  <span className="font-bold text-[#B5945E]">PKR {calculations.totalPayment.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-black/10">
              <div className="flex items-center gap-2 text-[10px] text-black/60 mb-3">
                <ShieldCheck className="w-4 h-4 text-[#B5945E] shrink-0" />
                <span>Growth Realtors assists with Meezan Bank, HBL Prestige & Standard Chartered Islamic Home Finance.</span>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Close Calculator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
