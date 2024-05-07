"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { messageSchema } from "@/schemas/messageSchema";
import { nullable, z } from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { nanoid, streamToResponse } from "ai";
import { useCompletion } from "ai/react";

const PublicMessagingComponent = ({
  params,
}: {
  params: { username: string };
}) => {
  const username = params.username;

  const {
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
    complete,
    setCompletion,
  } = useCompletion({
    api: "/api/suggest-messages",
  });

  const { toast } = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const content = data.content;
      const response = await axios.post("/api/send-message", { username, content });
      toast({
        description: "Your message was send successfully",
      });
      console.log('response')
      form.setValue('content', "")
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message  ,
        variant: "destructive",
      });
    }
  };

  const suggestMessages = async () => {
    const response = await complete(
      "Create a list of four open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable  for a  diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a single thing that makes you happy?'. Ensure the questions are intriguing, foster curosity, and contribute to positive and contributing conversational environment."
    );
  };

  return (
    <div className="my-8 mx-4 h-full overflow-auto md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl flex flex-col gap-3">
      <div className=" p-2">
        <h1 className=" text-4xl font-bold mb-6 text-center">Public Profile Link</h1>
        <div className="flex flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="text-center mx-auto  max-w-screen-md">
                    <div className=" mb-2 pl-2 text-start">
                    <FormLabel>Send Anonymous Message to {username}</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        className=" pb-16 pt-4 text-md max-w-screen-md inline-block"
                        placeholder="Write your anonymous message here"
                        {...field}
                      />
                    </FormControl>
                    <div className="  mt-2 pl-2 text-start">
                    <FormMessage />
                    </div>
                    </div>
                  </FormItem>
                )}
              />
              <div className=" text-center">
                <Button type="submit" className=" text-center">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <div className=" mt-6  p-2">
        <div className=" flex flex-col text-center mx-auto  max-w-screen-md gap-3">
          <div className=" mb-2 text-start">
            <Button disabled={isLoading} onClick={suggestMessages}>
              Suggest Message
            </Button>
          </div>
          <p className=" mb-4 text-start">Click on any message below to select it.</p>
        </div>

        <div className="text-center h-60 lg:text-left max-w-screen-md border-gray-100 border-2 rounded-xl mx-auto overflow-auto">
          <h2 className=" font-bold text-xl ml-3 mt-3">Messages</h2>
          <div className=" flex flex-col p-6 justify-center items-center gap-4">
            {completion
              ? completion.split("||").map((message) => (
                  <div
                    key={nanoid()}
                    onClick={() => form.setValue("content", message)}
                    className=" hover:cursor-pointer p-2 border border-gray-200 flex items-center justify-center rounded-md text-center"
                  >
                    <p className=" font-semibold ">{message}</p>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicMessagingComponent;
