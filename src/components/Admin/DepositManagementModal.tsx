import React, { useState, useEffect } from 'react';
import { Check, X, Clock, DollarSign, Upload } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface DepositRequest {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit';
  description: string;
  status: 'pending' | 'success' | 'denied';
  created_at: string;
  user_name?: string;
}

interface DepositManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositApproved: () => void;
}

const DepositManagementModal: React.FC<DepositManagementModalProps> = ({
  isOpen,
  onClose,
  onDepositApproved
}) => {
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<'approve' | 'deny' | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadPendingDeposits();
    }
  }, [isOpen]);

  const loadPendingDeposits = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('status', 'pending')
        .eq('type', 'credit')
        .like('description', '%Deposit%')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading deposits:', error);
        toast.error('Failed to load deposit requests');
        return;
      }

      // Fetch user names for each deposit
      const depositsWithNames = await Promise.all(
        (data || []).map(async (deposit) => {
          const { data: userData } = await supabase
            .from('users')
            .select('first_name, last_name')
            .eq('id', deposit.user_id)
            .single();

          return {
            ...deposit,
            user_name: userData ? `${userData.first_name} ${userData.last_name}` : 'Unknown User'
          };
        })
      );

      setDeposits(depositsWithNames);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load deposit requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveDeposit = async (deposit: DepositRequest) => {
    setProcessingId(deposit.id);
    setSelectedAction('approve');

    try {
      // Get current user deposits value
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('deposits')
        .eq('id', deposit.user_id)
        .single();

      if (userError || !userData) {
        toast.error('Failed to retrieve user information');
        return;
      }

      // Update transaction status to success
      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: 'success',
          updated_at: new Date().toISOString()
        })
        .eq('id', deposit.id);

      if (updateError) {
        toast.error('Failed to approve deposit');
        return;
      }

      // Add deposit amount to user's deposits
      const newDeposits = (userData.deposits || 0) + deposit.amount;

      const { error: statsError } = await supabase
        .from('users')
        .update({
          deposits: newDeposits
        })
        .eq('id', deposit.user_id);

      if (statsError) {
        toast.error('Failed to update user balance');
        return;
      }

      toast.success(`Deposit of $${deposit.amount.toFixed(2)} approved and added to user account`);
      setDeposits(deposits.filter(d => d.id !== deposit.id));
      onDepositApproved();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while approving deposit');
    } finally {
      setProcessingId(null);
      setSelectedAction(null);
    }
  };

  const handleDenyDeposit = async (deposit: DepositRequest) => {
    setProcessingId(deposit.id);
    setSelectedAction('deny');

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'denied',
          updated_at: new Date().toISOString()
        })
        .eq('id', deposit.id);

      if (error) {
        toast.error('Failed to deny deposit');
        return;
      }

      toast.success('Deposit request denied');
      setDeposits(deposits.filter(d => d.id !== deposit.id));
      onDepositApproved();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while denying deposit');
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

  const extractCurrencyFromDescription = (description: string) => {
    // Extract currency from description like "Deposit 100 BTC"
    const match = description.match(/Deposit\s+[\d.]+\s+(\w+)/);
    return match ? match[1] : 'CRYPTO';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Deposit Requests" size="xl">
      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : deposits.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Clock className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <p className="text-lg font-medium">No pending deposits</p>
            <p className="text-sm">All deposit requests have been processed</p>
          </div>
        ) : (
          deposits.map((deposit) => (
            <div key={deposit.id} className="bg-green-900/20 border border-green-700/40 rounded-lg p-4 hover:border-green-600/60 transition-all">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold text-sm">{deposit.user_name}</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
                      {deposit.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{formatDate(deposit.created_at)}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-lg text-green-400">
                    +{formatCurrency(deposit.amount)}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-3 mb-3 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400">Amount</p>
                    <p className="text-white font-medium">{formatCurrency(deposit.amount)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 text-sm border-t border-slate-700/30 pt-2">
                  <Upload className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-slate-400">Cryptocurrency</p>
                    <p className="text-white font-mono text-sm">{extractCurrencyFromDescription(deposit.description)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-3 border-t border-green-700/30">
                <button
                  onClick={() => handleDenyDeposit(deposit)}
                  disabled={processingId === deposit.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Deny</span>
                </button>
                <button
                  onClick={() => handleApproveDeposit(deposit)}
                  disabled={processingId === deposit.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{processingId === deposit.id && selectedAction === 'approve' ? 'Approving...' : 'Approve'}</span>
                  <span className="sm:hidden">{processingId === deposit.id && selectedAction === 'approve' ? '...' : '✓'}</span>
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

export default DepositManagementModal;
