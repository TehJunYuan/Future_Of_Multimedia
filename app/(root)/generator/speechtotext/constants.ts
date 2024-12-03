import * as z from "zod";

const isBrowser = typeof window !== "undefined";

export const formSchema = z.object({
    prompt: isBrowser
        ? z.instanceof(FileList).refine(files => files.length > 0, {
            message: "An audio file is required",
        })
        : z.any(), // Fallback for non-browser environments
});