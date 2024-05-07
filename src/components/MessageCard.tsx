"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "./ui/button";
import { Message } from "@/model/User.model";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { cn } from "@/lib/utils";
import {format} from "date-fns"
import { X } from "lucide-react";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    const response = await axios.delete(`/api/delete-message/${message._id}`);
    toast({
      title: response.data.message,
    });
    onMessageDelete(message._id);
  };
  return (
    <Card className="w-full flex justify-between">
      <CardHeader>
        <CardTitle className=" mb-2">{message.content}</CardTitle>
        <CardDescription>{format(new Date(message.createdAt), "dd MMM, yyyy HH:mm a")}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive' className=" flex justify-center items-center"><X /></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={cn(buttonVariants({ variant: "destructive" }))}
                onClick={handleDeleteConfirm}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
