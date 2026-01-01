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
// Helper to validate UUID or empty string, transforming empty string to undefined
const optionalUuidSchema = z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.string().uuid("ID danh mục không hợp lệ").optional()
);

// Helper to validate URL or empty string, transforming empty string to undefined
const optionalUrlSchema = z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.string().url("URL ảnh bìa không hợp lệ").optional()
);

export const createQuizSetSchema = z.object({
    title: z.string()
        .min(1, "Tiêu đề là bắt buộc")
        .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
    description: z.string()
        .max(2000, "Mô tả không được vượt quá 2000 ký tự")
        .optional()
        .transform((val) => val === "" ? undefined : val),
    coverImageUrl: optionalUrlSchema,
    categoryId: optionalUuidSchema,
});

export const updateQuizSetSchema = z.object({
    id: z.string().uuid("ID không hợp lệ"),
    title: z.string()
        .min(1, "Tiêu đề là bắt buộc")
        .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
    description: z.string()
        .max(2000, "Mô tả không được vượt quá 2000 ký tự")
        .optional()
        .transform((val) => val === "" ? undefined : val),
    coverImageUrl: optionalUrlSchema,
    categoryId: optionalUuidSchema,
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

// Base option schema
const optionSchema = z.object({
  content: z.string().min(1, "Nội dung lựa chọn không được để trống"),
  isCorrect: z.boolean(),
  displayOrder: z.number(),
})

export const createQuestionSchema = z.object({
  content: z.string()
    .min(1, "Nội dung câu hỏi là bắt buộc")
    .max(2000, "Nội dung câu hỏi không được vượt quá 2000 ký tự"),
  type: z.string().min(1, "Loại câu hỏi là bắt buộc"),
  timeLimit: z.number()
    .min(5, "Thời gian giới hạn tối thiểu là 5 giây")
    .max(300, "Thời gian giới hạn tối đa là 300 giây"),
  options: z.array(optionSchema).optional(),
  matchingPairs: z.array(matchingPairSchema)
    .min(2, "Phải có ít nhất 2 cặp ghép")
    .max(5, "Không được có quá 5 cặp ghép")
    .optional(),
  orderingItems: z.array(orderingItemSchema)
    .min(3, "Phải có ít nhất 3 mục để sắp xếp")
    .max(6, "Không được có quá 6 mục để sắp xếp")
    .optional(),
  videoUrl: z.string()
    .url("URL video không hợp lệ")
    .max(500, "URL video không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  videoTimestamp: z.number()
    .min(0, "Dấu thời gian video không được âm")
    .optional(),
  audioUrl: z.string()
    .url("URL audio không hợp lệ")
    .max(500, "URL audio không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  audioTimestamp: z.number()
    .min(0, "Dấu thời gian audio không được âm")
    .optional(),
}).superRefine((data, ctx) => {
  // Validate options based on question type
  if (['SingleChoice', 'TrueFalse', 'MultipleChoice', 'Video', 'Audio'].includes(data.type)) {
    if (!data.options || data.options.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phải có ít nhất 2 lựa chọn",
        path: ['options'],
      })
      return
    }

    if (data.options.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phải có ít nhất 2 lựa chọn",
        path: ['options'],
      })
    }

    if (data.options.length > 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Không được có quá 6 lựa chọn",
        path: ['options'],
      })
    }

    // Validate correct answers
    const correctCount = data.options.filter(opt => opt.isCorrect).length
    
    if (data.type === 'SingleChoice' || data.type === 'TrueFalse') {
      if (correctCount !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: data.type === 'TrueFalse' 
            ? "Phải chọn một đáp án đúng (Đúng hoặc Sai)"
            : "Phải chọn chính xác một đáp án đúng",
          path: ['options'],
        })
      }
    } else if (data.type === 'MultipleChoice') {
      if (correctCount === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phải có ít nhất một đáp án đúng",
          path: ['options'],
        })
      }
    } else if (data.type === 'Video' || data.type === 'Audio') {
      if (correctCount === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phải có ít nhất một đáp án đúng",
          path: ['options'],
        })
      }
    }
  }

  // Validate matching pairs
  if (data.type === 'Matching') {
    if (!data.matchingPairs || data.matchingPairs.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phải có ít nhất 2 cặp ghép",
        path: ['matchingPairs'],
      })
    }
    if (data.matchingPairs && data.matchingPairs.length > 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Không được có quá 5 cặp ghép",
        path: ['matchingPairs'],
      })
    }
  }

  // Validate ordering items
  if (data.type === 'Ordering') {
    if (!data.orderingItems || data.orderingItems.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phải có ít nhất 3 mục để sắp xếp",
        path: ['orderingItems'],
      })
    }
    if (data.orderingItems && data.orderingItems.length > 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Không được có quá 6 mục để sắp xếp",
        path: ['orderingItems'],
      })
    }
  }

  // Validate video URL
  if (data.type === 'Video') {
    if (!data.videoUrl || data.videoUrl.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "URL video là bắt buộc",
        path: ['videoUrl'],
      })
    } else if (data.videoUrl && !z.string().url().safeParse(data.videoUrl).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "URL video không hợp lệ",
        path: ['videoUrl'],
      })
    }
  }

  // Validate audio URL
  if (data.type === 'Audio') {
    if (!data.audioUrl || data.audioUrl.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "URL audio là bắt buộc",
        path: ['audioUrl'],
      })
    } else if (data.audioUrl && !z.string().url().safeParse(data.audioUrl).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "URL audio không hợp lệ",
        path: ['audioUrl'],
      })
    }
  }
});

