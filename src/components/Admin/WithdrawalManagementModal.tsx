import React, { useState, useEffect } from 'react';
import { Check, X, Clock, DollarSign, Wallet } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  type: 'debit';
  description: string;
  status: 'pending' | 'success' | 'denied';
  created_at: string;
  user_name?: string;
}

interface WithdrawalManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdrawalApproved: () => void;
}

const WithdrawalManagementModal: React.FC<WithdrawalManagementModalProps> = ({
  isOpen,
  onClose,
  onWithdrawalApproved
}) => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<'approve' | 'deny' | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPendingWithdrawals();
    }
  }, [isOpen]);

  const loadPendingWithdrawals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('status', 'pending')
        .eq('type', 'debit')
        .like('description', '%Withdrawal%')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading withdrawals:', error);
        toast.error('Failed to load withdrawal requests');
        return;
      }

      // Fetch user names for each withdrawal
      const withdrawalsWithNames = await Promise.all(
        (data || []).map(async (withdrawal) => {
          const { data: userData } = await supabase
            .from('users')
            .select('first_name, last_name')
            .eq('id', withdrawal.user_id)
            .single();

          return {
            ...withdrawal,
            user_name: userData ? `${userData.first_name} ${userData.last_name}` : 'Unknown User'
          };
        })
      );

      setWithdrawals(withdrawalsWithNames);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load withdrawal requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveWithdrawal = async (withdrawal: WithdrawalRequest) => {
    setProcessingId(withdrawal.id);
    setSelectedAction('approve');

    try {
      // Get current user balance
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('balance, profits, deposits, expert_trades')
        .eq('id', withdrawal.user_id)
        .single();

      if (userError || !userData) {
        toast.error('Failed to retrieve user information');
        return;
      }

      // Check if user has sufficient balance
      const totalBalance = (userData.profits || 0) + (userData.deposits || 0) + (userData.expert_trades || 0);
      
      if (totalBalance < withdrawal.amount) {
        toast.error('Insufficient user balance for this withdrawal');
        return;
      }

      // Update transaction status to success
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'success',
          updated_at: new Date().toISOString()
        })
        .eq('id', withdrawal.id);

      if (updateError) {
        toast.error('Failed to approve withdrawal');
        return;
      }

      // Deduct from profits first, then deposits, then expert trades
      let remainingAmount = withdrawal.amount;
      let newProfits = userData.profits || 0;
      let newDeposits = userData.deposits || 0;
      let newExpertTrades = userData.expert_trades || 0;

      if (remainingAmount > 0 && newProfits > 0) {
        const deductFromProfits = Math.min(remainingAmount, newProfits);
        newProfits -= deductFromProfits;
        remainingAmount -= deductFromProfits;
      }

      if (remainingAmount > 0 && newDeposits > 0) {
        const deductFromDeposits = Math.min(remainingAmount, newDeposits);
        newDeposits -= deductFromDeposits;
        remainingAmount -= deductFromDeposits;
      }

      if (remainingAmount > 0 && newExpertTrades > 0) {
        const deductFromExpertTrades = Math.min(remainingAmount, newExpertTrades);
        newExpertTrades -= deductFromExpertTrades;
        remainingAmount -= deductFromExpertTrades;
      }

      // Update user's portfolio stats
      const { error: statsError } = await supabase
        .from('users')
        .update({
          profits: newProfits,
          deposits: newDeposits,
          expert_trades: newExpertTrades
        })
        .eq('id', withdrawal.user_id);

      if (statsError) {
        toast.error('Failed to update user balance');
        return;
      }

      toast.success('Withdrawal approved and funds deducted');
      setWithdrawals(withdrawals.filter(w => w.id !== withdrawal.id));
      onWithdrawalApproved();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while approving withdrawal');
    } finally {
      setProcessingId(null);
      setSelectedAction(null);
    }
  };

  const handleDenyWithdrawal = async (withdrawal: WithdrawalRequest) => {
    setProcessingId(withdrawal.id);
    setSelectedAction('deny');

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'denied',
          updated_at: new Date().toISOString()
        })
        .eq('id', withdrawal.id);

      if (error) {
        toast.error('Failed to deny withdrawal');
        return;
      }

      toast.success('Withdrawal denied');
      setWithdrawals(withdrawals.filter(w => w.id !== withdrawal.id));
      onWithdrawalApproved();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while denying withdrawal');
    } finally {
      setProcessingId(null);
      setSelectedAction(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const extractAddressFromDescription = (description: string) => {
    // Extract wallet address from description like "Withdrawal 100 BTC to 0x123..."
    const match = description.match(/to\s+(\S+)$/);
    return match ? match[1] : 'N/A';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Withdrawal Requests" size="xl">
      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Clock className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <p className="text-lg font-medium">No pending withdrawals</p>
            <p className="text-sm">All withdrawal requests have been processed</p>
          </div>
        ) : (
          withdrawals.map((withdrawal) => (
            <div key={withdrawal.id} className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-4 hover:border-slate-600 transition-all">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold text-sm">{withdrawal.user_name}</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
                      {withdrawal.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{formatDate(withdrawal.created_at)}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-lg text-red-400">
                    -{formatCurrency(withdrawal.amount)}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-3 mb-3 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400">Amount</p>
                    <p className="text-white font-medium">{formatCurrency(withdrawal.amount)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 text-sm border-t border-slate-700/30 pt-2">
                  <Wallet className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400">Destination</p>
                    <p className="text-white font-mono text-xs break-all">{extractAddressFromDescription(withdrawal.description)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-700/30">
                <button
                  onClick={() => handleDenyWithdrawal(withdrawal)}
                  disabled={processingId === withdrawal.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Deny</span>
                </button>
                <button
                  onClick={() => handleApproveWithdrawal(withdrawal)}
                  disabled={processingId === withdrawal.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{processingId === withdrawal.id && selectedAction === 'approve' ? 'Approving...' : 'Approve'}</span>
                  <span className="sm:hidden">{processingId === withdrawal.id && selectedAction === 'approve' ? '...' : '✓'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t border-slate-700 mt-4">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default WithdrawalManagementModal;
