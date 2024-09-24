"use client";

import { Heading } from "@/components/heading";
import { FormControl, FormItem, Form, FormField  } from "@/components/ui/form";

import { MessageSquare, Mic } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { formSchema } from "./constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";


const TextSpeechPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        console.log(values);
    };

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
                        name=""
                        render={({ field }) => (
                            <FormItem className="col-span-12 lg:col-span-4">
                            <Select>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Voice" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="voice1">voice 1</SelectItem>
                                    <SelectItem value="voice2">voice 2</SelectItem>
                                    <SelectItem value="voice3">voice 3</SelectItem>
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