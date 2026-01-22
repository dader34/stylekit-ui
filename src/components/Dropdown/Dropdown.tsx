import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  ReactElement,
  KeyboardEvent,
  MouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import './Dropdown.css';

// Types
export type DropdownPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end';

export interface DropdownContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  placement: DropdownPlacement;
  triggerRef: React.RefObject<HTMLElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  registerItem: (id: string, disabled: boolean) => void;
  unregisterItem: (id: string) => void;
  items: Map<string, { disabled: boolean; index: number }>;
  closeOnSelect: boolean;
}

const DropdownContext = createContext<DropdownContextValue | undefined>(
  undefined
);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown');
  }
  return context;
}

// Dropdown (Container)
export interface DropdownProps {
  children: ReactNode;
  placement?: DropdownPlacement;
  closeOnSelect?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dropdown({
  children,
  placement = 'bottom-start',
  closeOnSelect = true,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemsRef = useRef<Map<string, { disabled: boolean; index: number }>>(
    new Map()
  );
  const itemCountRef = useRef(0);

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  const open = useCallback(() => setOpen(true), [setOpen]);
  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, [setOpen]);
  const toggle = useCallback(() => setOpen(!isOpen), [setOpen, isOpen]);

  const registerItem = useCallback((id: string, disabled: boolean) => {
    if (!itemsRef.current.has(id)) {
      const index = itemCountRef.current++;
      itemsRef.current.set(id, { disabled, index });
    }
  }, []);

  const unregisterItem = useCallback((id: string) => {
    itemsRef.current.delete(id);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  // Reset item count when closed
  useEffect(() => {
    if (!isOpen) {
      itemCountRef.current = 0;
      itemsRef.current.clear();
    }
  }, [isOpen]);

  const contextValue = useMemo<DropdownContextValue>(
    () => ({
      isOpen,
      open,
      close,
      toggle,
      placement,
      triggerRef,
      menuRef,
      activeIndex,
      setActiveIndex,
      registerItem,
      unregisterItem,
      items: itemsRef.current,
      closeOnSelect,
    }),
    [
      isOpen,
      open,
      close,
      toggle,
      placement,
      activeIndex,
      registerItem,
      unregisterItem,
      closeOnSelect,
    ]
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <div className="sk-dropdown">{children}</div>
    </DropdownContext.Provider>
  );
}

// DropdownTrigger
export interface DropdownTriggerProps {
  children: ReactElement;
  asChild?: boolean;
}

export const DropdownTrigger = forwardRef<HTMLElement, DropdownTriggerProps>(
  function DropdownTrigger({ children, asChild = true }, forwardedRef) {
    const { toggle, isOpen, triggerRef, menuRef, setActiveIndex, items } =
      useDropdownContext();

    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          if (!isOpen) {
            toggle();
          }
          // Focus first/last item
          setTimeout(() => {
            const itemArray = Array.from(items.entries())
              .sort((a, b) => a[1].index - b[1].index)
              .filter(([, item]) => !item.disabled);
            if (itemArray.length > 0) {
              const targetIndex =
                event.key === 'ArrowDown' ? 0 : itemArray.length - 1;
              setActiveIndex(itemArray[targetIndex][1].index);
            }
          }, 0);
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      },
      [isOpen, toggle, setActiveIndex, items]
    );

    const setRefs = useCallback(
      (node: HTMLElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLElement | null>).current =
          node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [triggerRef, forwardedRef]
    );

    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement<any>, {
        ref: setRefs,
        onClick: (e: MouseEvent) => {
          toggle();
          (children.props as any)?.onClick?.(e);
        },
        onKeyDown: (e: KeyboardEvent) => {
          handleKeyDown(e);
          (children.props as any)?.onKeyDown?.(e);
        },
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen,
        'aria-controls': isOpen ? 'sk-dropdown-menu' : undefined,
      });
    }

    return (
      <button
        ref={setRefs as React.Ref<HTMLButtonElement>}
        className="sk-dropdown-trigger"
        onClick={toggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'sk-dropdown-menu' : undefined}
        type="button"
      >
        {children}
      </button>
    );
  }
);

