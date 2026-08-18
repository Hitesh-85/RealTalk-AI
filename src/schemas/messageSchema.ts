import {z} from 'zod';

export const messageSchema = z.object({
    content: z
    .string()
    .min(10, {message: 'content must be at last of 10characters'})
    .max(300, {message: 'content must be not more than 300 characters'})
})