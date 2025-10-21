import React from 'react';
import { CheckCircle, Clock, Home, ArrowRight } from 'lucide-react';
import Button from '../UI/Button';
import { Link } from 'react-router-dom';

interface ConfirmationScreenProps {
  onReset: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ onReset }) => {
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
        {/* Success Icon */}
        <div className="p-4 bg-neon-green/10 rounded-2xl inline-block mb-6 animate-glow">
          <CheckCircle className="w-12 h-12 text-neon-green" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-4">
          Deposit Submitted Successfully!
        </h1>

        {/* Message */}
        <p className="text-slate-300 mb-6">
          Your deposit request has been submitted and is pending admin review. 
          Your balance will NOT be credited until an authorized admin approves and verifies your payment.
        </p>

        {/* Timeline */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-blue-400 font-medium">Review Process</span>
          </div>
          <ul className="text-slate-300 text-sm space-y-2">
            <li>✓ Admin verifies your payment proof</li>
            <li>✓ Payment is confirmed on the blockchain</li>
            <li>✓ Balance is added to your account</li>
            <li>✓ You receive a confirmation notification</li>
          </ul>
          <p className="text-sm text-slate-400 mt-4">
            Typical processing time: 1 - 2 hours
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link to="/">
            <Button className="w-full" icon={Home}>
              Back to Dashboard
            </Button>
          </Link>
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={onReset}
            icon={ArrowRight}
          >
            Make Another Deposit
          </Button>
        </div>

        {/* Support Note */}
        <div className="mt-6 p-4 bg-slate-700/50 rounded-xl">
          <p className="text-sm text-slate-300">
            <strong>Need help?</strong> Contact our support team if you don't see your 
            deposit reflected within 2 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;