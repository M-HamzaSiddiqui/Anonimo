'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod'
import "../../../app/globals.css";
import { Loader2 } from 'lucide-react';

const Page = () => {
  const[isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async(data: z.infer<typeof signInSchema>) => {
    try {
      setIsSubmitting(true)
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })
      setIsSubmitting(false)
      console.log(result)
      if(result?.error) {
        toast({
          title: "Login failed",
          description: "Incorrect username or password",
          variant: 'destructive'
        })
      } 
      console.log(result?.url)
      if(result?.url) {
        router.replace('/dashboard')
      }
    } catch (error: any) {
      console.log("Error", error.message)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-10 bg-white rounded-lg shadow-md">
      <div className=" text-center">
          <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Sign in Mystery Message
          </h1>
          <p className=" mb-4">Sign in to message anonymously</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField 
              name='identifier'
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder='email'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField 
              name='password'
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type='password'
                      placeholder='password'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type='submit' disabled = {isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className=" mr-2 h-4 w-4 animate-spin"/> Please wait
                </>
              ) : 'Sign in'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page