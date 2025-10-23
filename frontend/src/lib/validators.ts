import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
    email: z.string().email("Địa chỉ email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = z
    .object({
        name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
        email: z.string().email("Địa chỉ email không hợp lệ"),
        password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
    });

// Quiz set schemas
export const quizSetSchema = z.object({
    title: z
        .string()
        .min(1, "Tiêu đề là bắt buộc")
        .max(100, "Tiêu đề phải nhỏ hơn 100 ký tự"),
    description: z
        .string()
        .max(500, "Mô tả phải nhỏ hơn 500 ký tự")
        .optional(),
    coverImage: z.string().url("URL hình ảnh không hợp lệ").optional(),
});

// Question schemas
export const baseQuestionSchema = z.object({
    content: z.string().min(1, "Nội dung câu hỏi là bắt buộc"),
    timeLimit: z
        .number()
        .min(5, "Giới hạn thời gian phải ít nhất 5 giây")
        .max(300, "Giới hạn thời gian phải nhỏ hơn 5 phút"),
    points: z
        .number()
        .min(1, "Điểm phải ít nhất 1")
        .max(1000, "Điểm phải nhỏ hơn 1000"),
    mediaUrl: z.string().url("URL phương tiện không hợp lệ").optional(),
    mediaType: z.enum(["image", "video"]).optional(),
});

export const multipleChoiceSchema = baseQuestionSchema.extend({
    type: z.literal("multiple_choice"),
    options: z
        .array(
            z.object({
                id: z.string(),
                text: z.string().min(1, "Nội dung lựa chọn là bắt buộc"),
                isCorrect: z.boolean(),
            })
        )
        .min(2, "Ít nhất 2 lựa chọn được yêu cầu")
        .max(6, "Tối đa 6 lựa chọn được cho phép"),
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
                left: z.string().min(1, "Mục bên trái là bắt buộc"),
                right: z.string().min(1, "Mục bên phải là bắt buộc"),
            })
        )
        .min(2, "Ít nhất 2 cặp được yêu cầu")
        .max(5, "Tối đa 5 cặp được cho phép"),
});

export const orderingSchema = baseQuestionSchema.extend({
    type: z.literal("ordering"),
    items: z
        .array(
            z.object({
                id: z.string(),
                text: z.string().min(1, "Nội dung mục là bắt buộc"),
                correctOrder: z.number(),
            })
        )
        .min(3, "Ít nhất 3 mục được yêu cầu")
        .max(6, "Tối đa 6 mục được cho phép"),
});

export const videoQuestionSchema = baseQuestionSchema.extend({
    type: z.literal("video_question"),
    videoUrl: z.string().url("URL video không hợp lệ"),
    questionTimestamp: z.number().min(0, "Dấu thời gian phải dương"),
    videoDuration: z.number().max(120, "Video phải nhỏ hơn 2 phút"),
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
    questionCount: z.number().min(1, "Ít nhất 1 câu hỏi được yêu cầu"),
    shuffleQuestions: z.boolean(),
    enableBackgroundMusic: z.boolean(),
    showLeaderboard: z.boolean(),
    timeBasedScoring: z.boolean(),
});

export const joinGameSchema = z.object({
    pin: z
        .string()
        .length(6, "PIN phải là 6 chữ số")
        .regex(/^\d{6}$/, "PIN chỉ được chứa các chữ số"),
    nickname: z
        .string()
        .min(1, "Biệt danh là bắt buộc")
        .max(20, "Biệt danh phải nhỏ hơn 20 ký tự"),
});

// File upload schemas
export const imageUploadSchema = z
    .object({
        file: z.instanceof(File),
    })
    .refine(
        (data) => data.file instanceof File,
        {
            message: "Vui lòng chọn một tệp tin",
            path: ["file"],
        }
    )
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
            message: "Tệp tin phải là hình ảnh (JPEG, PNG, GIF hoặc WebP)",
            path: ["file"],
        }
    )
    .refine(
        (data) => {
            const maxSize = 5 * 1024 * 1024; // 5MB
            return data.file.size <= maxSize;
        },
        {
            message: "Kích thước tệp phải nhỏ hơn 5MB",
            path: ["file"],
        }
    );

export const videoUploadSchema = z
    .object({
        file: z.instanceof(File),
    })
    .refine(
        (data) => data.file instanceof File,
        {
            message: "Vui lòng chọn một tệp tin",
            path: ["file"],
        }
    )
    .refine(
        (data) => {
            const allowedTypes = ["video/mp4", "video/webm"];
            return allowedTypes.includes(data.file.type);
        },
        {
            message: "Tệp tin phải là video (MP4 hoặc WebM)",
            path: ["file"],
        }
    )
    .refine(
        (data) => {
            const maxSize = 50 * 1024 * 1024; // 50MB
            return data.file.size <= maxSize;
        },
        {
            message: "Kích thước tệp phải nhỏ hơn 50MB",
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
