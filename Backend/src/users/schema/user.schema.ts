import * as z from 'zod/v4';

const passwordValidation = z
  .string()
  .min(8)
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Password must contain at least one number',
  })
  .refine((password) => /[^A-Za-z0-9]/.test(password), {
    message: 'Password must contain at least one special character',
  });

export const createUserSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.email({ pattern: z.regexes.email }),
  password: passwordValidation,
});

export const updateUserSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.email({ pattern: z.regexes.email }),
});

export const updatePasswordSchema = z
  .object({
    oldPassword: passwordValidation,
    newPassword: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword === data.oldPassword, {
    message: 'Passwords cant be the same',
    path: ['newPassword'],
  });
