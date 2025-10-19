import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Home, History, User, X, Settings } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillTransfer, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  user: any;
  onClose?: () => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onClose, onLogout }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Deposit', href: '/deposit', icon: 'deposit' },
    { name: 'Withdraw', href: '/withdraw', icon: 'withdraw' },
    { name: 'Transactions', href: '/transactions', icon: History },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col h-full bg-[#0b0b0c] border-r border-slate-800">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-800">
        <img
          src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/405b6af4-fc2b-4340-a894-ac812f27e041-bull-svgrepo-com%20(1).png"
          alt="BullionFX Logo"
          className="h-10 w-10 object-contain drop-shadow-md"
          style={{ background: 'transparent' }}
        />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <span className="text-lg font-semibold text-white">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user?.email?.split('@')[0] || 'User'
              }
            </span>
            <p className="text-xs text-slate-400">Welcome back</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const renderIcon = () => {
            if (item.icon === 'deposit') {
              return <FontAwesomeIcon icon={faMoneyBillTransfer} className="w-5 h-5 mr-3" />;
            } else if (item.icon === 'withdraw') {
              return <FontAwesomeIcon icon={faHandHoldingDollar} className="w-5 h-5 mr-3" />;
            } else {
              const Icon = item.icon;
              return <Icon className="w-5 h-5 mr-3" />;
            }
          };

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                ${isActive(item.href)
                  ? 'bg-vertex-blue-600/15 text-vertex-blue border border-vertex-blue-600/30 shadow-[0_0_0_1px_rgba(37,99,235,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }
              `}
            >
              {renderIcon()}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-slate-700">
        <button
          onClick={() => {
            if (confirm('Sign out of BullionFX?')) {
              onLogout?.();
            }
          }}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;