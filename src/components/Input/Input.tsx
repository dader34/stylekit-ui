import React, { forwardRef, useId } from 'react';
import './Input.css';

/**
 * Input variant types
 */
export type InputVariant = 'default' | 'filled' | 'flushed';

/**
 * Input size types
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input state types
 */
export type InputState = 'default' | 'error' | 'success';

/**
 * Props for the Input component
 */
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Visual variant of the input
   * @default 'default'
   */
  variant?: InputVariant;
  /**
   * Size of the input
   * @default 'md'
   */
  size?: InputSize;
  /**
   * Validation state of the input
   * @default 'default'
   */
  state?: InputState;
  /**
   * Label text displayed above the input
   */
  label?: string;
  /**
   * Helper text displayed below the input
   */
  helperText?: string;
  /**
   * Error message displayed below the input (takes precedence over helperText when state is 'error')
   */
  errorMessage?: string;
  /**
   * Element rendered on the left side of the input (icon, addon, etc.)
   */
  leftElement?: React.ReactNode;
  /**
   * Element rendered on the right side of the input (icon, addon, etc.)
   */
  rightElement?: React.ReactNode;
  /**
   * Additional class name for the input wrapper
   */
  wrapperClassName?: string;
  /**
   * Whether the input takes up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Whether to hide the label visually (still accessible to screen readers)
   * @default false
   */
  hideLabel?: boolean;
}

/**
 * Input component for text entry with support for multiple variants, sizes, and states.
 * Integrates with the @stylekit/ui theme system using CSS variables.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Input label="Email" placeholder="Enter your email" />
 *
 * // With variants
 * <Input variant="filled" label="Username" />
 * <Input variant="flushed" label="Search" />
 *
 * // With sizes
 * <Input size="sm" label="Small" />
 * <Input size="lg" label="Large" />
 *
 * // With states
 * <Input state="error" errorMessage="This field is required" />
 * <Input state="success" helperText="Email is valid" />
 *
 * // With elements
 * <Input leftElement={<SearchIcon />} placeholder="Search..." />
 * <Input rightElement={<ClearButton />} value={value} />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      state = 'default',
      label,
      helperText,
      errorMessage,
      leftElement,
      rightElement,
      wrapperClassName = '',
      fullWidth = false,
      hideLabel = false,
      disabled,
      className = '',
      id,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for accessibility
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    // Determine which description ID to use
    const getDescribedBy = (): string | undefined => {
      if (ariaDescribedBy) return ariaDescribedBy;
      if (state === 'error' && errorMessage) return errorId;
      if (helperText) return helperId;
      return undefined;
    };

    // Build class names
    const wrapperClasses = [
      'sk-input-wrapper',
      fullWidth && 'sk-input-wrapper--full-width',
      wrapperClassName,
    ]
      .filter(Boolean)
      .join(' ');

    const containerClasses = [
      'sk-input-container',
      `sk-input-container--${variant}`,
      `sk-input-container--${size}`,
      state !== 'default' && `sk-input-container--${state}`,
      disabled && 'sk-input-container--disabled',
      leftElement && 'sk-input-container--has-left',
      rightElement && 'sk-input-container--has-right',
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = ['sk-input', className].filter(Boolean).join(' ');

    const labelClasses = [
      'sk-input-label',
      `sk-input-label--${size}`,
      hideLabel && 'sk-input-label--hidden',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        <div className={containerClasses}>
          {leftElement && (
            <span className="sk-input-element sk-input-element--left">
              {leftElement}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={inputClasses}
            aria-invalid={state === 'error'}
            aria-describedby={getDescribedBy()}
            {...props}
          />
          {rightElement && (
            <span className="sk-input-element sk-input-element--right">
              {rightElement}
            </span>
          )}
        </div>
        {state === 'error' && errorMessage ? (
          <span id={errorId} className="sk-input-message sk-input-message--error" role="alert">
            {errorMessage}
          </span>
        ) : helperText ? (
          <span
            id={helperId}
            className={`sk-input-message ${state === 'success' ? 'sk-input-message--success' : ''}`}
          >
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
