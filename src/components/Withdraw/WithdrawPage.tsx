import React, { useState } from 'react';
import WithdrawForm from './WithdrawForm';
import BankWithdrawPage from './BankWithdrawPage';
import FeeCalculator from './FeeCalculator';
import ConfirmationScreen from './ConfirmationScreen';
import { ArrowUpRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WithdrawPageProps {
  balance: number;
  onWithdraw: (transaction: any) => void;
}

const WithdrawPage: React.FC<WithdrawPageProps> = ({ balance, onWithdraw }) => {
  const [step, setStep] = useState(1);
  const [withdrawData, setWithdrawData] = useState<any>(null);
  const [withdrawalType, setWithdrawalType] = useState<'crypto' | 'bank'>('crypto');
  const navigate = useNavigate();

  const handleWithdrawSubmit = (data: any) => {
    setWithdrawData(data);
    setStep(2);
  };

  const handleFeeConfirm = () => {
    setStep(3);
  };

  const handleConfirmWithdraw = () => {
    const transaction = {
      type: 'debit' as const,
      amount: withdrawData.amount,
      description: `Withdrawal ${withdrawData.amount} ${withdrawData.currency} to ${withdrawData.walletAddress}`,
      status: 'pending' as const  // Always create as pending - admin must approve
    };
    
    onWithdraw(transaction);
    setStep(4);
  };

  const handleBankWithdraw = (transaction: any) => {
    onWithdraw(transaction);
  };

  const resetFlow = () => {
    setStep(1);
    setWithdrawData(null);
    setWithdrawalType('crypto');
  };

  const handleBackToCrypto = () => {
    setWithdrawalType('crypto');
    setStep(1);
    setWithdrawData(null);
  };

  // Bank withdrawal flow
  if (withdrawalType === 'bank') {
    return (
      <BankWithdrawPage
        balance={balance}
        onWithdraw={handleBankWithdraw}
        onBack={handleBackToCrypto}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="p-4 bg-red-500/10 rounded-2xl inline-block mb-4 animate-glow">
          <ArrowUpRight className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
  <p className="text-slate-400">Transfer funds from your BullionFX account</p>
      </div>

      {step === 1 && (
        <WithdrawForm 
          balance={balance} 
          onSubmit={handleWithdrawSubmit}
          onBankWithdraw={() => setWithdrawalType('bank')}
        />
      )}

      {step === 2 && withdrawData && (
        <FeeCalculator 
          amount={withdrawData.amount}
          currency={withdrawData.currency}
          onConfirm={handleFeeConfirm}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <ConfirmationScreen
          withdrawData={withdrawData}
          onConfirm={handleConfirmWithdraw}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <div className="text-center bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <div className="p-4 bg-blue-500/10 rounded-2xl inline-block mb-6 animate-glow">
            <ArrowUpRight className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Withdrawal Request Submitted!</h2>
          <p className="text-slate-300 mb-8">
            Your withdrawal request has been submitted and is pending admin review. Your account balance remains unchanged until an authorized admin approves the request. You'll be notified once it's processed.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors border border-slate-600"
            >
              <Home className="w-5 h-5" />
              Go Back to Dashboard
            </button>
            <button
              onClick={resetFlow}
              className="flex-1 px-6 py-3 bg-neon-green hover:bg-dark-green text-deep-black rounded-xl font-semibold transition-colors"
            >
              Make Another Withdrawal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawPage;