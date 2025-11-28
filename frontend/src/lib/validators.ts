import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
    email: z.string().email("Địa chỉ email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    rememberMe: z.boolean().optional(),
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

export const confirmEmailSchema = z.object({
    token: z.string().min(1, "Token xác nhận email là bắt buộc"),
});

export const resendEmailConfirmationSchema = z.object({
    email: z.string().email("Địa chỉ email không hợp lệ"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Địa chỉ email không hợp lệ"),
});

export const resetPasswordSchema = z
    .object({
        token: z.string().min(1, "Token đặt lại mật khẩu là bắt buộc"),
        newPassword: z
            .string()
            .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
            .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết hoa")
            .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết thường")
            .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
    });

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ConfirmEmailFormData = z.infer<typeof confirmEmailSchema>;
export type ResendEmailConfirmationFormData = z.infer<typeof resendEmailConfirmationSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Quiz schemas
export const createQuizSetSchema = z.object({
    title: z.string()
        .min(1, "Tiêu đề là bắt buộc")
        .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
    description: z.string()
        .max(2000, "Mô tả không được vượt quá 2000 ký tự")
        .optional(),
    coverImageUrl: z.string().url("URL ảnh bìa không hợp lệ").optional().or(z.literal("")),
});

export const updateQuizSetSchema = z.object({
    id: z.string().uuid("ID không hợp lệ"),
    title: z.string()
        .min(1, "Tiêu đề là bắt buộc")
        .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
    description: z.string()
        .max(2000, "Mô tả không được vượt quá 2000 ký tự")
        .optional(),
    coverImageUrl: z.string().url("URL ảnh bìa không hợp lệ").optional().or(z.literal("")),
});

// Type exports
export type CreateQuizSetFormData = z.infer<typeof createQuizSetSchema>;
export type UpdateQuizSetFormData = z.infer<typeof updateQuizSetSchema>;