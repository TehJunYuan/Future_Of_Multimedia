import * as z from "zod";

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Prompt is required",
    }),
    voiceOptions: z.string().min(1),
    input: z.string().min(1),
});

export const voiceOptions = [
    {
        value: "alloy",
        label: "alloy"
    },
    {
        value: "echo",
        label: "echo"
    },
    {
        value: "fable",
        label: "fable"
    },
    {
        value: "onyx",
        label: "onyx"
    },
    {
        value: "nova",
        label: "nova"
    },
    {
        value: "shimmer",
        label: "shimmer"
    },
  ];