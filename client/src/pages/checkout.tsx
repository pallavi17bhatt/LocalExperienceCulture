import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, Lock, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBooking } from "@/hooks/use-booking";
import { apiRequest } from "@/lib/queryClient";
import StatusBar from "@/components/status-bar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const checkoutSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  paymentMethod: z.enum(["upi", "card"], {
    required_error: "Please select a payment method",
  }),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { bookingData } = useBooking();
  const { toast } = useToast();

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      paymentMethod: "upi",
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      if (!bookingData) throw new Error("No booking data");
      
      const bookingPayload = {
        experienceId: bookingData.experienceId,
        packageId: bookingData.package.id,
        timeSlotId: bookingData.timeSlot.id,
        selectedDate: bookingData.selectedDate,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        paymentMethod: data.paymentMethod,
        totalAmount: Math.floor(bookingData.package.price * 1.28), // Adding taxes/fees
      };

      const response = await apiRequest("POST", "/api/bookings", bookingPayload);
      return response.json();
    },
    onSuccess: (booking) => {
      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed.",
      });
      setLocation(`/confirmation/${booking.bookingId}`);
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutForm) => {
    createBookingMutation.mutate(data);
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">No booking data found</h2>
          <Link href="/" className="text-primary">Return to home</Link>
        </div>
      </div>
    );
  }

  const totalAmount = Math.floor(bookingData.package.price * 1.28); // Adding 28% taxes/fees

  return (
    <div className="min-h-screen bg-white">
      <StatusBar />
      
      {/* Header */}
      <div className="flex items-center px-6 py-4 bg-white">
        <Link href={`/availability/${bookingData.experienceId}`}>
          <button className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">Checkout & Payment</h1>
      </div>

      {/* Booking Summary */}
      <div className="px-6 py-4 bg-white">
        <div className="flex items-center p-4 bg-gray-50 rounded-xl mb-6">
          <img 
            src={bookingData.experience.imageUrl} 
            alt={bookingData.experience.title}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div className="ml-4 flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{bookingData.experience.title}</h3>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Wednesday, {bookingData.selectedDate}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Clock className="w-4 h-4 mr-2" />
              <span>{bookingData.timeSlot.startTime} - {bookingData.timeSlot.endTime} (2 hours)</span>
            </div>
            <span className="text-primary font-semibold">
              ₹{Math.floor(bookingData.package.price / 100)} per person
            </span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 pb-20">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Attendee Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendee Details</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input 
                            placeholder="Enter your full name" 
                            className="pl-12 form-input"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Contact Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input 
                            type="tel" 
                            placeholder="Enter your mobile number" 
                            className="pl-12 form-input"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="pl-12 form-input"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <p className="text-sm text-gray-500 mt-2">Your booking confirmation will be sent to this email</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
              
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                      >
                        <div className="flex items-center p-4 border-2 border-primary rounded-xl">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="ml-3 flex-1 cursor-pointer">
                            <div className="font-semibold text-gray-900">UPI</div>
                            <div className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center p-4 border-2 border-gray-200 rounded-xl">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="ml-3 flex-1 cursor-pointer">
                            <div className="font-semibold text-gray-900">Credit/Debit Card</div>
                            <div className="text-sm text-gray-500">Visa, Mastercard, RuPay</div>
                          </Label>
                          <div className="flex space-x-2">
                            <div className="w-8 h-5 bg-blue-600 rounded text-xs text-white flex items-center justify-center">VISA</div>
                            <div className="w-8 h-5 bg-red-600 rounded text-xs text-white flex items-center justify-center">MC</div>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Security Info */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-600">Secure Payment</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total:</div>
                <div className="text-lg font-bold text-gray-900">₹{Math.floor(totalAmount / 100)}</div>
              </div>
            </div>

            {/* Payment Button */}
            <button 
              type="submit"
              disabled={createBookingMutation.isPending}
              className="w-full py-4 bg-primary text-white font-semibold rounded-xl flex items-center justify-center disabled:opacity-50"
            >
              {createBookingMutation.isPending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              <span>{createBookingMutation.isPending ? "Processing..." : "Pay & Confirm Booking"}</span>
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
