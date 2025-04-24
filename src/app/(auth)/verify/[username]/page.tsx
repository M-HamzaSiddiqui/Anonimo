'use client'

import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2, ArrowRight, Mail } from "lucide-react";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.log("Error while verifying account", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Verification failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    toast({
      title: "Code sent",
      description: "A new verification code has been sent to your email",
    });
    // Add actual implementation for resending code here
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
            Verify Your <span className="text-indigo-600">Account</span>
          </h1>
          <p className="text-gray-500">
            Please enter the 6-digit code sent to your email
          </p>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg mb-6 flex items-center">
          <Mail className="text-indigo-600 h-5 w-5 mr-3" />
          <p className="text-sm text-indigo-800">
            A verification code has been sent to <strong>{params.username}&apos;s</strong> registered email
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-gray-700 text-center block">Verification Code</FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} {...field} className="gap-2">
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="w-12 h-14 text-xl border-gray-300 focus:border-indigo-500" />
                          <InputOTPSlot index={1} className="w-12 h-14 text-xl border-gray-300 focus:border-indigo-500" />
                          <InputOTPSlot index={2} className="w-12 h-14 text-xl border-gray-300 focus:border-indigo-500" />
                          <InputOTPSlot index={3} className="w-12 h-14 text-xl border-gray-300 focus:border-indigo-500" />
                          <InputOTPSlot index={4} className="w-12 h-14 text-xl border-gray-300 focus:border-indigo-500" />
                          <InputOTPSlot index={5} className="w-12 h-14 text-xl border-gray-300 focus:border-indigo-500" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage className="text-center" />
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
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Verify Account</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              )}
            </Button>
          </form>
        </Form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Didn&apos;t receive a code?{' '}
            <button 
              onClick={handleResendCode}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Resend code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;