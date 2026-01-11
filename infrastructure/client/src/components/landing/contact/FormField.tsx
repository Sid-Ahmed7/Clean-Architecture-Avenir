import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';
import { ContactFormData } from '@/lib/validation/contactSchema';

interface FormFieldProps {
  label: string;
  name: keyof ContactFormData;
  type?: 'text' | 'email' | 'textarea';
  placeholder?: string;
  error?: FieldError;
  register: UseFormRegister<ContactFormData>;
  required?: boolean;
  rows?: number;
}

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  register,
  required = false,
  rows = 5,
}: FormFieldProps) {
  const inputClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
  }`;

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
          {...register(name)}
        />
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
          {...register(name)}
        />
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error.message}
        </p>
      )}
    </div>
  );
}
