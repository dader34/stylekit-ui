import React from 'react';
import './Badge.css';

export type BadgeVariant = 'solid' | 'subtle' | 'outline';
export type BadgeColor = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The visual style variant of the badge */
  variant?: BadgeVariant;
  /** The color scheme of the badge */
  color?: BadgeColor;
  /** The size of the badge */
  size?: BadgeSize;
  /** Whether to show a dot indicator */
  dot?: boolean;
  /** Optional icon to display before the content */
  icon?: React.ReactNode;
  /** The content of the badge */
  children?: React.ReactNode;
}

/**
 * Badge component for displaying labels, statuses, or counts.
 *
 * @example
 * ```tsx
 * <Badge color="success">Active</Badge>
 * <Badge variant="outline" color="error">Critical</Badge>
 * <Badge dot color="info">New</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'subtle',
      color = 'default',
      size = 'md',
      dot = false,
      icon,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'sk-badge',
      `sk-badge--${variant}`,
      `sk-badge--${color}`,
      `sk-badge--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={classNames} {...props}>
        {dot && <span className="sk-badge__dot" aria-hidden="true" />}
        {icon && !dot && <span className="sk-badge__icon" aria-hidden="true">{icon}</span>}
        {children && <span className="sk-badge__content">{children}</span>}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
