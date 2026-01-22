import React, { forwardRef, useMemo, useState } from 'react';
import './Avatar.css';

// ============================================================================
// Types
// ============================================================================

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarShape = 'circle' | 'rounded' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Name used to generate initials fallback */
  name?: string;
  /** Size variant */
  size?: AvatarSize;
  /** Shape variant */
  shape?: AvatarShape;
  /** Status indicator */
  status?: AvatarStatus;
  /** Show border/ring always */
  showRing?: boolean;
  /** Show border/ring only on hover */
  showRingOnHover?: boolean;
  /** Custom fallback element */
  fallback?: React.ReactNode;
  /** Called when image fails to load */
  onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum number of avatars to display before showing overflow */
  max?: number;
  /** Size for all avatars in the group */
  size?: AvatarSize;
  /** Shape for all avatars in the group */
  shape?: AvatarShape;
  /** Spacing between avatars (negative for overlap) */
  spacing?: 'tight' | 'normal' | 'loose';
  /** Children should be Avatar components */
  children: React.ReactNode;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Extract initials from a name
 * - "John Doe" -> "JD"
 * - "John" -> "J"
 * - "john doe smith" -> "JS" (first and last)
 */
function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();

  // Take first letter of first and last word
  const first = words[0].charAt(0);
  const last = words[words.length - 1].charAt(0);
  return (first + last).toUpperCase();
}

/**
 * Default user icon SVG component
 */
function DefaultUserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

// ============================================================================
// Avatar Component
// ============================================================================

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      name,
      size = 'md',
      shape = 'circle',
      status,
      showRing = false,
      showRingOnHover = false,
      fallback,
      onImageError,
      className = '',
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);

    const initials = useMemo(() => {
      if (name) return getInitials(name);
      return '';
    }, [name]);

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setImageError(true);
      onImageError?.(event);
    };

    // Determine what to render inside the avatar
    const renderContent = () => {
      // If we have a valid image source and no error
      if (src && !imageError) {
        return (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="sk-avatar-image"
            onError={handleImageError}
          />
        );
      }

      // Custom fallback provided
      if (fallback) {
        return <span className="sk-avatar-fallback">{fallback}</span>;
      }

      // Name initials fallback
      if (initials) {
        return <span className="sk-avatar-initials">{initials}</span>;
      }

      // Default icon fallback
      return <DefaultUserIcon className="sk-avatar-icon" />;
    };

    const classNames = [
      'sk-avatar',
      `sk-avatar--${size}`,
      `sk-avatar--${shape}`,
      showRing && 'sk-avatar--ring',
      showRingOnHover && 'sk-avatar--ring-hover',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classNames} {...props}>
        <div className="sk-avatar-content">{renderContent()}</div>
        {status && (
          <span
            className={`sk-avatar-status sk-avatar-status--${status}`}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// ============================================================================
// AvatarGroup Component
// ============================================================================

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      max = 5,
      size = 'md',
      shape = 'circle',
      spacing = 'normal',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const childArray = React.Children.toArray(children);
    const totalCount = childArray.length;
    const visibleCount = Math.min(max, totalCount);
    const overflowCount = totalCount - visibleCount;

    // Clone children to inject size and shape props
    const visibleChildren = childArray.slice(0, visibleCount).map((child, index) => {
      if (React.isValidElement<AvatarProps>(child)) {
        return React.cloneElement(child, {
          key: index,
          size: child.props.size || size,
          shape: child.props.shape || shape,
        });
      }
      return child;
    });

    const classNames = [
      'sk-avatar-group',
      `sk-avatar-group--${spacing}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classNames} role="group" {...props}>
        {visibleChildren}
        {overflowCount > 0 && (
          <div
            className={`sk-avatar sk-avatar--${size} sk-avatar--${shape} sk-avatar-overflow`}
            aria-label={`${overflowCount} more`}
          >
            <span className="sk-avatar-overflow-text">+{overflowCount}</span>
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export default Avatar;
