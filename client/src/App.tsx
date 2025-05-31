import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookingProvider } from "@/hooks/use-booking";

import Home from "@/pages/home";
import Search from "@/pages/search";
import ExperienceDetail from "@/pages/experience-detail";
import Availability from "@/pages/availability";
import Checkout from "@/pages/checkout";
import Confirmation from "@/pages/confirmation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/experience/:id" component={ExperienceDetail} />
      <Route path="/availability/:id" component={Availability} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/confirmation/:bookingId" component={Confirmation} />
      <Route component={NotFound} />
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
