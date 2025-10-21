import React, { useState, useEffect } from 'react';
import { DollarSign, Save, BarChart3 } from 'lucide-react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface UserStatsEditorProps {
  userId: string;
  currentStats: {
    profits: number;
    deposits: number;
    expertTrades: number;
  };
  onStatsUpdated: (stats: { profits: number; deposits: number; expertTrades: number }) => void;
}

const AdminUserStatsEditor: React.FC<UserStatsEditorProps> = ({
  userId,
  currentStats,
  onStatsUpdated
}) => {
  const [stats, setStats] = useState(currentStats);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setStats(currentStats);
    setHasChanges(false);
  }, [currentStats]);

  const handleStatsChange = (field: 'profits' | 'deposits' | 'expertTrades', value: string) => {
    const numValue = parseFloat(value) || 0;
    setStats(prev => ({
      ...prev,
      [field]: numValue
    }));
    setHasChanges(true);
  };

  const assetsBalance = stats.profits + stats.deposits + stats.expertTrades;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    setIsSubmitting(true);
    try {
      // Calculate actual changes and amounts
      const changes: Array<{
        field: string;
        old: number;
        new: number;
        amount: number;
      }> = [];

      // Check profits
      if (stats.profits !== currentStats.profits) {
        const change = stats.profits - currentStats.profits;
        changes.push({
          field: 'Profits',
          old: currentStats.profits,
          new: stats.profits,
          amount: Math.abs(change)
        });
      }

      // Check deposits
      if (stats.deposits !== currentStats.deposits) {
        const change = stats.deposits - currentStats.deposits;
        changes.push({
          field: 'Deposits',
          old: currentStats.deposits,
          new: stats.deposits,
          amount: Math.abs(change)
        });
      }

      // Check expert trades
      if (stats.expertTrades !== currentStats.expertTrades) {
        const change = stats.expertTrades - currentStats.expertTrades;
        changes.push({
          field: 'Expert Trades',
          old: currentStats.expertTrades,
          new: stats.expertTrades,
          amount: Math.abs(change)
        });
      }

      // Update user stats in database
      const { error: updateError } = await supabase
        .from('users')
        .update({
          profits: stats.profits,
          deposits: stats.deposits,
          expert_trades: stats.expertTrades
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating stats:', updateError);
        toast.error('Failed to update stats');
        return;
      }

      // Create transaction records for each change
      for (const change of changes) {
        const isPositive = change.new > change.old;
        
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: userId,
            description: `${isPositive ? '+' : '-'}${change.field} Updated: ${isPositive ? 'Added' : 'Subtracted'} $${change.amount.toFixed(2)}`,
            amount: change.amount,
            type: isPositive ? 'credit' : 'debit',
            status: 'success',
            created_at: new Date().toISOString()
          });

        if (transactionError) {
          console.error('Error creating transaction record:', transactionError);
        }
      }

      console.log('✅ User stats updated and transactions recorded');
      toast.success(`Stats updated and ${changes.length} transaction${changes.length !== 1 ? 's' : ''} recorded!`);
      setHasChanges(false);
      onStatsUpdated(stats);
    } catch (error) {
      console.error('Error updating stats:', error);
      toast.error('Failed to update stats');
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
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-4 sm:p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
        <h3 className="text-base sm:text-lg font-semibold text-white">Portfolio Stats Editor</h3>
      </div>
      
      <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
        {/* Three Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Profits */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Profits</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={stats.profits || ''}
                onChange={(e) => handleStatsChange('profits', e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Current: {formatCurrency(currentStats.profits)}</p>
          </div>

          {/* Deposits */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Deposits</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={stats.deposits || ''}
                onChange={(e) => handleStatsChange('deposits', e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Current: {formatCurrency(currentStats.deposits)}</p>
          </div>

          {/* Expert Trades */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Expert Trades</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={stats.expertTrades || ''}
                onChange={(e) => handleStatsChange('expertTrades', e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Current: {formatCurrency(currentStats.expertTrades)}</p>
          </div>
        </div>

        {/* Assets Balance Display */}
        <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Total Assets Balance</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-2">
                {formatCurrency(assetsBalance)}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Calculation: Profits ({formatCurrency(stats.profits)}) + Deposits ({formatCurrency(stats.deposits)}) + Expert Trades ({formatCurrency(stats.expertTrades)})
              </p>
            </div>
            {hasChanges && (
              <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 rounded-lg text-sm font-medium text-center">
                Unsaved Changes
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <Button
          type="submit"
          icon={Save}
          loading={isSubmitting}
          className="w-full"
          disabled={!hasChanges || isSubmitting}
        >
          {hasChanges ? 'Save Changes' : 'No Changes'}
        </Button>
      </form>

      <p className="text-xs text-slate-500 mt-4">
        💡 Tip: These values automatically populate the user's dashboard. Changes are saved to the database immediately.
      </p>
    </div>
  );
};

export default AdminUserStatsEditor;
