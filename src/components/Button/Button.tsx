import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  /**
   * The visual style variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * The size of the button
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Whether the button is in a loading state
   * Shows a spinner and disables interaction
   * @default false
   */
  loading?: boolean;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon to display on the left side of the button text
   */
  leftIcon?: ReactNode;

  /**
   * Icon to display on the right side of the button text
   */
  rightIcon?: ReactNode;

  /**
   * Whether the button should take the full width of its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * The content of the button
   */
  children?: ReactNode;
}

/**
 * Loading spinner component for the button
 */
const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`sk-button-spinner ${className || ''}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      className="sk-button-spinner-track"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      className="sk-button-spinner-head"
      d="M12 2C6.47715 2 2 6.47715 2 12"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * A versatile button component that supports multiple variants, sizes, and states.
 * Works seamlessly across all 8 StyleKit themes.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 *
 * <Button variant="outline" leftIcon={<PlusIcon />}>
 *   Add item
 * </Button>
 *
 * <Button loading disabled>
 *   Submitting...
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const classNames = [
      'sk-button',
      `sk-button--${variant}`,
      `sk-button--${size}`,
      loading && 'sk-button--loading',
      isDisabled && 'sk-button--disabled',
      fullWidth && 'sk-button--full-width',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span className="sk-button-spinner-wrapper">
            <Spinner />
          </span>
        )}

        <span
          className={`sk-button-content ${loading ? 'sk-button-content--hidden' : ''}`}
        >
          {leftIcon && (
            <span className="sk-button-icon sk-button-icon--left">
              {leftIcon}
            </span>
          )}

          {children && <span className="sk-button-label">{children}</span>}

          {rightIcon && (
            <span className="sk-button-icon sk-button-icon--right">
              {rightIcon}
            </span>
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
