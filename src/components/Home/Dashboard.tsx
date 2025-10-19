import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertCircle, Quote, Eye, EyeOff, Shield } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillTransfer, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import TransactionReceiptModal from './TransactionReceiptModal';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  status: 'pending' | 'success' | 'denied';
  timestamp: Date | string;
  type: 'credit' | 'debit';
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Use centralized data from AuthContext
  const transactions = user?.transactions || [];
  const totalBalance = user?.balance || 0;
  const initialBalance = user?.initialBalance || 0;

  // Receipt modal state
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Calculate P&L percentage
  const calculatePnL = () => {
    if (initialBalance === 0) return 0;
    return ((totalBalance - initialBalance) / initialBalance) * 100;
  };

  const pnlPercentage = calculatePnL();
  const pnlAmount = totalBalance - initialBalance;

  // Balance visibility toggle
  const [showBalance, setShowBalance] = useState(true);

  // Handle transaction click to open receipt
  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsReceiptModalOpen(true);
  };

  // Close receipt modal
  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setSelectedTransaction(null);
  };

  // Safe date formatting for display
  const formatDisplayDate = (timestamp: Date | string) => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatDisplayTime = (timestamp: Date | string) => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid Time';
      return date.toLocaleTimeString();
    } catch (error) {
      return 'Invalid Time';
    }
  };

  // Motivational quotes that change every 24 hours
  const motivationalQuotes = [
    {
      quote: "The biggest risk is not taking any risk. In a world that's changing quickly, the only strategy that is guaranteed to fail is not taking risks.",
      author: "Mark Zuckerberg",
      category: "Risk Management"
    },
    {
      quote: "Risk comes from not knowing what you're doing. The best traders are those who understand both the risks and rewards of their decisions.",
      author: "Warren Buffett",
      category: "Trading Wisdom"
    },
    {
      quote: "Success in trading is not about avoiding losses, but about managing them. Every loss is a lesson that brings you closer to profit.",
      author: "George Soros",
      category: "Loss Management"
    },
    {
      quote: "The market is a device for transferring money from the impatient to the patient. Time is your greatest ally in trading.",
      author: "Benjamin Graham",
      category: "Patience"
    },
    {
      quote: "Diversification is protection against ignorance. It makes little sense if you know what you are doing.",
      author: "Warren Buffett",
      category: "Portfolio Strategy"
    },
    {
      quote: "The goal of a successful trader is to make the best trades. Money is secondary. The best trades are the ones that align with your strategy.",
      author: "Alexander Elder",
      category: "Strategy"
    },
    {
      quote: "Fear and greed are the two emotions that drive markets. Master these emotions, and you master the market.",
      author: "Jesse Livermore",
      category: "Emotional Control"
    },
    {
      quote: "In trading, you have to be defensive and aggressive at the same time. Defensive about your capital, aggressive about your opportunities.",
      author: "Paul Tudor Jones",
      category: "Capital Management"
    }
  ];

  // Get quote of the day (changes every 24 hours)
  const getQuoteOfTheDay = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return motivationalQuotes[dayOfYear % motivationalQuotes.length];
  };

  const quoteOfTheDay = getQuoteOfTheDay();

  useEffect(() => {
    // Load CoinGecko widget script
    const script = document.createElement('script');
    script.src = 'https://widgets.coingecko.com/gecko-coin-list-widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch {}
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'denied':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'denied': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'credit' ? 'text-green-400' : 'text-red-400';
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center text-slate-400">
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome back, {user.firstName || 'User'}!</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your BullionFX portfolio</p>
      </div>

      {/* Main Balance Card - Modern Redesign with Integrated Actions */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#0b1220] via-[#0b1322] to-[#0b1220] p-4 sm:p-6 lg:p-8 shadow-[0_0_40px_-10px_rgba(59,130,246,0.35)]">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full blur-3xl bg-vertex-blue-600/30" />
          <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full blur-3xl bg-cyan-500/20" />
        </div>

        {/* Header with toggle */}
        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-vertex-blue-600/15 border border-vertex-blue-600/30 flex items-center justify-center">
              <FontAwesomeIcon icon={faMoneyBillTransfer} className="w-5 h-5 text-vertex-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Wallet Balance</h2>
              <p className="text-xs text-slate-400">Live portfolio value</p>
            </div>
          </div>
          <button
            onClick={() => setShowBalance(s => !s)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/60 transition"
            aria-label={showBalance ? 'Hide balance' : 'Show balance'}
          >
            {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showBalance ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Balance display */}
        <div className="relative mb-6">
          <div className="flex items-baseline gap-3">
            <div className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white ${!showBalance ? 'blur-sm select-none' : ''}`}>
              ${totalBalance.toFixed(2)}
            </div>
            <span className="text-sm px-2 py-1 rounded-md bg-slate-800/70 border border-slate-700 text-slate-300">USD</span>
          </div>
          <div className="mt-2 text-slate-400 text-xs">Updated just now</div>
        </div>

        {/* Quick Stats Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400 mb-1">Initial Balance</p>
            <p className="text-lg font-semibold text-white">${initialBalance.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400 mb-1">Profit & Loss</p>
            <div className="flex items-center gap-2">
              {pnlAmount >= 0 ? (
                <TrendingUp className="w-5 h-5 text-vertex-blue-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <p className={`text-lg font-semibold ${pnlAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${Math.abs(pnlAmount).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400 mb-1">P&L %</p>
            <p className={`text-lg font-semibold ${pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {pnlPercentage.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Integrated Action Buttons */}
        <div className="relative border-t border-slate-700/50 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/deposit"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-vertex-blue-600 hover:bg-vertex-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-vertex-blue-600/50"
            >
              <FontAwesomeIcon icon={faMoneyBillTransfer} className="w-4 h-4" />
              Deposit Funds
            </Link>
            <Link
              to="/withdraw"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition-all duration-200 hover:border-slate-600"
            >
              <FontAwesomeIcon icon={faHandHoldingDollar} className="w-4 h-4" />
              Withdraw Funds
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Layout - Content Below */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Account Stats & Quote */}
        <div className="lg:col-span-1 space-y-6">
          {/* Account Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-vertex-blue-600" />
              <h3 className="text-base font-semibold text-white">Account Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                <span className="text-xs text-slate-400">Total Credits</span>
                <span className="text-sm font-medium text-green-400">
                  ${transactions.filter(t => t.type === 'credit' && t.status === 'success').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                <span className="text-xs text-slate-400">Total Debits</span>
                <span className="text-sm font-medium text-red-400">
                  ${transactions.filter(t => t.type === 'debit' && t.status === 'success').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                <span className="text-xs text-slate-400">Pending</span>
                <span className="text-sm font-medium text-yellow-400">
                  {transactions.filter(t => t.status === 'pending').length}
                </span>
              </div>
            </div>
          </div>

          {/* Quote Card */}
          <div className="bg-gradient-to-br from-[#0b1220] via-[#0c1426] to-[#0b1220] border border-slate-800 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Quote className="w-4 h-4 text-vertex-blue-600" />
              <h3 className="text-base font-semibold text-white">Daily Insight</h3>
            </div>
            <blockquote className="text-slate-200 italic text-sm leading-relaxed mb-3">
              "{quoteOfTheDay.quote}"
            </blockquote>
            <div className="flex items-center justify-between">
              <cite className="text-xs text-slate-400 not-italic">
                — {quoteOfTheDay.author}
              </cite>
              <span className="text-xs text-slate-500">{quoteOfTheDay.category}</span>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="bg-gradient-to-br from-blue-950 via-blue-900/50 to-slate-900 border border-blue-800/50 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-semibold text-white">Account Status</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-400">Healthy</p>
                <p className="text-xs text-slate-400 mt-1">Your account is secure and active</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Market Overview */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <h3 className="text-base font-semibold text-white mb-4">Market Overview</h3>
          <div className="h-80 sm:h-96 md:h-[28rem] lg:h-[32rem] w-full overflow-hidden rounded-lg">
            <script src="https://widgets.coingecko.com/gecko-coin-list-widget.js"></script>
            <gecko-coin-list-widget 
              locale="en" 
              dark-mode="true" 
              outlined="true" 
              coin-ids="bitcoin,solana,ethereum,binancecoin,usd-coin,tether,dogecoin,hyperliquid,ethena,camp-network,arbitrum" 
              initial-currency="usd"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Recent Activity - Full Width */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <span className="text-xs text-slate-400">({transactions.length} transactions)</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {transactions.slice(0, 8).map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-750 transition-all cursor-pointer group"
              onClick={() => handleTransactionClick(transaction)}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(transaction.status)}
                <div>
                  <p className="text-white font-medium text-sm group-hover:text-vertex-blue-500 transition-colors">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDisplayDate(transaction.timestamp)} at {formatDisplayTime(transaction.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold text-sm ${getTypeColor(transaction.type)}`}>
                  {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
                <p className={`text-xs capitalize ${getStatusColor(transaction.status).split(' ')[0]}`}>
                  {transaction.status}
                </p>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-slate-600" />
              <p className="text-lg font-medium">No transactions yet</p>
              <p className="text-xs">Your transaction history will appear here</p>
            </div>
          )}
        </div>

        {transactions.length > 8 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <a href="/transactions" className="text-vertex-blue-600 hover:text-vertex-blue-500 text-sm font-medium">
              View all transactions →
            </a>
          </div>
        )}
      </div>

      {/* Transaction Receipt Modal */}
      {selectedTransaction && (
        <TransactionReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={closeReceiptModal}
          transaction={selectedTransaction}
          userBalance={user.balance}
        />
      )}
    </div>
  );
};

export default Dashboard;
