"use client";

import { Heading } from "@/components/heading";
import { FormControl, FormItem, Form, FormField  } from "@/components/ui/form";

import { Mic } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { formSchema, voiceOptions } from "./constants";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

const TextSpeechPage = () => {
    const router = useRouter();
    const [voice, setVoices] = useState<string[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          setVoices([]);
    
          const response = await axios.post('/api/image', values);
    
          const urls = response.data.map((image: { url: string }) => image.url);
    
          setVoices(urls);
          form.reset();
        } catch (error: any) {
          if (error?.response?.status === 403) {
    
          } else {
            toast.error("Something went wrong.");
          }
        } finally {
          router.refresh();
        }
      }

    return ( 
        <div>
            <Heading
                title="Text to Spech"
                description="Convert Your Text to Speech"
                icon={Mic}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="
                        rounded-lg 
                        border 
                        w-full 
                        p-4 
                        px-3 
                        md:px-6 
                        focus-within:shadow-sm
                        grid
                        grid-cols-12
                        gap-2
                        "
                    >
                        <FormField
                        name="prompt"
                        render={({ field }) => (
                            <FormItem className="col-span-12 lg:col-span-6">
                            <FormControl className="m-0 p-0">
                                <Textarea
                                className="border-2 border-gray-300 rounded-md p-2"
                                disabled={isLoading} 
                                placeholder="Insert Your Text here ....." 
                                {...field}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                        <FormField
                        name="selectedVoice"
                        render={({ field }) => (
                            <FormItem className="col-span-12 lg:col-span-4">
                                <Select 
                                    disabled={isLoading} 
                                    onValueChange={field.onChange} 
                                    value={field.value} 
                                    defaultValue={field.value}
                                >
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Voice" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {voiceOptions.map((option) => (
                                        <SelectItem 
                                        key={option.value} 
                                        value={option.value}
                                        >
                                        {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            </FormItem>
                        )}
                        />
                        <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                        Generate
                        </Button>
                    </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    <div className="text-lg font-semibold text-gray-700">Your Result will be show here</div>
                </div>
            </div>
        </div>
     );
}
 
export default TextSpeechPage;