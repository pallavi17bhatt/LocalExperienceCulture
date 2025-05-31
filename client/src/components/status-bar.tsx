import { Signal, Wifi, Battery } from "lucide-react";

export default function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <div className="flex items-center space-x-1">
        <Signal className="w-3 h-3" />
        <Wifi className="w-3 h-3" />
        <Battery className="w-4 h-3" />
      </div>
    </div>
  );
}
