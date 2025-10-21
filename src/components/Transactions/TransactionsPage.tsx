import React, { useState } from 'react';
import { History, Search, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, X } from 'lucide-react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import TransactionReceiptModal from '../Home/TransactionReceiptModal';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'credit' | 'debit';
  amount: number;
  currency?: string;
  status: 'pending' | 'completed' | 'success' | 'denied';
  createdAt?: Date;
  timestamp?: Date;
  walletAddress?: string;
  description?: string;
}

interface DisplayTransaction extends Transaction {
  displayType: 'deposit' | 'withdrawal';
  displayStatus: 'completed' | 'pending' | 'denied';
  displayDate?: Date;
  displayCurrency: string;
}

interface TransactionsPageProps {
  transactions: Transaction[];
  userBalance: number;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, userBalance }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<DisplayTransaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Normalize transaction data to handle both formats
  const normalizedTransactions: DisplayTransaction[] = (transactions || []).map((transaction) => {
    // Map AuthContext format to display format
    const displayType: 'deposit' | 'withdrawal' =
      transaction.type === 'credit' ? 'deposit' : transaction.type === 'debit' ? 'withdrawal' : (transaction.type as 'deposit' | 'withdrawal');

    const displayStatus: 'completed' | 'pending' | 'denied' =
      transaction.status === 'success'
        ? 'completed'
        : transaction.status === 'denied'
        ? 'denied'
        : (transaction.status as 'completed' | 'pending' | 'denied');

    const displayDate = transaction.createdAt || transaction.timestamp;

    // Extract currency from description if not present
    let currency = transaction.currency;
    if (!currency && transaction.description) {
      const currencyMatch = transaction.description.match(/\b(USDT|BTC|ETH|BNB|SOL|USD|EUR)\b/i);
      if (currencyMatch) {
        currency = currencyMatch[1].toUpperCase();
      } else {
        currency = 'USD';
      }
    }

    return {
      ...transaction,
      displayType,
      displayStatus,
      displayDate,
      displayCurrency: currency || 'USD',
    } as DisplayTransaction;
  });

  // Filter transactions
  const filteredTransactions = normalizedTransactions.filter((transaction) => {
    const matchesSearch =
      (transaction.displayCurrency?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || transaction.displayStatus === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.displayType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });


  // Paginate transactions
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Summary stats - Calculate profits, losses, and P&L
  const totalProfits = normalizedTransactions.filter(t => t.type === 'credit' && t.status === 'success' && !t.description?.includes('Trading Loss')).reduce((sum, t) => sum + t.amount, 0);
  const totalLosses = normalizedTransactions.filter(t => t.type === 'debit' && t.status === 'success' && t.description?.includes('Trading Loss')).reduce((sum, t) => sum + t.amount, 0);
  const totalPL = totalProfits - totalLosses;

  // Handle transaction click to open receipt
  const handleTransactionClick = (transaction: DisplayTransaction) => {
    setSelectedTransaction(transaction);
    setIsReceiptModalOpen(true);
  };

  // Close receipt modal
  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setSelectedTransaction(null);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Date not available';
    try {
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      return 'Date error';
    }
  };

  // Convert transaction to receipt format
  const convertToReceiptFormat = (transaction: DisplayTransaction) => {
    return {
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description || `${transaction.displayType} ${transaction.displayCurrency}`,
      status: (transaction.displayStatus === 'completed'
        ? 'success'
        : transaction.displayStatus === 'denied'
        ? 'denied'
        : 'pending') as 'success' | 'pending' | 'denied',
      timestamp: transaction.displayDate || new Date(),
      type: (transaction.displayType === 'deposit' ? 'credit' : 'debit') as 'credit' | 'debit',
    };
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <History className="w-7 h-7 sm:w-9 sm:h-9 text-vertex-blue" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Transactions</h1>
            <p className="text-slate-400 text-sm sm:text-base">All your activity in one place</p>
          </div>
        </div>
        {/* Summary Bar */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-0">
          <div className="rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-2 flex flex-col items-center min-w-[90px]">
            <span className="text-xs text-slate-400">Total</span>
            <span className="text-lg font-bold text-white">{transactions.length}</span>
          </div>
          <div className="rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-2 flex flex-col items-center min-w-[90px]">
            <span className="text-xs text-green-400">Profits</span>
            <span className="text-lg font-bold text-green-400">+{formatAmount(totalProfits)}</span>
          </div>
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2 flex flex-col items-center min-w-[90px]">
            <span className="text-xs text-red-400">Losses</span>
            <span className="text-lg font-bold text-red-400">-{formatAmount(totalLosses)}</span>
          </div>
          <div className={`rounded-xl border px-4 py-2 flex flex-col items-center min-w-[90px] ${totalPL >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <span className={`text-xs ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>P&L</span>
            <span className={`text-lg font-bold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalPL >= 0 ? '+' : '-'}{formatAmount(Math.abs(totalPL))}</span>
          </div>
        </div>
      </div>

      {/* Sticky Filters/Search Bar */}
      <div className="sticky top-2 z-10">
        <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
          <Input icon={Search} placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 min-w-[180px]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-vertex-blue-600/50 focus:border-vertex-blue-600 text-sm sm:text-base"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="denied">Denied</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-vertex-blue-600/50 focus:border-vertex-blue-600 text-sm sm:text-base"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
          </select>
        </div>
      </div>

      {/* Transaction Count */}
      <div className="text-xs sm:text-sm text-slate-400 mb-2 sm:mb-3">Showing {filteredTransactions.length} of {transactions.length} transactions</div>

      {/* Modern Card Transactions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginatedTransactions.length > 0 ? (
          paginatedTransactions.map((transaction: DisplayTransaction) => (
            <div
              key={transaction.id}
              className="group relative flex flex-col justify-between bg-gradient-to-br from-[#10131a] to-[#181c23] border border-slate-800 rounded-2xl shadow-lg p-5 transition hover:scale-[1.015] hover:shadow-2xl cursor-pointer min-h-[170px]"
              onClick={() => handleTransactionClick(transaction)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`rounded-xl p-3 border-2 ${transaction.displayType === 'deposit' ? 'bg-vertex-blue-600/10 border-vertex-blue-600/40' : 'bg-red-500/10 border-red-500/40'}`}>
                  {transaction.displayType === 'deposit' ? (
                    <ArrowDownLeft className="w-5 h-5 text-vertex-blue" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-400 capitalize">{transaction.displayType}</span>
                  <span className="text-xs font-medium text-slate-500">{transaction.displayCurrency}</span>
                </div>
                <span className="ml-auto text-xs text-slate-500 hidden sm:inline">ID: {transaction.id}</span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-2xl font-extrabold ${transaction.displayType === 'deposit' ? 'text-vertex-blue' : 'text-red-400'}`}>{transaction.displayType === 'deposit' ? '+' : '-'}{formatAmount(transaction.amount)}</span>
                  <span className="text-xs text-slate-400">{formatDate(transaction.displayDate)}</span>
                </div>
                {transaction.description && <p className="text-xs text-slate-400 truncate max-w-full mb-1">{transaction.description}</p>}
                {transaction.walletAddress && (
                  <p className="text-xs text-slate-500 font-mono truncate max-w-full">To: {transaction.walletAddress}</p>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3">
                {transaction.displayStatus === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-vertex-blue" />
                ) : transaction.displayStatus === 'denied' ? (
                  <X className="w-4 h-4 text-red-400" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-400" />
                )}
                <span className={`text-xs font-semibold capitalize ${transaction.displayStatus === 'completed' ? 'text-vertex-blue' : transaction.displayStatus === 'denied' ? 'text-red-400' : 'text-yellow-400'}`}>{transaction.displayStatus}</span>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs bg-slate-800/80 text-white px-2 py-1 rounded-lg shadow">View Receipt</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <History className="w-14 h-14 text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No transactions found</h3>
            <p className="text-slate-500 text-sm">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Your transaction history will appear here once you make transactions'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800">
          <div className="text-xs sm:text-sm text-slate-400">Page {currentPage} of {totalPages}</div>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Transaction Receipt Modal */}
      {selectedTransaction && (
        <TransactionReceiptModal
          transaction={convertToReceiptFormat(selectedTransaction)}
          isOpen={isReceiptModalOpen}
          onClose={closeReceiptModal}
          userBalance={userBalance}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
