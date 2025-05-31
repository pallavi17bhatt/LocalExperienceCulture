import { Link } from "wouter";
import { Home, Search, CalendarCheck, User } from "lucide-react";

interface BottomNavigationProps {
  currentPage?: string;
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  return (
    <div className="bottom-nav-fixed">
      <div className="flex items-center justify-around py-2">
        <Link href="/">
          <button className={`flex flex-col items-center py-2 ${
            currentPage === "home" ? "text-primary" : "text-gray-400"
          }`}>
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </button>
        </Link>
        
        <Link href="/search">
          <button className={`flex flex-col items-center py-2 ${
            currentPage === "search" ? "text-primary" : "text-gray-400"
          }`}>
            <Search className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Search</span>
          </button>
        </Link>
        
        <button className="flex flex-col items-center py-2 text-gray-400">
          <CalendarCheck className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Bookings</span>
        </button>
        
        <button className="flex flex-col items-center py-2 text-gray-400">
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
}
