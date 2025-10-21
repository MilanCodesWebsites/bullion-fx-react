import React, { useState, useEffect } from 'react';
import { X, Edit2, Check } from 'lucide-react';
import Button from '../UI/Button';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string;
  status: 'pending' | 'success' | 'denied';
  created_at: string;
}

interface UserTransactionStatusEditorProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onStatusUpdated: () => void;
}

const UserTransactionStatusEditor: React.FC<UserTransactionStatusEditorProps> = ({ 
  isOpen, 
  onClose, 
  userId,
  onStatusUpdated 
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<'pending' | 'success' | 'denied'>('pending');

  useEffect(() => {
    if (isOpen) {
      loadTransactions();
    }
  }, [isOpen]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const { data: transactionsData, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (transError) throw transError;

      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (transactionId: string, newStatus: 'pending' | 'success' | 'denied') => {
    try {
      setLoading(true);
      
      // Use a simple update without timestamp to avoid constraints
      const { error } = await supabase
        .from('transactions')
        .update({ status: newStatus })
        .eq('id', transactionId)
        .select();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }

      setTransactions(transactions.map(t =>
        t.id === transactionId ? { ...t, status: newStatus } : t
      ));

      toast.success(`Transaction status updated to ${newStatus}`);
      setEditingId(null);
      onStatusUpdated();
    } catch (error) {
      console.error('Error updating transaction status:', error);
      toast.error('Failed to update transaction status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400 bg-green-500/10';
      case 'denied':
        return 'text-red-400 bg-red-500/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Edit2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-white truncate">Edit Transaction Status</h2>
              <p className="text-xs sm:text-sm text-slate-400 truncate">Change status: pending, success, or failed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && transactions.length === 0 ? (
            <div className="flex items-center justify-center h-48 sm:h-64">
              <p className="text-slate-400 text-sm">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center h-48 sm:h-64">
              <p className="text-slate-400 text-sm">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-slate-800/50 sticky top-0">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-300 whitespace-nowrap">Amount</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-300 whitespace-nowrap hidden sm:table-cell">Type</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-300 whitespace-nowrap hidden md:table-cell">Description</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-300 whitespace-nowrap">Status</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-300 whitespace-nowrap hidden lg:table-cell">Date</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold text-slate-300 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => {
                    const isEditing = editingId === transaction.id;

                    return (
                      <tr key={transaction.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                        <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-white whitespace-nowrap">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-300 hidden sm:table-cell">
                          <span className={`px-2 py-1 rounded text-xs font-medium inline-block ${
                            transaction.type === 'credit' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {transaction.type === 'credit' ? 'Dep' : 'Wth'}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-300 max-w-xs truncate hidden md:table-cell">
                          <span className="text-xs">{transaction.description}</span>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          {isEditing ? (
                            <select
                              value={editingStatus}
                              onChange={(e) => setEditingStatus(e.target.value as 'pending' | 'success' | 'denied')}
                              className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-slate-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="success">Success</option>
                              <option value="denied">Denied</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded text-xs font-semibold inline-block ${getStatusColor(transaction.status)}`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          )}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-400 hidden lg:table-cell">
                          <span className="text-xs">{formatDate(transaction.created_at)}</span>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          {isEditing ? (
                            <button
                              onClick={() => handleStatusChange(transaction.id, editingStatus)}
                              disabled={loading}
                              className="flex items-center gap-1 px-2 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded text-xs font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              <Check className="w-3 h-3" />
                              <span className="hidden sm:inline">Save</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingId(transaction.id);
                                setEditingStatus(transaction.status);
                              }}
                              className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs font-medium transition-colors whitespace-nowrap"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-2 sm:p-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="w-full text-sm"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserTransactionStatusEditor;
