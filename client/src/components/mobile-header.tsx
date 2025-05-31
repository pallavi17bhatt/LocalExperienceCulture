import { ArrowLeft, Share, Heart, MapPin, ChevronDown } from "lucide-react";
import { Link } from "wouter";

interface MobileHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backHref?: string;
  showActions?: boolean;
  showLocation?: boolean;
}

export default function MobileHeader({ 
  title = "Lokly", 
  showBackButton = false, 
  backHref = "/",
  showActions = false,
  showLocation = false 
}: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white">
      {showBackButton ? (
        <Link href={backHref}>
          <button className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        </Link>
      ) : (
        <div />
      )}
      
      <h1 className={`font-bold ${title === "Lokly" ? "text-2xl text-primary" : "text-lg text-gray-900"}`}>
        {title}
      </h1>
      
      {showActions ? (
        <div className="flex items-center space-x-3">
          <button className="w-8 h-8 flex items-center justify-center">
            <Share className="w-5 h-5 text-gray-700" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center">
            <Heart className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      ) : showLocation ? (
        <div className="flex items-center text-primary">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="font-medium">Varanasi</span>
          <ChevronDown className="w-4 h-4 ml-1" />
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
