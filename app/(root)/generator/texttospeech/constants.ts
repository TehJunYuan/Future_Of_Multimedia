import * as z from "zod";

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: "Prompt is required",
    }),
    selectedVoice: z.string().min(1, {
        message: "Voice selection is required",
    }),
});

export const voiceOptions = [
    {
        value: "alloy",
        label: "Alloy"
    },
    {
        value: "echo",
        label: "Echo"
    },
    {
        value: "fable",
        label: "Fable"
    },
    {
        value: "onyx",
        label: "Onyx"
    },
    {
        value: "nova",
        label: "Nova"
    },
    {
        value: "shimmer",
        label: "Shimmer"
    },
];