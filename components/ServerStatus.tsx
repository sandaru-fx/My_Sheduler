import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Wifi, WifiOff, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface ServerStatusProps {
  className?: string;
}

const ServerStatus: React.FC<ServerStatusProps> = ({ className = '' }) => {
  const { serverConnected, connectionError, checkConnection } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Check connection on mount
  useEffect(() => {
    handleCheckConnection();
  }, []);

  const handleCheckConnection = async () => {
    setIsChecking(true);
    try {
      await checkConnection();
      setLastChecked(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2 bg-slate-900/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
        {serverConnected ? (
          <div className="flex items-center gap-1.5 text-green-400">
            <Wifi size={14} className="animate-pulse" />
            <span className="text-xs font-medium">Connected</span>
            <CheckCircle size={12} className="ml-1" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-amber-400">
            <WifiOff size={14} />
            <span className="text-xs font-medium">Offline</span>
            <AlertCircle size={12} className="ml-1" />
          </div>
        )}
        
        <button 
          onClick={handleCheckConnection}
          disabled={isChecking}
          className="ml-2 p-1 hover:bg-white/5 rounded-full transition-colors"
          title="Check connection"
        >
          <RefreshCw size={12} className={`${isChecking ? 'animate-spin text-blue-400' : 'text-gray-400'}`} />
        </button>
      </div>
      
      {connectionError && (
        <div className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-400/20">
          {connectionError}
        </div>
      )}
      
      {lastChecked && !isChecking && (
        <div className="text-[10px] text-gray-500">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default ServerStatus;
