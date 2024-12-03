import * as z from "zod";

export const formSchema = z.object({
    prompt: z
        .instanceof(FileList)
        .refine(files => files.length > 0, {
            message: "An audio file is required",
        }),
});