"use client";

import { Heading } from "@/components/heading";
import { FormControl, FormItem, Form, FormField } from "@/components/ui/form";
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
import Loader from "@/components/Loader"; // Assuming you have a Loader component
import Empty from "@/components/Empty"; // Assuming you have an Empty component

const TextSpeechPage = () => {
    const router = useRouter();
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Manage loading state

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            selectedVoice: "", // Ensure this matches the form field name
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setAudioUrl(null);
            setIsLoading(true);
            const response = await axios.post('/api/text-to-speech', values, {
                responseType: 'arraybuffer' // Ensure the response is an ArrayBuffer
            });
 
            // Create a Blob from the response data
            const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
 
            // Set the audio URL to state
            setAudioUrl(audioUrl);
            form.reset();
        } catch (error: any) {
            console.error("Error during submission:", error);
            if (error?.response?.status === 403) {
                toast.error("Unauthorized access.");
            } else {
                toast.error("Something went wrong.");
            }
        } finally {
            setIsLoading(false);
            router.refresh();
        }
    }

    return ( 
        <div>
            <Heading
                title="Text to Speech"
                description="Convert Your Prompt to Speech"
                icon={Mic}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
            />
            <div className="px-4 lg:px-8">
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
                            name="selectedVoice" // Ensure this matches the schema
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
                {isLoading && (
                    <div className="p-20">
                        <Loader />
                    </div>
                )}
                {!audioUrl && !isLoading && (
                    <Empty label="No audio generated." />
                )}
                {audioUrl && (
                    <div className="space-y-4 mt-4">
                        <div className="text-lg font-semibold text-gray-700">Your Result will be shown here</div>
                        <audio controls src={audioUrl} className="mt-4 w-full" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default TextSpeechPage;