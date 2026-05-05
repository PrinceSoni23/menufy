/**
 * Validation utilities for forms and user input
 */

export interface ValidationError {
  field: string;
  message: string;
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
export const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
export const nameRegex = /^[a-zA-Z\s'-]{2,}$/;
export const priceRegex = /^\d+(\.\d{1,2})?$/;

/**
 * Validate email format
 */
export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  if (!email) {
    return { valid: false, error: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  error?: string;
} {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }
  if (password.length < 8) {
    return {
      valid: false,
      error: "Password must be at least 8 characters long",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }
  if (!/[@$!%*#?&]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one special character (@$!%*#?&)",
    };
  }
  return { valid: true };
}

/**
 * Validate name field
 */
export function validateName(
  name: string,
  field: string = "Name",
): { valid: boolean; error?: string } {
  if (!name || !name.trim()) {
    return { valid: false, error: `${field} is required` };
  }
  if (name.trim().length < 2) {
    return {
      valid: false,
      error: `${field} must be at least 2 characters long`,
    };
  }
  if (name.length > 50) {
    return { valid: false, error: `${field} must not exceed 50 characters` };
  }
  return { valid: true };
}

/**
 * Validate price format and range
 */
export function validatePrice(
  price: string | number,
  field: string = "Price",
): { valid: boolean; error?: string } {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) {
    return { valid: false, error: `${field} must be a valid number` };
  }
  if (numPrice < 0) {
    return { valid: false, error: `${field} cannot be negative` };
  }
  if (numPrice === 0) {
    return { valid: false, error: `${field} must be greater than 0` };
  }
  if (numPrice > 9999) {
    return { valid: false, error: `${field} cannot exceed $9,999` };
  }
  return { valid: true };
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: false, error: "URL is required" };
  }
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: "Please enter a valid URL" };
  }
}

/**
 * Validate required field
 */
export function validateRequired(
  value: string | undefined,
  field: string = "This field",
): { valid: boolean; error?: string } {
  if (!value || !value.trim()) {
    return { valid: false, error: `${field} is required` };
  }
  return { valid: true };
}

/**
 * Validate field length
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  field: string = "This field",
): { valid: boolean; error?: string } {
  if (value.length < min) {
    return {
      valid: false,
      error: `${field} must be at least ${min} characters long`,
    };
  }
  if (value.length > max) {
    return {
      valid: false,
      error: `${field} must not exceed ${max} characters`,
    };
  }
  return { valid: true };
}

/**
 * Validate format using regex
 */
export function validateFormat(
  value: string,
  regex: RegExp,
  field: string = "This field",
): { valid: boolean; error?: string } {
  if (!regex.test(value)) {
    return { valid: false, error: `${field} format is invalid` };
  }
  return { valid: true };
}

/**
 * Validate file upload
 */
export function validateFile(
  file: File | undefined,
  options: {
    required?: boolean;
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    field?: string;
  },
): { valid: boolean; error?: string } {
  const {
    required = false,
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
    field = "File",
  } = options;

  if (!file) {
    if (required) {
      return { valid: false, error: `${field} is required` };
    }
    return { valid: true };
  }

  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    return { valid: false, error: `${field} size must not exceed ${maxMB}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `${field} type is not supported` };
  }

  return { valid: true };
}

/**
 * Batch validate form fields
 */
export function validateForm(
  data: Record<string, any>,
  schema: Record<string, (value: any) => { valid: boolean; error?: string }>,
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(data[field]);
    if (!result.valid) {
      errors.push({
        field,
        message: result.error || "Invalid value",
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
