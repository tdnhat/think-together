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

// Question schemas
const matchingPairSchema = z.object({
  id: z.string().optional(),
  leftContent: z.string()
    .min(1, "Nội dung ghép cặp bên trái không được để trống")
    .max(500, "Nội dung không được vượt quá 500 ký tự"),
  rightContent: z.string()
    .min(1, "Nội dung ghép cặp bên phải không được để trống")
    .max(500, "Nội dung không được vượt quá 500 ký tự"),
  displayOrder: z.number(),
});

const orderingItemSchema = z.object({
  id: z.string().optional(),
  content: z.string()
    .min(1, "Nội dung mục sắp xếp không được để trống")
    .max(500, "Nội dung không được vượt quá 500 ký tự"),
  correctPosition: z.number(),
});

const optionsSchema = z.array(z.object({
  content: z.string().min(1, "Nội dung lựa chọn không được để trống"),
  isCorrect: z.boolean(),
  displayOrder: z.number(),
})).refine(
  (options) => options.some(opt => opt.isCorrect),
  {
    message: "Phải có ít nhất một đáp án đúng",
  }
);

export const createQuestionSchema = z.object({
  content: z.string()
    .min(1, "Nội dung câu hỏi là bắt buộc")
    .max(2000, "Nội dung câu hỏi không được vượt quá 2000 ký tự"),
  type: z.string().min(1, "Loại câu hỏi là bắt buộc"),
  timeLimit: z.number()
    .min(5, "Thời gian giới hạn tối thiểu là 5 giây")
    .max(300, "Thời gian giới hạn tối đa là 300 giây"),
  options: optionsSchema.optional(),
  matchingPairs: z.array(matchingPairSchema)
    .min(2, "Phải có ít nhất 2 cặp ghép")
    .max(5, "Không được có quá 5 cặp ghép")
    .optional(),
  orderingItems: z.array(orderingItemSchema)
    .min(3, "Phải có ít nhất 3 mục để sắp xếp")
    .max(6, "Không được có quá 6 mục để sắp xếp")
    .optional(),
  videoUrl: z.string()
    .max(500, "URL video không được vượt quá 500 ký tự")
    .optional(),
  videoTimestamp: z.number()
    .min(0, "Dấu thời gian video không được âm")
    .optional(),
  audioUrl: z.string()
    .max(500, "URL audio không được vượt quá 500 ký tự")
    .optional(),
  audioTimestamp: z.number()
    .min(0, "Dấu thời gian audio không được âm")
    .optional(),
}).refine(
  (data) => {
    // For choice-based questions, options must be provided
    if (['SingleChoice', 'TrueFalse', 'MultipleChoice'].includes(data.type)) {
      return Array.isArray(data.options) && data.options.length > 0;
    }
    // For matching questions, matchingPairs must be provided
    if (data.type === 'Matching') {
      return Array.isArray(data.matchingPairs) && data.matchingPairs.length >= 2;
    }
    // For ordering questions, orderingItems must be provided
    if (data.type === 'Ordering') {
      return Array.isArray(data.orderingItems) && data.orderingItems.length >= 3;
    }
    // For video questions, videoUrl must be provided
    if (data.type === 'Video') {
      return !!data.videoUrl && data.videoUrl.trim().length > 0;
    }
    // For audio questions, audioUrl must be provided
    if (data.type === 'Audio') {
      return !!data.audioUrl && data.audioUrl.trim().length > 0;
    }
    return true;
  },
  {
    message: "Nội dung câu hỏi không đầy đủ cho loại câu hỏi đã chọn",
  }
);

export type CreateQuestionFormData = z.infer<typeof createQuestionSchema>;
export type MatchingPairFormData = z.infer<typeof matchingPairSchema>;
export type OrderingItemFormData = z.infer<typeof orderingItemSchema>;
