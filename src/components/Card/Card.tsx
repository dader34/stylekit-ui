import React, { forwardRef, createContext, useContext, useMemo } from 'react';
import './Card.css';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost';

export interface CardContextValue {
  variant: CardVariant;
  interactive: boolean;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the card
   * @default 'elevated'
   */
  variant?: CardVariant;
  /**
   * Makes the card interactive with hover/focus states
   * @default false
   */
  interactive?: boolean;
  /**
   * Disables the card (only applies when interactive)
   * @default false
   */
  disabled?: boolean;
  /**
   * Makes the card full width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Removes default padding from all child components
   * @default false
   */
  noPadding?: boolean;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Card contents
   */
  children?: React.ReactNode;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Main title text
   */
  title?: React.ReactNode;
  /**
   * Subtitle or description text
   */
  subtitle?: React.ReactNode;
  /**
   * Action slot (e.g., buttons, icons, menus)
   */
  action?: React.ReactNode;
  /**
   * Avatar or icon to display before the title
   */
  avatar?: React.ReactNode;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Children (alternative to title/subtitle props)
   */
  children?: React.ReactNode;
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Removes default padding
   * @default false
   */
  noPadding?: boolean;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Body contents
   */
  children?: React.ReactNode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Horizontal alignment of footer content
   * @default 'end'
   */
  align?: 'start' | 'center' | 'end' | 'between' | 'around';
  /**
   * Adds a top border separator
   * @default false
   */
  divider?: boolean;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Footer contents
   */
  children?: React.ReactNode;
}

export type CardMediaFit = 'cover' | 'contain' | 'fill' | 'none';
export type CardMediaPosition = 'top' | 'bottom' | 'left' | 'right' | 'background';

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Image source URL
   */
  src?: string;
  /**
   * Alt text for accessibility
   */
  alt?: string;
  /**
   * Aspect ratio (e.g., '16/9', '4/3', '1/1', '21/9')
   */
  aspectRatio?: string;
  /**
   * How the media should be fitted
   * @default 'cover'
   */
  fit?: CardMediaFit;
  /**
   * Position of the media within the card
   * @default 'top'
   */
  position?: CardMediaPosition;
  /**
   * Custom height (overrides aspect ratio)
   */
  height?: string | number;
  /**
   * Overlay content (appears on top of media)
   */
  overlay?: React.ReactNode;
  /**
   * Gradient overlay for better text readability
   * @default false
   */
  gradient?: boolean;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Children (for video or custom media content)
   */
  children?: React.ReactNode;
}

// ============================================================================
// Context
// ============================================================================

const CardContext = createContext<CardContextValue | undefined>(undefined);

function useCardContext(): CardContextValue {
  const context = useContext(CardContext);
  return context ?? { variant: 'elevated', interactive: false };
}

// ============================================================================
// Card Component
// ============================================================================

const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      interactive = false,
      disabled = false,
      fullWidth = false,
      noPadding = false,
      className = '',
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const contextValue = useMemo(
      () => ({ variant, interactive }),
      [variant, interactive]
    );

    const isClickable = interactive && !disabled && onClick;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
      onKeyDown?.(e);
    };

    const classNames = [
      'sk-card',
      `sk-card--${variant}`,
      interactive && 'sk-card--interactive',
      disabled && 'sk-card--disabled',
      fullWidth && 'sk-card--full-width',
      noPadding && 'sk-card--no-padding',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <CardContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={classNames}
          onClick={isClickable ? onClick : undefined}
          onKeyDown={handleKeyDown}
          tabIndex={isClickable ? 0 : undefined}
          role={isClickable ? 'button' : undefined}
          aria-disabled={disabled || undefined}
          {...props}
        >
          {children}
        </div>
      </CardContext.Provider>
    );
  }
);

CardRoot.displayName = 'Card';

// ============================================================================
// CardHeader Component
// ============================================================================

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    { title, subtitle, action, avatar, className = '', children, ...props },
    ref
  ) => {
    const classNames = ['sk-card-header', className].filter(Boolean).join(' ');

    // If children are provided, use them directly
    if (children) {
      return (
        <div ref={ref} className={classNames} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={classNames} {...props}>
        {avatar && <div className="sk-card-header__avatar">{avatar}</div>}
        <div className="sk-card-header__content">
          {title && <div className="sk-card-header__title">{title}</div>}
          {subtitle && (
            <div className="sk-card-header__subtitle">{subtitle}</div>
          )}
        </div>
        {action && <div className="sk-card-header__action">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// ============================================================================
// CardBody Component
// ============================================================================

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ noPadding = false, className = '', children, ...props }, ref) => {
    const classNames = [
      'sk-card-body',
      noPadding && 'sk-card-body--no-padding',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

// ============================================================================
// CardFooter Component
// ============================================================================

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  (
    { align = 'end', divider = false, className = '', children, ...props },
    ref
  ) => {
    const classNames = [
      'sk-card-footer',
      `sk-card-footer--${align}`,
      divider && 'sk-card-footer--divider',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

// ============================================================================
// CardMedia Component
// ============================================================================

const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(
  (
    {
      src,
      alt = '',
      aspectRatio,
      fit = 'cover',
      position = 'top',
      height,
      overlay,
      gradient = false,
      className = '',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'sk-card-media',
      `sk-card-media--${position}`,
      `sk-card-media--${fit}`,
      gradient && 'sk-card-media--gradient',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const computedStyle: React.CSSProperties = {
      ...style,
      ...(aspectRatio && { aspectRatio }),
      ...(height && {
        height: typeof height === 'number' ? `${height}px` : height,
        aspectRatio: undefined,
      }),
    };

    return (
      <div ref={ref} className={classNames} style={computedStyle} {...props}>
        {src && (
          <img src={src} alt={alt} className="sk-card-media__image" loading="lazy" />
        )}
        {children}
        {gradient && <div className="sk-card-media__gradient" />}
        {overlay && <div className="sk-card-media__overlay">{overlay}</div>}
      </div>
    );
  }
);

CardMedia.displayName = 'CardMedia';

// ============================================================================
// Compound Component Export
// ============================================================================

interface CardCompound
  extends React.ForwardRefExoticComponent<
    CardProps & React.RefAttributes<HTMLDivElement>
  > {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
  Media: typeof CardMedia;
}

const Card = CardRoot as CardCompound;
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Media = CardMedia;

// Named exports for flexibility
export { Card, CardHeader, CardBody, CardFooter, CardMedia, useCardContext };

// Default export
export default Card;
