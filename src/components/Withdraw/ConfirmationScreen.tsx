import React from 'react';
import { CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import Button from '../UI/Button';

interface ConfirmationScreenProps {
  withdrawData: any;
  onConfirm: () => void;
  onBack: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ withdrawData, onConfirm, onBack }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const feeAmount = withdrawData.amount * 0.1;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 animate-slide-up">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="p-4 bg-neon-green/10 rounded-2xl inline-block mb-4 animate-glow">
          <CheckCircle className="w-8 h-8 text-neon-green" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Confirm Withdrawal</h2>
        <p className="text-slate-400">Please review your withdrawal details</p>
      </div>

      {/* Withdrawal Summary */}
      <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">Withdrawal Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-300">Amount to withdraw:</span>
            <span className="text-white font-medium">{formatCurrency(withdrawData.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Currency:</span>
            <span className="text-white font-medium">{withdrawData.currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Destination address:</span>
            <span className="text-white font-mono text-xs break-all max-w-48">
              {withdrawData.walletAddress}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Processing fee (10%):</span>
            <span className="text-slate-400 font-medium">{formatCurrency(feeAmount)}</span>
          </div>
          <hr className="border-slate-600" />
          <div className="flex justify-between text-lg">
            <span className="text-white font-semibold">You will receive:</span>
            <span className="text-neon-green font-bold">{formatCurrency(withdrawData.amount)}</span>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
          <div className="text-sm text-slate-300">
            <p className="font-medium text-blue-400 mb-2">Your withdrawal request has been received and is being processed in 1-2 hours.</p>
            <p>If it exceeds this time, please contact support.</p>
          </div>
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
          Back to Review
        </Button>
        <Button 
          variant="success"
          onClick={onConfirm}
          icon={CheckCircle}
          className="flex-1"
        >
          Confirm Withdrawal
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationScreen;