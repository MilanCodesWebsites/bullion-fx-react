import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, X } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  status: 'pending' | 'success' | 'denied';
  type: 'credit' | 'debit';
  created_at: string;
  summary?: string;
}

interface TransactionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onTransactionDeleted: () => void;
}

const TransactionManagementModal: React.FC<TransactionManagementModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  onTransactionDeleted
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editSummary, setEditSummary] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadTransactions();
    }
  }, [isOpen, userId]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading transactions:', error);
        toast.error('Failed to load transactions');
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    setDeletingId(transactionId);
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

      if (error) {
        console.error('Error deleting transaction:', error);
        toast.error('Failed to delete transaction');
        return;
      }

      toast.success('Transaction deleted successfully');
      setTransactions(transactions.filter(t => t.id !== transactionId));
      onTransactionDeleted();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete transaction');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditTransaction = async (transactionId: string) => {
    try {
      // Only update the description field (summary column doesn't exist in DB)
      const { error } = await supabase
        .from('transactions')
        .update({
          description: editDescription
        })
        .eq('id', transactionId);

      if (error) {
        console.error('Error updating transaction:', error);
        toast.error('Failed to update transaction');
        return;
      }

      toast.success('Transaction updated successfully');
      setTransactions(transactions.map(t =>
        t.id === transactionId
          ? { ...t, description: editDescription, summary: editSummary }
          : t
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update transaction');
    }
  };

  const startEdit = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditDescription(transaction.description);
    setEditSummary(transaction.summary || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDescription('');
    setEditSummary('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Transactions - ${userName}`} size="xl">
      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No transactions found for this user</p>
          </div>
        ) : (
          transactions.map((transaction) =>
            editingId === transaction.id ? (
              // Edit Mode - Full Width, Better Layout
              <div key={transaction.id} className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-semibold text-sm sm:text-base">Edit Transaction</h4>
                  <button onClick={cancelEdit} className="text-slate-400 hover:text-white transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">Description</label>
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      placeholder="Enter transaction description"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">Notes (Optional)</label>
                    <textarea
                      value={editSummary}
                      onChange={(e) => setEditSummary(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
                      rows={2}
                      placeholder="Add internal notes about this transaction..."
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-3 border-t border-blue-700/30">
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEditTransaction(transaction.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              // View Mode - Compact, Responsive
              <div key={transaction.id} className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3 sm:p-4 hover:border-slate-600/60 hover:bg-slate-800/60 transition-all">
                <div className="space-y-2">
                  {/* Header with status and amount */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{transaction.description}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(transaction.created_at)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap ml-2 ${
                      transaction.status === 'success'
                        ? 'text-green-400 bg-green-400/10 border-green-400/20'
                        : transaction.status === 'pending'
                        ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                        : 'text-red-400 bg-red-400/10 border-red-400/20'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="pt-1">
                    <p className={`font-bold text-sm sm:text-base ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                  </div>

                  {/* Summary if exists */}
                  {transaction.summary && (
                    <div className="pt-2 border-t border-slate-700/30">
                      <p className="text-xs text-slate-300 italic">📝 {transaction.summary}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end pt-3 mt-3 border-t border-slate-700/30">
                  <button
                    onClick={() => startEdit(transaction)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-xs font-medium transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    disabled={deletingId === transaction.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{deletingId === transaction.id ? 'Deleting...' : 'Delete'}</span>
                    <span className="sm:hidden">{deletingId === transaction.id ? '...' : '✕'}</span>
                  </button>
                </div>
              </div>
            )
          )
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

export default TransactionManagementModal;
