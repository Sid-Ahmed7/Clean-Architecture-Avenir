"use client";

import React, { forwardRef, useState } from "react";
import { LucideIcon } from "lucide-react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    variant?: 'default' | 'filled' | 'outlined' | 'gradient';
    inputSize?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    showCharCount?: boolean;
    maxLength?: number;
    onIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            icon: Icon,
            iconPosition = 'left',
            variant = 'default',
            inputSize = 'md',
            fullWidth = true,
            showCharCount = false,
            maxLength,
            className = '',
            disabled = false,
            required = false,
            onIconClick,
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [value, setValue] = useState(props.value || props.defaultValue || '');

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
            props.onChange?.(e);
        };

        // Size classes
        const sizeClasses = {
            sm: 'py-2 px-3 text-sm',
            md: 'py-3 px-4 text-base',
            lg: 'py-4 px-5 text-lg'
        };

        // Variant classes
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
                        ? 'border-transparent ring-4 ring-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50'
                        : 'border-gray-300 hover:border-blue-300'
                }
                transition-all duration-300
            `
        };

        const iconSizeClasses = {
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
            lg: 'w-6 h-6'
        };

        const paddingWithIcon = Icon ? (iconPosition === 'left' ? 'pl-11' : 'pr-11') : '';

        return (
            <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
                {/* Label */}
                {label && (
                    <label className="block mb-2 group">
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

                {/* Input Container */}
                <div className="relative group">
                    {/* Icon */}
                    {Icon && (
                        <div
                            className={`
                                absolute top-1/2 -translate-y-1/2 
                                ${iconPosition === 'left' ? 'left-3' : 'right-3'}
                                transition-colors duration-200
                                ${onIconClick ? 'cursor-pointer hover:scale-110' : ''}
                                ${error
                                    ? 'text-red-500'
                                    : isFocused
                                        ? 'text-blue-600'
                                        : 'text-gray-400'
                                }
                            `}
                            onClick={onIconClick}
                        >
                            <Icon className={iconSizeClasses[inputSize]} />
                        </div>
                    )}

                    {/* Input Field */}
                    <input
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
                        className={`
                            block w-full rounded-xl
                            ${sizeClasses[inputSize]}
                            ${variantClasses[variant]}
                            ${paddingWithIcon}
                            text-gray-900
                            font-medium
                            placeholder:text-gray-400 placeholder:font-normal
                            focus:outline-none
                            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                            ${isFocused ? 'shadow-lg' : 'shadow-sm'}
                        `}
                    />


                    {/* Animated underline for gradient variant */}
                    {variant === 'gradient' && isFocused && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 mx-2 self-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse" />
                    )}

                    {/* Character count */}
                    {showCharCount && maxLength && (
                        <div className={`
                            absolute bottom-0 right-3 transform translate-y-6
                            text-xs font-medium
                            ${String(value).length > maxLength * 0.9
                                ? 'text-amber-600'
                                : 'text-gray-400'
                            }
                        `}>
                            {String(value).length} / {maxLength}
                        </div>
                    )}
                </div>

                {/* Helper Text or Error */}
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

Input.displayName = 'Input';
