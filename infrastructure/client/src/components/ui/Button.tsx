"use client";

import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  rounded?: 'default' | 'full' | 'none';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      icon: Icon,
      iconPosition = 'left',
      rounded = 'default',
      disabled = false,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'py-2 px-4 text-sm',
      md: 'py-3 px-6 text-base',
      lg: 'py-4 px-8 text-lg',
      xl: 'py-5 px-10 text-xl'
    };

    const variantClasses = {
      primary: `
                bg-gradient-to-r from-blue-600 to-indigo-600 
                text-white 
                hover:from-blue-700 hover:to-indigo-700 
                shadow-lg hover:shadow-xl
            `,
      secondary: `
                bg-gray-100 
                text-gray-900 
                hover:bg-gray-200 
            `,
      success: `
                bg-gradient-to-r from-green-600 to-emerald-600 
                text-white 
                hover:from-green-700 hover:to-emerald-700 
                shadow-lg hover:shadow-xl
            `,
      danger: `
                bg-gradient-to-r from-red-600 to-pink-600 
                text-white 
                hover:from-red-700 hover:to-pink-700 
                shadow-lg hover:shadow-xl
            `,
      warning: `
                bg-gradient-to-r from-amber-500 to-orange-500 
                text-white 
                hover:from-amber-600 hover:to-orange-600 
                shadow-lg hover:shadow-xl
            `,
      ghost: `
                bg-transparent 
                text-gray-700 
                hover:bg-gray-100 
            `,
      gradient: `
                bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 
                text-white 
                hover:from-purple-700 hover:via-pink-700 hover:to-red-700 
                shadow-lg hover:shadow-xl
                animate-gradient
            `
    };

    const roundedClasses = {
      default: 'rounded-xl',
      full: 'rounded-full',
      none: 'rounded-none'
    };

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7'
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`
                    ${sizeClasses[size]}
                    ${variantClasses[variant]}
                    ${roundedClasses[rounded]}
                    ${fullWidth ? 'w-full' : ''}
                    font-semibold cursor-pointer
                    transition-all duration-200
                    transform hover:scale-[1.02] active:scale-[0.98]
                    focus:outline-none
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    flex items-center justify-center gap-2
                    ${className}
                `}
        {...props}
      >
        {loading ? (
          <>
            <svg className={`animate-spin ${iconSizeClasses[size]}`} viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && (
              <Icon className={iconSizeClasses[size]} />
            )}
            {children}
            {Icon && iconPosition === 'right' && (
              <Icon className={iconSizeClasses[size]} />
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