// DropdownMenu
export interface DropdownMenuProps {
  children: ReactNode;
  className?: string;
  portal?: boolean;
}

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  function DropdownMenu(
    { children, className = '', portal = true },
    forwardedRef
  ) {
    const {
      isOpen,
      placement,
      triggerRef,
      menuRef,
      activeIndex,
      setActiveIndex,
      items,
      close,
      closeOnSelect,
    } = useDropdownContext();
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        (menuRef as React.MutableRefObject<HTMLDivElement | null>).current =
          node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [menuRef, forwardedRef]
    );

    // Calculate position
    useEffect(() => {
      if (!isOpen || !triggerRef.current) return;

      const updatePosition = () => {
        const triggerRect = triggerRef.current!.getBoundingClientRect();
        const menuEl = menuRef.current;
        const menuHeight = menuEl?.offsetHeight || 200;
        const menuWidth = menuEl?.offsetWidth || 200;

        let top = 0;
        let left = 0;

        // Vertical positioning
        if (placement.startsWith('bottom')) {
          top = triggerRect.bottom + window.scrollY + 4;
        } else {
          top = triggerRect.top + window.scrollY - menuHeight - 4;
        }

        // Horizontal positioning
        if (placement.endsWith('start')) {
          left = triggerRect.left + window.scrollX;
        } else {
          left = triggerRect.right + window.scrollX - menuWidth;
        }

        // Viewport boundary checks
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Prevent going off-screen horizontally
        if (left < 8) {
          left = 8;
        } else if (left + menuWidth > viewportWidth - 8) {
          left = viewportWidth - menuWidth - 8;
        }

        // Flip vertical if needed
        if (placement.startsWith('bottom') && top + menuHeight > viewportHeight + window.scrollY - 8) {
          top = triggerRect.top + window.scrollY - menuHeight - 4;
        } else if (placement.startsWith('top') && top < window.scrollY + 8) {
          top = triggerRect.bottom + window.scrollY + 4;
        }

        setPosition({ top, left });
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }, [isOpen, placement, triggerRef, menuRef]);

    // Keyboard navigation
    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        const itemArray = Array.from(items.entries())
          .sort((a, b) => a[1].index - b[1].index)
          .filter(([, item]) => !item.disabled);

        if (itemArray.length === 0) return;

        const currentItemIndex = itemArray.findIndex(
          ([, item]) => item.index === activeIndex
        );

        switch (event.key) {
          case 'ArrowDown': {
            event.preventDefault();
            const nextIndex =
              currentItemIndex < itemArray.length - 1
                ? currentItemIndex + 1
                : 0;
            setActiveIndex(itemArray[nextIndex][1].index);
            break;
          }
          case 'ArrowUp': {
            event.preventDefault();
            const prevIndex =
              currentItemIndex > 0
                ? currentItemIndex - 1
                : itemArray.length - 1;
            setActiveIndex(itemArray[prevIndex][1].index);
            break;
          }
          case 'Home': {
            event.preventDefault();
            setActiveIndex(itemArray[0][1].index);
            break;
          }
          case 'End': {
            event.preventDefault();
            setActiveIndex(itemArray[itemArray.length - 1][1].index);
            break;
          }
          case 'Tab': {
            close();
            break;
          }
        }
      },
      [items, activeIndex, setActiveIndex, close]
    );

    // Focus menu when opened
    useEffect(() => {
      if (isOpen && menuRef.current) {
        menuRef.current.focus();
      }
    }, [isOpen, menuRef]);

    if (!isOpen) return null;

    const menuContent = (
      <div
        ref={setRefs}
        id="sk-dropdown-menu"
        className={`sk-dropdown-menu sk-dropdown-menu--${placement} ${className}`.trim()}
        role="menu"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        style={
          portal
            ? {
                position: 'absolute',
                top: position.top,
                left: position.left,
              }
            : undefined
        }
      >
        {children}
      </div>
    );

    if (portal && typeof document !== 'undefined') {
      return createPortal(menuContent, document.body);
    }

    return menuContent;
  }
);

// DropdownItem
export interface DropdownItemProps {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
  destructive?: boolean;
}

export const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  function DropdownItem(
    {
      children,
      onClick,
      disabled = false,
      icon,
      className = '',
      destructive = false,
    },
    forwardedRef
  ) {
    const {
      close,
      closeOnSelect,
      registerItem,
      unregisterItem,
      activeIndex,
      setActiveIndex,
      items,
      triggerRef,
    } = useDropdownContext();
    const idRef = useRef(
      `dropdown-item-${Math.random().toString(36).substring(2, 9)}`
    );
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      registerItem(idRef.current, disabled);
      return () => unregisterItem(idRef.current);
    }, [registerItem, unregisterItem, disabled]);

    const itemData = items.get(idRef.current);
    const isActive = itemData && activeIndex === itemData.index;

    // Focus when active
    useEffect(() => {
      if (isActive && itemRef.current) {
        itemRef.current.focus();
      }
    }, [isActive]);

    const handleClick = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        onClick?.(event);
        if (closeOnSelect) {
          close();
          triggerRef.current?.focus();
        }
      },
      [disabled, onClick, closeOnSelect, close, triggerRef]
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (!disabled) {
            onClick?.(event as unknown as MouseEvent<HTMLDivElement>);
            if (closeOnSelect) {
              close();
              triggerRef.current?.focus();
            }
          }
        }
      },
      [disabled, onClick, closeOnSelect, close, triggerRef]
    );

    const handleMouseEnter = useCallback(() => {
      if (!disabled && itemData) {
        setActiveIndex(itemData.index);
      }
    }, [disabled, itemData, setActiveIndex]);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        itemRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );

    return (
      <div
        ref={setRefs}
        className={`sk-dropdown-item ${isActive ? 'sk-dropdown-item--active' : ''} ${
          disabled ? 'sk-dropdown-item--disabled' : ''
        } ${destructive ? 'sk-dropdown-item--destructive' : ''} ${className}`.trim()}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
      >
        {icon && <span className="sk-dropdown-item-icon">{icon}</span>}
        <span className="sk-dropdown-item-content">{children}</span>
      </div>
    );
  }
);

// DropdownDivider
export interface DropdownDividerProps {
  className?: string;
}

export function DropdownDivider({ className = '' }: DropdownDividerProps) {
  return (
    <div
      className={`sk-dropdown-divider ${className}`.trim()}
      role="separator"
    />
  );
}

// DropdownGroup
export interface DropdownGroupProps {
  children: ReactNode;
  label?: string;
  className?: string;
}

export function DropdownGroup({
  children,
  label,
  className = '',
}: DropdownGroupProps) {
  const labelId = useRef(
    `dropdown-group-${Math.random().toString(36).substring(2, 9)}`
  );

  return (
    <div
      className={`sk-dropdown-group ${className}`.trim()}
      role="group"
      aria-labelledby={label ? labelId.current : undefined}
    >
      {label && (
        <div id={labelId.current} className="sk-dropdown-group-label">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

// Export context hook for advanced usage
export { useDropdownContext };