export type CreateQuestionFormData = z.infer<typeof createQuestionSchema>;
export type MatchingPairFormData = z.infer<typeof matchingPairSchema>;
export type OrderingItemFormData = z.infer<typeof orderingItemSchema>;

// Class schemas
export const createClassSchema = z.object({
  name: z.string()
    .min(1, "Tên lớp học là bắt buộc")
    .max(100, "Tên lớp học không được vượt quá 100 ký tự")
    .trim(),
  description: z.string()
    .max(500, "Mô tả không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  coverImageUrl: z.string()
    .url("URL hình ảnh không hợp lệ")
    .max(500, "URL hình ảnh không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
});

export const updateClassSchema = z.object({
  name: z.string()
    .min(1, "Tên lớp học là bắt buộc")
    .max(100, "Tên lớp học không được vượt quá 100 ký tự")
    .trim()
    .optional(),
  description: z.string()
    .max(500, "Mô tả không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  coverImageUrl: z.string()
    .url("URL hình ảnh không hợp lệ")
    .max(500, "URL hình ảnh không được vượt quá 500 ký tự")
    .optional()
    .or(z.literal("")),
});

export type CreateClassFormData = z.infer<typeof createClassSchema>;
export type UpdateClassFormData = z.infer<typeof updateClassSchema>;

// Homework schemas
export const createHomeworkSchema = z.object({
  title: z.string()
    .min(1, "Tiêu đề bài tập là bắt buộc")
    .max(255, "Tiêu đề bài tập không được vượt quá 255 ký tự")
    .trim(),
  quizSetId: z.string()
    .min(1, "Phải chọn bộ câu hỏi")
    .uuid("ID bộ câu hỏi không hợp lệ"),
  dueDate: z.string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Ngày hết hạn không hợp lệ",
    })
    .refine((val) => !val || new Date(val) > new Date(), {
      message: "Ngày hết hạn phải ở tương lai",
    }),
});

export const updateHomeworkSchema = z.object({
  title: z.string()
    .min(1, "Tiêu đề bài tập là bắt buộc")
    .max(255, "Tiêu đề bài tập không được vượt quá 255 ký tự")
    .trim()
    .optional(),
  quizSetId: z.string()
    .min(1, "Phải chọn bộ câu hỏi")
    .uuid("ID bộ câu hỏi không hợp lệ")
    .optional(),
  dueDate: z.string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Ngày hết hạn không hợp lệ",
    }),
});

export type CreateHomeworkFormData = z.infer<typeof createHomeworkSchema>;
export type UpdateHomeworkFormData = z.infer<typeof updateHomeworkSchema>;
