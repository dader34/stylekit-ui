import React, {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  useId,
  cloneElement,
  isValidElement,
  ReactNode,
  ReactElement,
  HTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import './Tooltip.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipTrigger = 'hover' | 'focus' | 'click';
export type TooltipAnimation = 'fade' | 'scale';

export interface TooltipProps {
  /**
   * The content to display inside the tooltip
   */
  content: ReactNode;

  /**
   * The element that triggers the tooltip
   */
  children: ReactElement;

  /**
   * Preferred placement of the tooltip
   * Will auto-flip if there's not enough space
   * @default 'top'
   */
  placement?: TooltipPlacement;

  /**
   * How the tooltip is triggered
   * Can be a single trigger or an array of triggers
   * @default ['hover', 'focus']
   */
  trigger?: TooltipTrigger | TooltipTrigger[];

  /**
   * Delay in milliseconds before showing the tooltip
   * @default 0
   */
  openDelay?: number;

  /**
   * Delay in milliseconds before hiding the tooltip
   * @default 0
   */
  closeDelay?: number;

  /**
   * Whether to show an arrow pointing to the trigger element
   * @default true
   */
  arrow?: boolean;

  /**
   * Animation type for showing/hiding the tooltip
   * @default 'fade'
   */
  animation?: TooltipAnimation;

  /**
   * Whether the tooltip is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Controlled open state
   * When provided, the tooltip becomes controlled
   */
  open?: boolean;

  /**
   * Callback when the open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Offset from the trigger element in pixels
   * @default 8
   */
  offset?: number;

  /**
   * Additional class name for the tooltip
   */
  className?: string;

  /**
   * Additional class name for the tooltip content wrapper
   */
  contentClassName?: string;

  /**
   * Z-index for the tooltip portal
   * @default 9999
   */
  zIndex?: number;

  /**
   * Whether to render the tooltip in a portal
   * @default true
   */
  portal?: boolean;
}

interface Position {
  top: number;
  left: number;
  actualPlacement: TooltipPlacement;
}

/**
 * Calculate the best position for the tooltip based on available space
 */
function calculatePosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  placement: TooltipPlacement,
  offset: number
): Position {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const positions: Record<TooltipPlacement, { top: number; left: number }> = {
    top: {
      top: triggerRect.top + scrollY - tooltipRect.height - offset,
      left:
        triggerRect.left +
        scrollX +
        triggerRect.width / 2 -
        tooltipRect.width / 2,
    },
    bottom: {
      top: triggerRect.bottom + scrollY + offset,
      left:
        triggerRect.left +
        scrollX +
        triggerRect.width / 2 -
        tooltipRect.width / 2,
    },
    left: {
      top:
        triggerRect.top +
        scrollY +
        triggerRect.height / 2 -
        tooltipRect.height / 2,
      left: triggerRect.left + scrollX - tooltipRect.width - offset,
    },
    right: {
      top:
        triggerRect.top +
        scrollY +
        triggerRect.height / 2 -
        tooltipRect.height / 2,
      left: triggerRect.right + scrollX + offset,
    },
  };

  // Check if the preferred placement fits in the viewport
  const fitsInViewport = (pos: { top: number; left: number }, p: TooltipPlacement): boolean => {
    const top = pos.top - scrollY;
    const left = pos.left - scrollX;
    const right = left + tooltipRect.width;
    const bottom = top + tooltipRect.height;

    switch (p) {
      case 'top':
        return top >= 0 && left >= 0 && right <= viewportWidth;
      case 'bottom':
        return bottom <= viewportHeight && left >= 0 && right <= viewportWidth;
      case 'left':
        return left >= 0 && top >= 0 && top + tooltipRect.height <= viewportHeight;
      case 'right':
        return right <= viewportWidth && top >= 0 && top + tooltipRect.height <= viewportHeight;
    }
  };

  // Try preferred placement first
  if (fitsInViewport(positions[placement], placement)) {
    return { ...positions[placement], actualPlacement: placement };
  }

  // Define fallback order based on preferred placement
  const fallbackOrder: Record<TooltipPlacement, TooltipPlacement[]> = {
    top: ['bottom', 'left', 'right'],
    bottom: ['top', 'left', 'right'],
    left: ['right', 'top', 'bottom'],
    right: ['left', 'top', 'bottom'],
  };

  // Try fallback placements
  for (const fallback of fallbackOrder[placement]) {
    if (fitsInViewport(positions[fallback], fallback)) {
      return { ...positions[fallback], actualPlacement: fallback };
    }
  }

  // If no placement fits, use the preferred placement and clamp to viewport
  const pos = positions[placement];
  return {
    top: Math.max(
      scrollY,
      Math.min(pos.top, scrollY + viewportHeight - tooltipRect.height)
    ),
    left: Math.max(
      scrollX,
      Math.min(pos.left, scrollX + viewportWidth - tooltipRect.width)
    ),
    actualPlacement: placement,
  };
}

/**
 * A versatile tooltip component that displays additional information
 * when users hover over, focus on, or click an element.
 * Works seamlessly across all 8 StyleKit themes.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Tooltip content="This is a tooltip">
 *   <button>Hover me</button>
 * </Tooltip>
 *
 * // With custom placement and delay
 * <Tooltip
 *   content="Tooltip on the right"
 *   placement="right"
 *   openDelay={200}
 *   closeDelay={100}
 * >
 *   <span>Hover me</span>
 * </Tooltip>
 *
 * // With custom content
 * <Tooltip
 *   content={
 *     <div>
 *       <strong>Title</strong>
 *       <p>Description text</p>
 *     </div>
 *   }
 * >
 *   <button>Info</button>
 * </Tooltip>
 *
 * // Controlled tooltip
 * <Tooltip
 *   content="Controlled tooltip"
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   trigger="click"
 * >
 *   <button>Click me</button>
 * </Tooltip>
 * ```
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      placement = 'top',
      trigger = ['hover', 'focus'],
      openDelay = 0,
      closeDelay = 0,
      arrow = true,
      animation = 'fade',
      disabled = false,
      open: controlledOpen,
      onOpenChange,
      offset = 8,
      className,
      contentClassName,
      zIndex = 9999,
      portal = true,
    },
    ref
  ) => {
    const tooltipId = useId();
    const [internalOpen, setInternalOpen] = useState(false);
    const [position, setPosition] = useState<Position | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Determine if controlled or uncontrolled
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;

    // Normalize triggers to array
    const triggers = Array.isArray(trigger) ? trigger : [trigger];

    const clearTimeouts = useCallback(() => {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
        openTimeoutRef.current = null;
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    }, []);

    const updatePosition = useCallback(() => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const newPosition = calculatePosition(
        triggerRect,
        tooltipRect,
        placement,
        offset
      );
      setPosition(newPosition);
    }, [placement, offset]);

    const showTooltip = useCallback(() => {
      if (disabled) return;

      clearTimeouts();

      if (openDelay > 0) {
        openTimeoutRef.current = setTimeout(() => {
          if (!isControlled) {
            setInternalOpen(true);
          }
          onOpenChange?.(true);
        }, openDelay);
      } else {
        if (!isControlled) {
          setInternalOpen(true);
        }
        onOpenChange?.(true);
      }
    }, [disabled, openDelay, isControlled, onOpenChange, clearTimeouts]);

    const hideTooltip = useCallback(() => {
      clearTimeouts();

      if (closeDelay > 0) {
        closeTimeoutRef.current = setTimeout(() => {
          if (!isControlled) {
            setInternalOpen(false);
          }
          onOpenChange?.(false);
        }, closeDelay);
      } else {
        if (!isControlled) {
          setInternalOpen(false);
        }
        onOpenChange?.(false);
      }
    }, [closeDelay, isControlled, onOpenChange, clearTimeouts]);

    const toggleTooltip = useCallback(() => {
      if (isOpen) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }, [isOpen, showTooltip, hideTooltip]);

    // Handle visibility transitions
    useEffect(() => {
      if (isOpen) {
        setIsVisible(true);
        // Update position after render
        requestAnimationFrame(updatePosition);
      } else {
        // Keep visible briefly for exit animation
        const timeout = setTimeout(() => {
          setIsVisible(false);
        }, 150);
        return () => clearTimeout(timeout);
      }
    }, [isOpen, updatePosition]);

    // Update position on scroll/resize
    useEffect(() => {
      if (!isOpen) return;

      const handleUpdate = () => {
        requestAnimationFrame(updatePosition);
      };

      window.addEventListener('scroll', handleUpdate, true);
      window.addEventListener('resize', handleUpdate);

      return () => {
        window.removeEventListener('scroll', handleUpdate, true);
        window.removeEventListener('resize', handleUpdate);
      };
    }, [isOpen, updatePosition]);

    // Handle click outside for click trigger
    useEffect(() => {
      if (!isOpen || !triggers.includes('click')) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node) &&
          tooltipRef.current &&
          !tooltipRef.current.contains(event.target as Node)
        ) {
          hideTooltip();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, triggers, hideTooltip]);

    // Handle escape key
    useEffect(() => {
      if (!isOpen) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          hideTooltip();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, hideTooltip]);

    // Cleanup timeouts on unmount
    useEffect(() => {
      return clearTimeouts;
    }, [clearTimeouts]);

    // Build event handlers for the trigger element
    const triggerProps: HTMLAttributes<HTMLElement> = {
      'aria-describedby': isOpen ? tooltipId : undefined,
    };

    if (triggers.includes('hover')) {
      triggerProps.onMouseEnter = showTooltip;
      triggerProps.onMouseLeave = hideTooltip;
    }

    if (triggers.includes('focus')) {
      triggerProps.onFocus = showTooltip;
      triggerProps.onBlur = hideTooltip;
    }

    if (triggers.includes('click')) {
      triggerProps.onClick = toggleTooltip;
    }

    // Clone the child element with the trigger props and ref
    const clonedChild = isValidElement(children)
      ? cloneElement(children, {
          ...triggerProps,
          ref: (node: HTMLElement) => {
            // Handle the child's ref if it exists
            const childRef = (children as any).ref;
            if (typeof childRef === 'function') {
              childRef(node);
            } else if (childRef && typeof childRef === 'object') {
              (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
            }
            (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
          },
        } as any)
      : children;

    // Build tooltip class names
    const tooltipClassNames = [
      'sk-tooltip',
      `sk-tooltip--${position?.actualPlacement || placement}`,
      `sk-tooltip--${animation}`,
      isOpen && 'sk-tooltip--open',
      !isOpen && isVisible && 'sk-tooltip--closing',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const contentClassNames = ['sk-tooltip-content', contentClassName]
      .filter(Boolean)
      .join(' ');

    // Render tooltip content
    const tooltipContent = isVisible ? (
      <div
        ref={(node) => {
          (tooltipRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        id={tooltipId}
        role="tooltip"
        className={tooltipClassNames}
        style={{
          position: 'absolute',
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          zIndex,
          visibility: position ? 'visible' : 'hidden',
        }}
      >
        <div className={contentClassNames}>{content}</div>
        {arrow && (
          <div
            className="sk-tooltip-arrow"
            aria-hidden="true"
          />
        )}
      </div>
    ) : null;

    return (
      <>
        {clonedChild}
        {portal && typeof document !== 'undefined'
          ? tooltipContent && createPortal(tooltipContent, document.body)
          : tooltipContent}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;
