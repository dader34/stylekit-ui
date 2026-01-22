import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
  forwardRef,
  useId,
} from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

// ============================================================================
// Types
// ============================================================================

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
  modalId: string;
  titleId: string;
  descriptionId: string;
  size: ModalSize;
}

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal should close */
  onClose: () => void;
  /** Children to render inside the modal */
  children: React.ReactNode;
  /** Size variant of the modal */
  size?: ModalSize;
  /** Whether clicking the overlay closes the modal */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEsc?: boolean;
  /** Whether to render in a portal */
  usePortal?: boolean;
  /** Container element for the portal */
  portalContainer?: HTMLElement;
  /** Initial element to focus when modal opens */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Element to return focus to when modal closes */
  finalFocusRef?: React.RefObject<HTMLElement>;
  /** Additional CSS class names */
  className?: string;
  /** Lock body scroll when modal is open */
  lockScroll?: boolean;
}

export interface ModalOverlayProps {
  /** Whether the overlay has a blur effect */
  blur?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export interface ModalContentProps {
  /** Children to render inside the content */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export interface ModalHeaderProps {
  /** Children to render inside the header */
  children: React.ReactNode;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export interface ModalBodyProps {
  /** Children to render inside the body */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export interface ModalFooterProps {
  /** Children to render inside the footer */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export interface ModalCloseButtonProps {
  /** Additional CSS class names */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Accessible label for the button */
  'aria-label'?: string;
}

// ============================================================================
// Context
// ============================================================================

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

function useModalContext(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      'Modal compound components must be rendered within a Modal component'
    );
  }
  return context;
}

// ============================================================================
// Focus Management Utilities
// ============================================================================

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
}

function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean,
  initialFocusRef?: React.RefObject<HTMLElement>
) {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Set initial focus
    const setInitialFocus = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const focusableElements = getFocusableElements(container);
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          container.focus();
        }
      }
    };

    // Use requestAnimationFrame to ensure the modal is rendered
    requestAnimationFrame(setInitialFocus);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, containerRef, initialFocusRef]);

  // Return focus to previous element when modal closes
  useEffect(() => {
    if (isActive) return;

    return () => {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive]);
}

function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
}

// ============================================================================
// Modal Components
// ============================================================================

/**
 * ModalOverlay - The backdrop behind the modal dialog
 */
export const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>(
  function ModalOverlay({ blur = false, className = '', style }, ref) {
    const { isOpen } = useModalContext();

    return (
      <div
        ref={ref}
        className={`sk-modal-overlay ${blur ? 'sk-modal-overlay--blur' : ''} ${
          isOpen ? 'sk-modal-overlay--visible' : ''
        } ${className}`}
        style={style}
        aria-hidden="true"
      />
    );
  }
);

/**
 * ModalCloseButton - A close button for the modal
 */
export const ModalCloseButton = forwardRef<HTMLButtonElement, ModalCloseButtonProps>(
  function ModalCloseButton(
    { className = '', style, 'aria-label': ariaLabel = 'Close modal' },
    ref
  ) {
    const { onClose } = useModalContext();

    return (
      <button
        ref={ref}
        type="button"
        className={`sk-modal-close-button ${className}`}
        style={style}
        onClick={onClose}
        aria-label={ariaLabel}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M15 5L5 15M5 5L15 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  }
);

/**
 * ModalContent - The dialog container
 */
export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  function ModalContent({ children, className = '', style }, ref) {
    const { isOpen, modalId, titleId, descriptionId, size } = useModalContext();

    return (
      <div
        ref={ref}
        id={modalId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={`sk-modal-content sk-modal-content--${size} ${
          isOpen ? 'sk-modal-content--visible' : ''
        } ${className}`}
        style={style}
        tabIndex={-1}
      >
        {children}
      </div>
    );
  }
);

/**
 * ModalHeader - The header section with optional close button
 */
export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  function ModalHeader(
    { children, showCloseButton = true, className = '', style },
    ref
  ) {
    const { titleId } = useModalContext();

    return (
      <div ref={ref} className={`sk-modal-header ${className}`} style={style}>
        <h2 id={titleId} className="sk-modal-title">
          {children}
        </h2>
        {showCloseButton && <ModalCloseButton />}
      </div>
    );
  }
);

/**
 * ModalBody - The scrollable content area
 */
export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  function ModalBody({ children, className = '', style }, ref) {
    const { descriptionId } = useModalContext();

    return (
      <div
        ref={ref}
        id={descriptionId}
        className={`sk-modal-body ${className}`}
        style={style}
      >
        {children}
      </div>
    );
  }
);

/**
 * ModalFooter - The footer section for actions
 */
export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  function ModalFooter({ children, className = '', style }, ref) {
    return (
      <div ref={ref} className={`sk-modal-footer ${className}`} style={style}>
        {children}
      </div>
    );
  }
);

/**
 * Modal - The main container component
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    isOpen,
    onClose,
    children,
    size = 'md',
    closeOnOverlayClick = true,
    closeOnEsc = true,
    usePortal = true,
    portalContainer,
    initialFocusRef,
    finalFocusRef,
    className = '',
    lockScroll = true,
  },
  ref
) {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalId = useId();
  const titleId = `${modalId}-title`;
  const descriptionId = `${modalId}-description`;

  // Handle ESC key
  const handleEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose]
  );

  // Register ESC key handler
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, handleEscKey]);

  // Focus management
  useFocusTrap(containerRef, isOpen, initialFocusRef);

  // Scroll lock
  useScrollLock(isOpen && lockScroll);

  // Return focus to final focus ref on close
  useEffect(() => {
    if (!isOpen && finalFocusRef?.current) {
      finalFocusRef.current.focus();
    }
  }, [isOpen, finalFocusRef]);

  // Handle mount/unmount animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    } else {
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Don't render if not mounted
  if (!isMounted && !isOpen) {
    return null;
  }

  const contextValue: ModalContextValue = {
    isOpen,
    onClose,
    modalId,
    titleId,
    descriptionId,
    size,
  };

  const modalContent = (
    <ModalContext.Provider value={contextValue}>
      <div
        ref={(node) => {
          // Handle both refs
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`sk-modal ${isOpen ? 'sk-modal--open' : 'sk-modal--closed'} ${className}`}
        onClick={handleOverlayClick}
      >
        {children}
      </div>
    </ModalContext.Provider>
  );

  if (usePortal) {
    const container = portalContainer || document.body;
    return createPortal(modalContent, container);
  }

  return modalContent;
});

// ============================================================================
// Display Names
// ============================================================================

Modal.displayName = 'Modal';
ModalOverlay.displayName = 'ModalOverlay';
ModalContent.displayName = 'ModalContent';
ModalHeader.displayName = 'ModalHeader';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';
ModalCloseButton.displayName = 'ModalCloseButton';

export default Modal;
