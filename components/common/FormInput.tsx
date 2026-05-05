"use client";

import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
}

export function FormInput({
  label,
  error,
  hint,
  required,
  showCharCount,
  maxLength,
  value,
  onChange,
  disabled,
  ...props
}: FormInputProps) {
  const charCount = typeof value === "string" ? value.length : 0;
  const showCount = showCharCount && maxLength && charCount > maxLength * 0.8;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <input
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        className={`form-input transition-colors ${error ? "border-red-500 bg-red-500/5" : ""} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        {...props}
      />

      <div className="flex justify-between items-start gap-2 min-h-6">
        <div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!error && hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>

        {showCount && maxLength && (
          <p
            className={`text-xs whitespace-nowrap ${charCount > maxLength ? "text-red-400" : "text-slate-500"}`}
          >
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

interface FormTextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  rows?: number;
}

export function FormTextArea({
  label,
  error,
  hint,
  required,
  showCharCount,
  maxLength,
  value,
  onChange,
  disabled,
  rows = 4,
  ...props
}: FormTextAreaProps) {
  const charCount = typeof value === "string" ? value.length : 0;
  const showCount = showCharCount && maxLength && charCount > maxLength * 0.8;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <textarea
        value={value}
        onChange={onChange as any}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        className={`form-input transition-colors resize-vertical ${error ? "border-red-500 bg-red-500/5" : ""} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        {...(props as any)}
      />

      <div className="flex justify-between items-start gap-2 min-h-6">
        <div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!error && hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>

        {showCount && maxLength && (
          <p
            className={`text-xs whitespace-nowrap ${charCount > maxLength ? "text-red-400" : "text-slate-500"}`}
          >
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

interface FormSelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
}

export function FormSelect({
  label,
  error,
  hint,
  required,
  options,
  value,
  onChange,
  disabled,
  ...props
}: FormSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`form-input transition-colors appearance-none bg-slate-800 ${error ? "border-red-500 bg-red-500/5" : ""} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        {...props}
      >
        <option value="">Select an option...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="flex justify-between items-start gap-2 min-h-6">
        <div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!error && hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
      </div>
    </div>
  );
}

