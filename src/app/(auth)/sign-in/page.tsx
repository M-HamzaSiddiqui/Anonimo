"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import "../../../app/globals.css";
import { Loader2, ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SignInComponent = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      setIsSubmitting(true);
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      
      setIsSubmitting(false);
      
      if (result?.error) {
        toast({
          title: "Unable to login",
          description: result?.error,
          variant: "destructive",
        });
      }
      
      if (result?.url) {
        router.replace("/dashboard");
      }
    } catch (error: any) {
      console.log("Error", error.message);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <ShieldCheck className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Sign in to <span className="text-indigo-600">Anonylytics</span>
          </h1>
          <p className="text-gray-500">
            Securely access your anonymous messaging dashboard
          </p>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-indigo-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your identity remains protected while using our platform
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Your email address" 
                        className="pl-10 py-6 bg-gray-50 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
                      Forgot password?
                    </a>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        type="password" 
                        placeholder="Your password" 
                        className="pl-10 py-6 bg-gray-50 border-gray-200 focus:ring-indigo-500 focus:border-indigo-500" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Sign in</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              )}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInComponent;