import {z} from "zod"

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, "Content must be at least 10 characters")
        .max(300, "Content length must not exceed 300 characters")
})