import { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export default function InstallPrompt() {
  const { isInstallable, installApp } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) {
    return null;
  }

  const handleInstall = () => {
    installApp();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Install Lokly</h3>
            <p className="text-sm text-gray-600">Add to home screen for quick access</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex space-x-3 mt-4">
        <button
          onClick={handleInstall}
          className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-medium"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium"
        >
          Not now
        </button>
      </div>
    </div>
  );
}