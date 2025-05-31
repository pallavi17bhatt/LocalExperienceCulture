import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookingProvider } from "@/hooks/use-booking";
import LoadingScreen from "@/components/loading-screen";

import Home from "@/pages/home";
import Search from "@/pages/search";
import ExperienceDetail from "@/pages/experience-detail";
import Availability from "@/pages/availability";
import Checkout from "@/pages/checkout";
import Confirmation from "@/pages/confirmation";
import MyBookings from "@/pages/my-bookings";
import Profile from "@/pages/profile";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";

function Router() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status first
    const userData = localStorage.getItem("user");
    setIsAuthenticated(!!userData);

    // Show loading screen for new users only
    if (!userData) {
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
      }, 2500);
      return () => clearTimeout(loadingTimer);
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading && !isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route component={Landing} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/experience/:id" component={ExperienceDetail} />
          <Route path="/availability/:id" component={Availability} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/confirmation/:bookingId" component={Confirmation} />
          <Route path="/my-bookings" component={MyBookings} />
          <Route path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BookingProvider>
          <div className="mobile-container">
            <Toaster />
            <Router />
          </div>
        </BookingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
