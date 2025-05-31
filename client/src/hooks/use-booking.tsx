import { createContext, useContext, useState, ReactNode } from "react";
import type { Experience, TimeSlot, Package } from "@shared/schema";

interface BookingData {
  experienceId: number;
  experience: Experience;
  timeSlot: TimeSlot;
  package: Package;
  selectedDate: string;
}

interface BookingContextType {
  bookingData: BookingData | null;
  setBookingData: (data: BookingData) => void;
  clearBookingData: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingDataState] = useState<BookingData | null>(null);

  const setBookingData = (data: BookingData) => {
    setBookingDataState(data);
    // Persist to localStorage for page refreshes
    localStorage.setItem("lokly-booking", JSON.stringify(data));
  };

  const clearBookingData = () => {
    setBookingDataState(null);
    localStorage.removeItem("lokly-booking");
  };

  // Initialize from localStorage on mount
  useState(() => {
    try {
      const saved = localStorage.getItem("lokly-booking");
      if (saved) {
        setBookingDataState(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading booking data:", error);
    }
  });

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData, clearBookingData }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
