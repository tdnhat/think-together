import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

// Quiz set schemas
export const quizSetSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be less than 100 characters"),
    description: z
        .string()
        .max(500, "Description must be less than 500 characters")
        .optional(),
    coverImage: z.string().url("Invalid image URL").optional(),
});

// Question schemas
export const baseQuestionSchema = z.object({
    content: z.string().min(1, "Question content is required"),
    timeLimit: z
        .number()
        .min(5, "Time limit must be at least 5 seconds")
        .max(300, "Time limit must be less than 5 minutes"),
    points: z
        .number()
        .min(1, "Points must be at least 1")
        .max(1000, "Points must be less than 1000"),
    mediaUrl: z.string().url("Invalid media URL").optional(),
    mediaType: z.enum(["image", "video"]).optional(),
});

export const multipleChoiceSchema = baseQuestionSchema.extend({
    type: z.literal("multiple_choice"),
    options: z
        .array(
            z.object({
                id: z.string(),
                text: z.string().min(1, "Option text is required"),
                isCorrect: z.boolean(),
            })
        )
        .min(2, "At least 2 options required")
        .max(6, "Maximum 6 options allowed"),
});

export const trueFalseSchema = baseQuestionSchema.extend({
    type: z.literal("true_false"),
    correctAnswer: z.boolean(),
});

export const matchingSchema = baseQuestionSchema.extend({
    type: z.literal("matching"),
    pairs: z
        .array(
            z.object({
                id: z.string(),
                left: z.string().min(1, "Left item is required"),
                right: z.string().min(1, "Right item is required"),
            })
        )
        .min(2, "At least 2 pairs required")
        .max(5, "Maximum 5 pairs allowed"),
});

export const orderingSchema = baseQuestionSchema.extend({
    type: z.literal("ordering"),
    items: z
        .array(
            z.object({
                id: z.string(),
                text: z.string().min(1, "Item text is required"),
                correctOrder: z.number(),
            })
        )
        .min(3, "At least 3 items required")
        .max(6, "Maximum 6 items allowed"),
});

export const videoQuestionSchema = baseQuestionSchema.extend({
    type: z.literal("video_question"),
    videoUrl: z.string().url("Invalid video URL"),
    questionTimestamp: z.number().min(0, "Timestamp must be positive"),
    videoDuration: z.number().max(120, "Video must be less than 2 minutes"),
});

export const questionSchema = z.discriminatedUnion("type", [
    multipleChoiceSchema,
    trueFalseSchema,
    matchingSchema,
    orderingSchema,
    videoQuestionSchema,
]);

// Game schemas
export const gameSettingsSchema = z.object({
    questionCount: z.number().min(1, "At least 1 question required"),
    shuffleQuestions: z.boolean(),
    enableBackgroundMusic: z.boolean(),
    showLeaderboard: z.boolean(),
    timeBasedScoring: z.boolean(),
});

export const joinGameSchema = z.object({
    pin: z
        .string()
        .length(6, "PIN must be 6 digits")
        .regex(/^\d{6}$/, "PIN must contain only numbers"),
    nickname: z
        .string()
        .min(1, "Nickname is required")
        .max(20, "Nickname must be less than 20 characters"),
});

// File upload schemas
export const imageUploadSchema = z
    .object({
        file: z.instanceof(File, "Please select a file"),
    })
    .refine(
        (data) => {
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/webp",
            ];
            return allowedTypes.includes(data.file.type);
        },
        {
            message: "File must be an image (JPEG, PNG, GIF, or WebP)",
            path: ["file"],
        }
    )
    .refine(
        (data) => {
            const maxSize = 5 * 1024 * 1024; // 5MB
            return data.file.size <= maxSize;
        },
        {
            message: "File size must be less than 5MB",
            path: ["file"],
        }
    );

export const videoUploadSchema = z
    .object({
        file: z.instanceof(File, "Please select a file"),
    })
    .refine(
        (data) => {
            const allowedTypes = ["video/mp4", "video/webm"];
            return allowedTypes.includes(data.file.type);
        },
        {
            message: "File must be a video (MP4 or WebM)",
            path: ["file"],
        }
    )
    .refine(
        (data) => {
            const maxSize = 50 * 1024 * 1024; // 50MB
            return data.file.size <= maxSize;
        },
        {
            message: "File size must be less than 50MB",
            path: ["file"],
        }
    );

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type QuizSetFormData = z.infer<typeof quizSetSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
export type GameSettingsFormData = z.infer<typeof gameSettingsSchema>;
export type JoinGameFormData = z.infer<typeof joinGameSchema>;
export type ImageUploadFormData = z.infer<typeof imageUploadSchema>;
export type VideoUploadFormData = z.infer<typeof videoUploadSchema>;
