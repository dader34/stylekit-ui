import React, { createContext, useContext } from 'react';
import './Alert.css';

export type AlertVariant = 'solid' | 'subtle' | 'left-accent' | 'top-accent';
export type AlertStatus = 'info' | 'success' | 'warning' | 'error';

/* ==================== Alert Context ==================== */

interface AlertContextValue {
  status: AlertStatus;
  variant: AlertVariant;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('Alert compound components must be used within an Alert component');
  }
  return context;
};

/* ==================== Alert Icons ==================== */

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const SuccessIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const statusIcons: Record<AlertStatus, React.FC> = {
  info: InfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

/* ==================== AlertIcon Component ==================== */

export interface AlertIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Custom icon to override the automatic status-based icon */
  children?: React.ReactNode;
}

/**
 * AlertIcon component - automatically selects icon based on alert status.
 * Can be overridden with a custom icon via children.
 */
export const AlertIcon = React.forwardRef<HTMLSpanElement, AlertIconProps>(
  ({ children, className = '', ...props }, ref) => {
    const { status } = useAlertContext();
    const StatusIcon = statusIcons[status];

    return (
      <span
        ref={ref}
        className={`sk-alert__icon ${className}`.trim()}
        aria-hidden="true"
        {...props}
      >
        {children || <StatusIcon />}
      </span>
    );
  }
);

AlertIcon.displayName = 'AlertIcon';

/* ==================== AlertTitle Component ==================== */

export interface AlertTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * AlertTitle component - displays the alert title/heading.
 */
export const AlertTitle = React.forwardRef<HTMLDivElement, AlertTitleProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`sk-alert__title ${className}`.trim()} {...props}>
        {children}
      </div>
    );
  }
);

AlertTitle.displayName = 'AlertTitle';

/* ==================== AlertDescription Component ==================== */

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * AlertDescription component - displays the alert description/body text.
 */
export const AlertDescription = React.forwardRef<HTMLDivElement, AlertDescriptionProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`sk-alert__description ${className}`.trim()} {...props}>
        {children}
      </div>
    );
  }
);

AlertDescription.displayName = 'AlertDescription';

/* ==================== Main Alert Component ==================== */

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The visual style variant of the alert */
  variant?: AlertVariant;
  /** The status/type of the alert, which determines the color scheme and default icon */
  status?: AlertStatus;
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Callback fired when the dismiss button is clicked */
  onClose?: () => void;
  /** The content of the alert */
  children: React.ReactNode;
}

/**
 * Alert component for displaying feedback messages to users.
 *
 * @example
 * ```tsx
 * <Alert status="success" dismissible onClose={() => console.log('closed')}>
 *   <AlertIcon />
 *   <div>
 *     <AlertTitle>Success!</AlertTitle>
 *     <AlertDescription>Your changes have been saved.</AlertDescription>
 *   </div>
 * </Alert>
 * ```
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'subtle',
      status = 'info',
      dismissible = false,
      onClose,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'sk-alert',
      `sk-alert--${variant}`,
      `sk-alert--${status}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <AlertContext.Provider value={{ status, variant }}>
        <div
          ref={ref}
          role="alert"
          className={classNames}
          {...props}
        >
          <div className="sk-alert__content">
            {children}
          </div>
          {dismissible && (
            <button
              type="button"
              className="sk-alert__close"
              onClick={onClose}
              aria-label="Dismiss alert"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </AlertContext.Provider>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
