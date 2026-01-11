"use client";

import React, { forwardRef, useState } from "react";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    variant?: 'default' | 'filled' | 'outlined' | 'gradient';
    fullWidth?: boolean;
    showCharCount?: boolean;
    maxLength?: number;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            label,
            error,
            helperText,
            variant = 'default',
            fullWidth = true,
            showCharCount = false,
            maxLength,
            resize = 'vertical',
            className = '',
            disabled = false,
            required = false,
            rows = 4,
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [value, setValue] = useState(props.value || props.defaultValue || '');

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setValue(e.target.value);
            props.onChange?.(e);
        };

        const variantClasses = {
            default: `
                bg-white border-2 
                ${error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : isFocused
                        ? 'border-blue-500 ring-4 ring-blue-100'
                        : 'border-gray-300 hover:border-gray-400'
                }
                transition-all duration-200
            `,
            filled: `
                bg-gray-50 border-2 border-transparent
                ${error
                    ? 'bg-red-50 focus:bg-white focus:border-red-500 focus:ring-red-200'
                    : isFocused
                        ? 'bg-white border-blue-500 ring-4 ring-blue-100'
                        : 'hover:bg-gray-100'
                }
                transition-all duration-200
            `,
            outlined: `
                bg-transparent border-2
                ${error
                    ? 'border-red-400 focus:border-red-600 focus:ring-red-200'
                    : isFocused
                        ? 'border-blue-600 ring-4 ring-blue-100'
                        : 'border-gray-400 hover:border-gray-500'
                }
                transition-all duration-200
            `,
            gradient: `
                bg-white border-2
                ${error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : isFocused
                        ? 'border-transparent ring-4 ring-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50'
                        : 'border-gray-300 hover:border-blue-300'
                }
                transition-all duration-300
            `
        };

        const resizeClasses = {
            none: 'resize-none',
            vertical: 'resize-y',
            horizontal: 'resize-x',
            both: 'resize'
        };

        return (
            <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
                {label && (
                    <label className="block mb-2">
                        <span className={`
                            text-sm font-semibold transition-colors duration-200
                            ${error
                                ? 'text-red-700'
                                : isFocused
                                    ? 'text-blue-700'
                                    : 'text-gray-700'
                            }
                        `}>
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                    </label>
                )}

                <div className="relative">
                    <textarea
                        ref={ref}
                        {...props}
                        value={value}
                        onChange={handleChange}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        maxLength={maxLength}
                        disabled={disabled}
                        rows={rows}
                        className={`
                            block w-full rounded-xl py-3 px-4
                            ${variantClasses[variant]}
                            ${resizeClasses[resize]}
                            text-gray-900
                            font-medium
                            placeholder:text-gray-400 placeholder:font-normal
                            focus:outline-none
                            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                            ${isFocused ? 'shadow-lg' : 'shadow-sm'}
                        `}
                    />

                    {variant === 'gradient' && isFocused && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse" />
                    )}

                    {showCharCount && maxLength && (
                        <div className={`
                            absolute bottom-2 right-3
                            text-xs font-medium px-2 py-1 rounded-md
                            ${String(value).length > maxLength * 0.9
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-600'
                            }
                        `}>
                            {String(value).length} / {maxLength}
                        </div>
                    )}
                </div>

                {(error || helperText) && (
                    <div className="mt-2 flex items-start gap-1.5">
                        {error ? (
                            <>
                                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-gray-600">{helperText}</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';
