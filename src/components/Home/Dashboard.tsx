import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Quote, Eye, EyeOff, Shield } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillTransfer, faHandHoldingDollar, faChartLine, faCreditCard } from '@fortawesome/free-solid-svg-icons';
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

  // Receipt modal state
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Balance visibility toggles - individual for each card
  const [showBalance, setShowBalance] = useState(true);
  const [showProfits, setShowProfits] = useState(true);
  const [showDeposits, setShowDeposits] = useState(true);
  const [showExpertTrades, setShowExpertTrades] = useState(true);

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

  // Extract stats from user data or context
  // These will be populated by admin edits
  const profits = user?.profits || 0;
  const deposits = user?.deposits || 0;
  const expertTrades = user?.expertTrades || 0;
  const assetsBalance = profits + deposits + expertTrades;

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

      {/* Main Assets Balance Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-[#1a2a4a] via-[#1a2642] to-[#0f1a34] p-6 sm:p-8 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-300 font-medium text-sm">Assets Balance</h2>
          <button
            onClick={() => setShowBalance(s => !s)}
            className="p-2 text-slate-400 hover:text-white transition"
            aria-label={showBalance ? 'Hide balance' : 'Show balance'}
          >
            {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Balance Display */}
        <div className={`text-5xl sm:text-6xl font-bold text-white mb-6 ${!showBalance ? 'blur-sm select-none' : ''}`}>
          ${assetsBalance.toFixed(2)}
        </div>

        {/* Time Period Stats */}
        <div className="flex gap-8">
          <div>
            <p className="text-slate-400 text-xs mb-1">Today</p>
            <p className="text-green-400 font-semibold text-lg">+2.5% ↗</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">7 Days</p>
            <p className="text-green-400 font-semibold text-lg">+4.25% ↗</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">30 Days</p>
            <p className="text-green-400 font-semibold text-lg">+11.5% ↗</p>
          </div>
        </div>
      </div>

      {/* Three Stat Cards - Inverted Triangle Layout (2 top, 1 centered bottom on mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Profits Card - Blue */}
        <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-[#3a5a7f] via-[#3a5a7f] to-[#2a4a6f] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/30 flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 text-blue-300" />
            </div>
            <button
              onClick={() => setShowProfits(s => !s)}
              className="p-2 text-slate-400 hover:text-white transition"
            >
              {showProfits ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <h3 className="text-slate-300 font-medium text-sm mb-2">Profits</h3>
          <p className={`text-3xl sm:text-4xl font-bold ${!showProfits ? 'blur-sm' : 'text-white'}`}>
            ${profits.toFixed(2)}
          </p>
        </div>

        {/* Deposits Card - Tan/Brown */}
        <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-[#8b7355] via-[#8b7355] to-[#7a6245] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-600/30 flex items-center justify-center">
              <FontAwesomeIcon icon={faCreditCard} className="w-5 h-5 text-amber-300" />
            </div>
            <button
              onClick={() => setShowDeposits(s => !s)}
              className="p-2 text-slate-400 hover:text-white transition"
            >
              {showDeposits ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <h3 className="text-slate-200 font-medium text-sm mb-2">Deposits</h3>
          <p className={`text-3xl sm:text-4xl font-bold ${!showDeposits ? 'blur-sm' : 'text-white'}`}>
            ${deposits.toFixed(2)}
          </p>
        </div>

        {/* Expert Trades Card - Green - Centered on mobile */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-700 bg-gradient-to-br from-[#5a9a6f] via-[#5a9a6f] to-[#4a8a5f] p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-full bg-green-600/30 flex items-center justify-center">
              <FontAwesomeIcon icon={faMoneyBillTransfer} className="w-5 h-5 text-green-300" />
            </div>
            <button
              onClick={() => setShowExpertTrades(s => !s)}
              className="p-2 text-slate-400 hover:text-white transition"
            >
              {showExpertTrades ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <h3 className="text-slate-200 font-medium text-sm mb-2">Expert Trades</h3>
          <p className={`text-3xl sm:text-4xl font-bold ${!showExpertTrades ? 'blur-sm' : 'text-white'}`}>
            ${expertTrades.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/deposit"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faMoneyBillTransfer} className="w-5 h-5" />
            Deposit
          </Link>
          <Link
            to="/withdraw"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faHandHoldingDollar} className="w-5 h-5" />
            Withdraw
          </Link>
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
                <span className="text-xs text-slate-400">Total Profits</span>
                <span className="text-sm font-medium text-green-400">
                  ${profits.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                <span className="text-xs text-slate-400">Total Losses</span>
                <span className="text-sm font-medium text-red-400">
                  ${transactions.filter(t => t.type === 'debit' && t.status === 'success' && t.description.includes('Trading Loss')).reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg">
                <span className="text-xs text-slate-400">P&L</span>
                <span className={`text-sm font-medium ${profits - transactions.filter(t => t.type === 'debit' && t.status === 'success' && t.description.includes('Trading Loss')).reduce((sum, t) => sum + t.amount, 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${(profits - transactions.filter(t => t.type === 'debit' && t.status === 'success' && t.description.includes('Trading Loss')).reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}
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
