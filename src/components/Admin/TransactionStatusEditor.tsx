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
  status: 'pending' | 'success' | 'failed';
  created_at: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface TransactionStatusEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionStatusEditor: React.FC<TransactionStatusEditorProps> = ({ isOpen, onClose }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<'pending' | 'success' | 'failed'>('pending');

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
        .order('created_at', { ascending: false });

      if (transError) throw transError;

      setTransactions(transactionsData || []);

      // Fetch user names for each transaction
      const userIds = [...new Set((transactionsData || []).map(t => t.user_id))];
      const { data: usersData, error: userError } = await supabase
        .from('users')
        .select('id, firstName, lastName')
        .in('id', userIds);

      if (userError) throw userError;

      const userMap = new Map();
      (usersData || []).forEach(user => {
        userMap.set(user.id, user);
      });
      setUsers(userMap);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (transactionId: string, newStatus: 'pending' | 'success' | 'failed') => {
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
      case 'failed':
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Edit2 className="w-6 h-6 text-slate-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">Transaction Status Editor</h2>
              <p className="text-sm text-slate-400">Edit transaction status: pending, success, or failed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && transactions.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-400">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-slate-400">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => {
                    const user = users.get(transaction.user_id);
                    const isEditing = editingId === transaction.id;

                    return (
                      <tr key={transaction.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-white">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            transaction.type === 'credit' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {transaction.type === 'credit' ? 'Deposit' : 'Withdrawal'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300 max-w-xs truncate">
                          {transaction.description}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {isEditing ? (
                            <select
                              value={editingStatus}
                              onChange={(e) => setEditingStatus(e.target.value as 'pending' | 'success' | 'failed')}
                              className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-slate-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="success">Success</option>
                              <option value="failed">Failed</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-400">
                          {formatDate(transaction.created_at)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {isEditing ? (
                            <button
                              onClick={() => handleStatusChange(transaction.id, editingStatus)}
                              disabled={loading}
                              className="flex items-center gap-1 px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Check className="w-4 h-4" />
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingId(transaction.id);
                                setEditingStatus(transaction.status);
                              }}
                              className="flex items-center gap-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
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
        <div className="border-t border-slate-800 p-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatusEditor;
