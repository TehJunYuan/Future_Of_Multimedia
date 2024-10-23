"use client";

import { Heading } from "@/components/heading";
import { FormControl, FormItem, Form, FormField } from "@/components/ui/form";
import { MessageSquare, Mic } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { formSchema } from "./constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "@/components/Loader"; // Import the Loader component
import Empty from "@/components/Empty"; // Import the Empty component

const SpeechTextPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: new DataTransfer().files // Initialize with an empty FileList
        }
    });

    const [transcription, setTranscription] = useState("");
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData();
            formData.append('audio', values.prompt[0]); // Assuming 'prompt' holds the file

            const response = await fetch('/api/speech-to-text', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to transcribe audio');
            }

            const data = await response.json();
            setTranscription(data.transcription);
        } catch (error) {
            console.error("Error transcribing audio:", error);
        }
    };

    const copyToClipboard = () => {
        if (transcription) {
            navigator.clipboard.writeText(transcription).then(() => {
                toast.success("Text copied to clipboard!");
            }).catch(err => {
                console.error("Failed to copy text: ", err);
            });
        }
    };

    return (
        <div>
            <Heading
                title="Speech to Text"
                description="Convert Your Speech to Text"
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
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                disabled={isLoading}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const files = e.target.files;
                                                    if (files) {
                                                        field.onChange(files);
                                                    }
                                                }}
                                            />
                                            <div
                                                className={`flex items-center justify-between border border-gray-300 rounded-md p-3 
                                                ${isLoading ? "bg-gray-100" : "bg-white"} 
                                                transition-all focus-within:border-black-500`}
                                            >
                                                <span className="text-gray-500">
                                                    {field.value?.[0]?.name || "Upload your file"}
                                                </span>
                                                <span className="text-black-500 font-semibold">
                                                    Browse
                                                </span>
                                            </div>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="col-span-12 lg:col-span-2 w-full flex items-center justify-center px-4 py-2 disabled:bg-gray-400"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM12 20a8 8 0 010-16V0c6.627 0 12 5.373 12 12h-4a8 8 0 01-8 8z"
                                    ></path>
                                </svg>
                            ) : (
                                "Generate"
                            )}
                        </Button>
                    </form>
                </Form>
                {isLoading ? (
                    <div className="p-20">
                        <Loader /> {/* Display the loader when loading */}
                    </div>
                ) : (
                    transcription ? (
                        <div className="space-y-4 mt-8">
                            <div className="text-lg font-semibold text-gray-700">Result</div>
                            <textarea
                                id="result"
                                name="result"
                                rows={6}
                                className="w-full p-4 border border-gray-300 rounded-md focus:border-violet-500 focus:ring-violet-500 transition-all resize-none bg-gray-50 text-gray-700"
                                placeholder="Your generated result will appear here..."
                                value={transcription}
                                readOnly
                            ></textarea>
                            <Button
                                onClick={copyToClipboard}
                                className="col-span-12 lg:col-span-2 w-full"
                            >
                                Copy to Clipboard
                            </Button>
                        </div>
                    ) : (
                        <Empty label="No transcription available." />
                    )
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default SpeechTextPage;