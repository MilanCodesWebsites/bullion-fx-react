import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminUserStatsEditor from './AdminUserStatsEditor';
import AdminProfitDeduction from './AdminProfitDeduction';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  status: 'pending' | 'success' | 'denied';
  timestamp: Date;
  type: 'credit' | 'debit';
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  initialBalance: number;
  avatar: string | null;
  transactions: Transaction[];
  profits?: number;
  deposits?: number;
  expertTrades?: number;
}

const AdminUserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAllUsers } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  // Load user data from Supabase
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setIsLoadingTransactions(true);
        
        const users = await getAllUsers();
        const targetUser = users.find(u => u.id === id);
        if (targetUser) {
          setUser(targetUser);
          console.log('✅ User data loaded from Supabase:', targetUser);
          
          // Load transactions
          await loadTransactions(targetUser.id);
        } else {
          console.log('❌ User not found:', id);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [id, getAllUsers]);

  // Load user transactions from Supabase
  const loadTransactions = async (userId: string) => {
    try {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading transactions:', error);
        return;
      }

      const localTransactions = (transactions || []).map(tx => ({
        id: tx.id,
        amount: tx.amount,
        description: tx.description,
        status: tx.status,
        timestamp: new Date(tx.created_at),
        type: tx.type
      }));

      setUserTransactions(localTransactions);
      console.log(`✅ Loaded ${localTransactions.length} transactions for user ${userId}`);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Show loading state while user data is being fetched
  if (isLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center text-slate-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading user data...</p>
          {isLoading && (
            <p className="text-xs text-slate-500 mt-2">Fetching from Supabase...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Manage User Portfolio</h1>
          <p className="text-slate-400">{user.firstName} {user.lastName} • {user.email}</p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-800/70 border border-slate-700/50 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-2xl text-slate-400 font-semibold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user.firstName} {user.lastName}</h2>
            <p className="text-slate-400">{user.email}</p>
          </div>
        </div>

        {/* Assets Balance Display */}
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 sm:p-6">
          <p className="text-sm text-slate-400 mb-2">Assets Balance</p>
          <p className="text-3xl sm:text-4xl font-bold text-white">
            ${((user.profits || 0) + (user.deposits || 0) + (user.expertTrades || 0)).toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Profits: ${(user.profits || 0).toFixed(2)} + Deposits: ${(user.deposits || 0).toFixed(2)} + Expert Trades: ${(user.expertTrades || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Portfolio Manager - Main Section */}
      <div>
        <AdminUserStatsEditor
          userId={user.id}
          currentStats={{
            profits: user.profits || 0,
            deposits: user.deposits || 0,
            expertTrades: user.expertTrades || 0
          }}
          onStatsUpdated={(stats) => {
            // Refresh user data
            if (user) {
              setUser({
                ...user,
                profits: stats.profits,
                deposits: stats.deposits,
                expertTrades: stats.expertTrades
              });
            }
            // Reload transactions
            if (user) {
              loadTransactions(user.id);
            }
          }}
        />
      </div>

      {/* Trading Loss Deduction */}
      <AdminProfitDeduction
        userId={user.id}
        currentProfits={user.profits || 0}
        onDeductionCompleted={() => {
          // Reload user data and transactions
          if (user) {
            loadTransactions(user.id);
          }
          // Refresh user data from Supabase
          const refreshUser = async () => {
            const users = await getAllUsers();
            const updated = users.find(u => u.id === id);
            if (updated) {
              setUser(updated);
            }
          };
          refreshUser();
        }}
      />

      {/* Transaction History Section */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>
        
        <div className="space-y-3">
          {isLoadingTransactions ? (
            <div className="text-center py-8 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3"></div>
              <p>Loading transactions...</p>
            </div>
          ) : userTransactions.length > 0 ? (
            userTransactions.map((transaction) => (
              <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30 gap-3">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    transaction.status === 'success' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                    transaction.status === 'pending' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                    'text-red-400 bg-red-400/10 border-red-400/20'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium truncate">{transaction.description}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(transaction.timestamp).toLocaleDateString()} at {new Date(transaction.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold text-lg ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">{transaction.type}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
