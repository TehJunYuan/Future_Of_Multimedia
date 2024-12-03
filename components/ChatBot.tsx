"use client";
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { formSchema } from "@/app/(root)/generator/conversation/constants"; // Adjust the import path
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { cn } from "@/lib/utils";
import Loader from "@/components/Loader";
import Empty from "@/components/Empty";
import Image from "next/image";
import { Send } from 'lucide-react';
import * as z from "zod";
import ThreeDotsLoader from './ThreeDotsLoader';
// ... rest of the imports
interface ChatCompletionRequestMessage {
  role: string;
  content: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([
    {
      role: "assistant",
      content: "Hi, Welcome to Future of Multimedia. What can I help you?"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const toggleChat = () => setIsOpen(!isOpen);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = { role: "user", content: values.prompt };
      const newMessages = [...messages, userMessage];

      const response = await axios.post('/api/conversation', { messages: newMessages });
      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        // Handle specific error
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <div className="fixed bottom-20 right-8 z-50 md:bottom-8">
      <button 
        onClick={toggleChat} 
        className={cn(
          "p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        )}
      >
        <Image 
          src={isOpen ? "/assets/icons/close.svg" : "/assets/icons/chat.svg"} 
          alt={isOpen ? "Close chat" : "Open chat"} 
          width={24} 
          height={24}
          className="invert"
        />
      </button>
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] h-[600px] bg-white rounded-lg shadow-xl border overflow-hidden">
          <div className="flex items-center justify-between bg-blue-500 p-4 text-white">
          <h3 className="font-semibold">Future of Multimedia</h3>
          </div>
          <div className="chatbot-messages h-[460px] overflow-y-auto p-4 flex flex-col-reverse gap-y-4">
            <div className="flex flex-col gap-y-4">
              {messages.map((message) => (
                <div
                  key={message.content}
                  className={cn(
                    "flex items-start gap-x-3",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className="flex-shrink-0">
                    {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                  </div>
                  <div
                    className={cn(
                      "p-4 rounded-2xl max-w-[85%] text-sm",
                      message.role === "user" 
                        ? "bg-blue-500 text-white rounded-tr-none" 
                        : "bg-gray-100 text-gray-900 rounded-tl-none"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center justify-center">
                  <ThreeDotsLoader />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="absolute bottom-0 w-full bg-gray-100 border-t p-4"
            >
              <div className="flex items-center gap-2">
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          className="border-0 rounded-full bg-white focus-visible:ring-0 focus-visible:ring-transparent pl-4 pr-10"
                          disabled={isLoading}
                          placeholder="Type a message..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button 
                  className="rounded-full p-2 w-10 h-10 bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
                  type="submit" 
                  disabled={isLoading} 
                  size="icon"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;