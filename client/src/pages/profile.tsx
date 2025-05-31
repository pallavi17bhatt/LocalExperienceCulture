import { useState } from "react";
import { Link } from "wouter";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Edit,
  Bell,
  CreditCard,
  Shield,
  Globe
} from "lucide-react";

import StatusBar from "@/components/status-bar";
import MobileHeader from "@/components/mobile-header";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Mock user data - in a real app this would come from authentication
  const user = {
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    joinDate: "March 2024",
    avatar: undefined,
    totalBookings: 5,
    favoriteExperiences: 12,
    membershipLevel: "Explorer"
  };

  const menuSections = [
    {
      title: "Account",
      items: [
        { icon: Edit, label: "Edit Profile", href: "/profile/edit" },
        { icon: Calendar, label: "My Bookings", href: "/my-bookings" },
        { icon: Heart, label: "Saved Experiences", href: "/favorites" },
        { icon: CreditCard, label: "Payment Methods", href: "/payment-methods" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", action: "notifications" },
        { icon: Globe, label: "Language & Region", href: "/language" },
        { icon: Shield, label: "Privacy Settings", href: "/privacy" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", href: "/help" },
        { icon: Mail, label: "Contact Support", href: "/support" },
        { icon: Settings, label: "App Settings", href: "/settings" },
      ]
    }
  ];

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    console.log("Logging out...");
  };

  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      <StatusBar />
      <MobileHeader 
        title="Profile" 
        showBackButton={true}
        backHref="/"
      />
      
      <div className="p-4 space-y-6">
        {/* User Profile Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-orange-100 text-orange-600 text-lg font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {user.membershipLevel}
                  </Badge>
                  <span className="text-xs text-gray-500">Member since {user.joinDate}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{user.totalBookings}</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{user.favoriteExperiences}</p>
                <p className="text-sm text-gray-600">Saved Experiences</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{user.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{user.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <Card key={section.title}>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <div key={item.label}>
                    {item.action === "notifications" ? (
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{item.label}</span>
                        </div>
                        <Switch
                          checked={notificationsEnabled}
                          onCheckedChange={setNotificationsEnabled}
                        />
                      </div>
                    ) : item.href ? (
                      <Link href={item.href}>
                        <div className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-700">{item.label}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    
                    {itemIndex < section.items.length - 1 && (
                      <Separator className="my-1" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Email Preferences */}
        {notificationsEnabled && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Email Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Booking Updates</p>
                    <p className="text-sm text-gray-600">Get notified about booking confirmations and changes</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">New Experiences</p>
                    <p className="text-sm text-gray-600">Discover new cultural experiences in your area</p>
                  </div>
                  <Switch checked={true} onCheckedChange={() => {}} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Special Offers</p>
                    <p className="text-sm text-gray-600">Receive exclusive deals and promotions</p>
                  </div>
                  <Switch checked={false} onCheckedChange={() => {}} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logout Button */}
        <Card>
          <CardContent className="p-4">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500">Lokly App v1.0.0</p>
          <p className="text-xs text-gray-500">Made with ❤️ in India</p>
        </div>
      </div>
      
      <BottomNavigation currentPage="profile" />
    </div>
  );
}