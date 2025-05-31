import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Sparkles } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check if user is already authenticated
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setLocation("/");
    }
  }, []);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Dispatch custom event to notify App component
      window.dispatchEvent(new CustomEvent('userLogin'));
      
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      
      // Force a page reload to ensure proper authentication state
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Signup failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Dispatch custom event to notify App component
      window.dispatchEvent(new CustomEvent('userLogin'));
      
      toast({
        title: "Welcome to Lokly!",
        description: "Your account has been created successfully.",
      });
      
      // Force a page reload to ensure proper authentication state
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onLoginSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const onSignupSubmit = (data: SignupForm) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="h-full overflow-y-auto relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-orange-300 blur-xl"></div>
          <div className="absolute top-32 right-20 w-24 h-24 rounded-full bg-amber-300 blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 rounded-full bg-yellow-300 blur-xl"></div>
        </div>

        <div className="relative px-6 py-8 min-h-full">
          {/* Logo and Brand */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Lokly</h1>
            <p className="text-gray-600 text-lg">Discover Authentic Cultural Experiences</p>
          </div>

          {/* Features Highlight */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">Verified Hosts</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">Local Culture</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 font-medium">Small Groups</p>
            </div>
          </div>

          {/* Auth Form */}
          <div className="bg-white rounded-3xl shadow-xl p-6 max-w-md mx-auto mb-8">
            {/* Tab Switcher */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-center rounded-xl font-medium transition-all ${
                  isLogin
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-center rounded-xl font-medium transition-all ${
                  !isLogin
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Demo Account Info */}
            {isLogin && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800 font-medium mb-2">Demo Account</p>
                <p className="text-xs text-blue-600">
                  Username: <span className="font-mono">aarti_verma</span><br />
                  Password: <span className="font-mono">password123</span>
                </p>
              </div>
            )}

            {/* Forms */}
            {isLogin ? (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              {...field}
                              placeholder="Enter your username"
                              className="pl-10 h-12 rounded-xl border-gray-200"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pl-10 pr-10 h-12 rounded-xl border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl"
                  >
                    {loginMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              {...field}
                              placeholder="Enter your full name"
                              className="pl-10 h-12 rounded-xl border-gray-200"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              {...field}
                              placeholder="Choose a username"
                              className="pl-10 h-12 rounded-xl border-gray-200"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email"
                              className="pl-10 h-12 rounded-xl border-gray-200"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              {...field}
                              placeholder="Enter your phone number"
                              className="pl-10 h-12 rounded-xl border-gray-200"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password"
                              className="pl-10 pr-10 h-12 rounded-xl border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className="pl-10 h-12 rounded-xl border-gray-200"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl"
                  >
                    {signupMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            )}

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to our{" "}
              <a href="#" className="text-orange-600 underline">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-orange-600 underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}