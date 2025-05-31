import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  Globe,
  LogIn
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
    const userData = localStorage.getItem("user");
    setIsAuthenticated(!!userData);
  }, []);

  // Fetch user profile data from server
  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: () => fetch("/api/auth/me", { credentials: 'include' }).then(res => {
      if (!res.ok) throw new Error('Failed to fetch user data');
      return res.json();
    }),
    enabled: isAuthenticated,
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await fetch("/api/auth/logout", {
        method: "POST",
        credentials: 'include',
      });
    },
    onSuccess: () => {
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      
      // Dispatch custom event to notify App component
      window.dispatchEvent(new CustomEvent('userLogout'));
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "There was an error signing you out.",
        variant: "destructive",
      });
    },
  });

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
    logoutMutation.mutate();
  };

  // Calculate member since date
  const getMemberSince = (createdAt: string) => {
    return new Date(createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
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
        {/* Authentication Required */}
        {!isAuthenticated && (
          <Card>
            <CardContent className="p-6 text-center">
              <LogIn className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Sign in to view your profile</h3>
              <p className="text-gray-600 mb-4">
                Access your account settings and personal information
              </p>
              <div className="flex gap-2 justify-center">
                <Link href="/login">
                  <Button>Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline">Create Account</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isAuthenticated && isLoading && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {isAuthenticated && error && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">Unable to load profile data</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* User Profile Section */}
        {isAuthenticated && userProfile && (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-orange-100 text-orange-600 text-lg font-semibold">
                      {userProfile.fullName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{userProfile.fullName}</h2>
                    <p className="text-gray-600">@{userProfile.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        Explorer
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Member since {getMemberSince(userProfile.createdAt || new Date().toISOString())}
                      </span>
                    </div>
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
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{userProfile.email}</span>
                  </div>
                  {userProfile.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{userProfile.phone}</span>
                    </div>
                  )}
                  {userProfile.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{userProfile.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Menu Sections - Only show for authenticated users */}
        {isAuthenticated && userProfile && menuSections.map((section, sectionIndex) => (
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

        {/* Email Preferences - Only show for authenticated users */}
        {isAuthenticated && userProfile && notificationsEnabled && (
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

        {/* Logout Button - Only show for authenticated users */}
        {isAuthenticated && userProfile && (
          <Card>
            <CardContent className="p-4">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-4 h-4" />
                {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
              </Button>
            </CardContent>
          </Card>
        )}

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