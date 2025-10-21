import React, { useState } from 'react';
import { TrendingDown, Save } from 'lucide-react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AdminProfitDeductionProps {
  userId: string;
  currentProfits: number;
  onDeductionCompleted: () => void;
}

const AdminProfitDeduction: React.FC<AdminProfitDeductionProps> = ({
  userId,
  currentProfits,
  onDeductionCompleted
}) => {
  const [deductionAmount, setDeductionAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(deductionAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > currentProfits) {
      toast.error(`Cannot deduct more than current profits ($${currentProfits.toFixed(2)})`);
      return;
    }

    setIsSubmitting(true);
    try {
      const newProfits = currentProfits - amount;

      // Update user profits
      const { error: updateError } = await supabase
        .from('users')
        .update({ profits: newProfits })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profits:', updateError);
        toast.error('Failed to record trading loss');
        return;
      }

      // Create transaction record for trading loss
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          description: `Trading Loss: -$${amount.toFixed(2)}`,
          amount: amount,
          type: 'debit',
          status: 'success',
          created_at: new Date().toISOString()
        });

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
      }

      console.log('✅ Trading loss recorded:', amount);
      toast.success(`Trading loss of $${amount.toFixed(2)} recorded!`);
      setDeductionAmount('');
      onDeductionCompleted();
    } catch (error) {
      console.error('Error recording trading loss:', error);
      toast.error('Failed to record trading loss');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-red-900/20 backdrop-blur-sm border border-red-800/60 rounded-2xl p-4 sm:p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
        <h3 className="text-base sm:text-lg font-semibold text-white">Record Trading Loss</h3>
      </div>

      <form onSubmit={handleDeduct} className="space-y-4 sm:space-y-6">
        {/* Info Box */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3 sm:p-4">
          <p className="text-sm text-slate-300">Current Profits: <span className="font-bold text-green-400">{formatCurrency(currentProfits)}</span></p>
        </div>

        {/* Deduction Input */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Loss Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 font-bold">-$</span>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={deductionAmount}
              onChange={(e) => setDeductionAmount(e.target.value)}
              className="pl-12"
              min="0"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Enter the amount to deduct as trading loss</p>
        </div>

        {/* Preview */}
        {deductionAmount && (
          <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-sm text-slate-400">New Profits After Loss:</p>
            <p className="text-2xl font-bold text-white mt-2">
              {formatCurrency(Math.max(0, currentProfits - parseFloat(deductionAmount)))}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          icon={Save}
          loading={isSubmitting}
          className="w-full bg-red-900/40 hover:bg-red-900/60 border-red-800/60 text-red-300"
          disabled={!deductionAmount || isSubmitting}
        >
          {isSubmitting ? 'Recording Loss...' : 'Record Trading Loss'}
        </Button>
      </form>

      <p className="text-xs text-slate-500 mt-4">
        💡 Tip: Trading loss will be recorded in transaction history as a debit transaction.
      </p>
    </div>
  );
};

export default AdminProfitDeduction;
