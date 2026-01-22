import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  forwardRef,
  useMemo,
  ReactNode,
  HTMLAttributes,
  ButtonHTMLAttributes,
  KeyboardEvent,
} from 'react';
import './Tabs.css';

// ============================================================================
// Types
// ============================================================================

export type TabsVariant = 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsOrientation = 'horizontal' | 'vertical';

export interface TabsContextValue {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  variant: TabsVariant;
  size: TabsSize;
  orientation: TabsOrientation;
  tabRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  registerTab: (index: number, ref: HTMLButtonElement | null) => void;
  tabCount: React.MutableRefObject<number>;
  indicatorStyle: React.CSSProperties;
  setIndicatorStyle: React.Dispatch<React.SetStateAction<React.CSSProperties>>;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * The content of the tabs (TabList and TabPanels)
   */
  children: ReactNode;

  /**
   * The index of the selected tab (controlled mode)
   */
  index?: number;

  /**
   * The default selected tab index (uncontrolled mode)
   * @default 0
   */
  defaultIndex?: number;

  /**
   * Callback fired when the selected tab changes
   */
  onChange?: (index: number) => void;

  /**
   * The visual style variant of the tabs
   * @default 'line'
   */
  variant?: TabsVariant;

  /**
   * The size of the tabs
   * @default 'md'
   */
  size?: TabsSize;

  /**
   * The orientation of the tabs
   * @default 'horizontal'
   */
  orientation?: TabsOrientation;

  /**
   * Whether to fit tabs to the container width
   * @default false
   */
  isFitted?: boolean;

  /**
   * Whether to manually activate tabs (requires Enter/Space to select)
   * @default false
   */
  isManual?: boolean;
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The tab buttons
   */
  children: ReactNode;
}

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * The content of the tab button
   */
  children: ReactNode;

  /**
   * Whether the tab is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Icon to display on the left side of the tab
   */
  leftIcon?: ReactNode;

  /**
   * Icon to display on the right side of the tab
   */
  rightIcon?: ReactNode;

  /**
   * Internal index (set by TabList)
   * @internal
   */
  _index?: number;
}

export interface TabPanelsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The tab panel content
   */
  children: ReactNode;
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the tab panel
   */
  children: ReactNode;

  /**
   * Internal index (set by TabPanels)
   * @internal
   */
  _index?: number;
}

// ============================================================================
// Context
// ============================================================================

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabs(): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
}

// ============================================================================
// Tabs (Container)
// ============================================================================

/**
 * A versatile tabs component that supports multiple variants, sizes, and orientations.
 * Works seamlessly across all 8 StyleKit themes.
 *
 * @example
 * ```tsx
 * <Tabs variant="line" size="md">
 *   <TabList>
 *     <Tab>Account</Tab>
 *     <Tab>Security</Tab>
 *     <Tab isDisabled>Disabled</Tab>
 *   </TabList>
 *   <TabPanels>
 *     <TabPanel>Account settings content</TabPanel>
 *     <TabPanel>Security settings content</TabPanel>
 *     <TabPanel>Disabled content</TabPanel>
 *   </TabPanels>
 * </Tabs>
 * ```
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      children,
      index: controlledIndex,
      defaultIndex = 0,
      onChange,
      variant = 'line',
      size = 'md',
      orientation = 'horizontal',
      isFitted = false,
      isManual = false,
      className,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledIndex !== undefined;
    const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultIndex);
    const selectedIndex = isControlled ? controlledIndex : uncontrolledIndex;

    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const tabCount = useRef<number>(0);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

    const setSelectedIndex = useCallback(
      (newIndex: number) => {
        if (!isControlled) {
          setUncontrolledIndex(newIndex);
        }
        onChange?.(newIndex);
      },
      [isControlled, onChange]
    );

    const registerTab = useCallback((index: number, tabRef: HTMLButtonElement | null) => {
      tabRefs.current[index] = tabRef;
    }, []);

    const contextValue = useMemo<TabsContextValue>(
      () => ({
        selectedIndex,
        setSelectedIndex,
        variant,
        size,
        orientation,
        tabRefs,
        registerTab,
        tabCount,
        indicatorStyle,
        setIndicatorStyle,
      }),
      [selectedIndex, setSelectedIndex, variant, size, orientation, registerTab, indicatorStyle]
    );

    const classNames = [
      'sk-tabs',
      `sk-tabs--${variant}`,
      `sk-tabs--${size}`,
      `sk-tabs--${orientation}`,
      isFitted && 'sk-tabs--fitted',
      isManual && 'sk-tabs--manual',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <TabsContext.Provider value={contextValue}>
        <div ref={ref} className={classNames} data-orientation={orientation} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

// ============================================================================
// TabList
// ============================================================================

/**
 * Container for tab buttons. Handles keyboard navigation and indicator positioning.
 */
export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ children, className, ...props }, ref) => {
    const {
      selectedIndex,
      setSelectedIndex,
      variant,
      orientation,
      tabRefs,
      tabCount,
      setIndicatorStyle,
    } = useTabs();

    const listRef = useRef<HTMLDivElement>(null);

    // Update indicator position when selected tab changes
    useEffect(() => {
      const selectedTab = tabRefs.current[selectedIndex];
      if (selectedTab && listRef.current) {
        const listRect = listRef.current.getBoundingClientRect();
        const tabRect = selectedTab.getBoundingClientRect();

        if (orientation === 'horizontal') {
          setIndicatorStyle({
            width: `${tabRect.width}px`,
            height: variant === 'line' ? '2px' : undefined,
            transform: `translateX(${tabRect.left - listRect.left}px)`,
          });
        } else {
          setIndicatorStyle({
            height: `${tabRect.height}px`,
            width: variant === 'line' ? '2px' : undefined,
            transform: `translateY(${tabRect.top - listRect.top}px)`,
          });
        }
      }
    }, [selectedIndex, orientation, variant, setIndicatorStyle, tabRefs]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        const count = tabCount.current;
        if (count === 0) return;

        const isHorizontal = orientation === 'horizontal';
        const isRTL = document.dir === 'rtl';

        let nextIndex = selectedIndex;

        switch (event.key) {
          case 'ArrowLeft':
            if (isHorizontal) {
              nextIndex = isRTL
                ? (selectedIndex + 1) % count
                : (selectedIndex - 1 + count) % count;
            }
            break;
          case 'ArrowRight':
            if (isHorizontal) {
              nextIndex = isRTL
                ? (selectedIndex - 1 + count) % count
                : (selectedIndex + 1) % count;
            }
            break;
          case 'ArrowUp':
            if (!isHorizontal) {
              nextIndex = (selectedIndex - 1 + count) % count;
            }
            break;
          case 'ArrowDown':
            if (!isHorizontal) {
              nextIndex = (selectedIndex + 1) % count;
            }
            break;
          case 'Home':
            nextIndex = 0;
            break;
          case 'End':
            nextIndex = count - 1;
            break;
          default:
            return;
        }

        // Skip disabled tabs
        let attempts = 0;
        while (
          tabRefs.current[nextIndex]?.disabled &&
          attempts < count
        ) {
          nextIndex = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
            ? (nextIndex - 1 + count) % count
            : (nextIndex + 1) % count;
          attempts++;
        }

        if (nextIndex !== selectedIndex && !tabRefs.current[nextIndex]?.disabled) {
          event.preventDefault();
          setSelectedIndex(nextIndex);
          tabRefs.current[nextIndex]?.focus();
        }
      },
      [selectedIndex, setSelectedIndex, orientation, tabRefs, tabCount]
    );

    // Count and clone children with index
    const childrenWithIndex = React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        tabCount.current = index + 1;
        return React.cloneElement(child as React.ReactElement<TabProps>, {
          _index: index,
        });
      }
      return child;
    });

    const classNames = ['sk-tab-list', className].filter(Boolean).join(' ');

    return (
      <div
        ref={(node) => {
          listRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={classNames}
        role="tablist"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {childrenWithIndex}
        {/* Animated indicator for line variant */}
        {variant === 'line' && <div className="sk-tab-indicator" />}
      </div>
    );
  }
);

TabList.displayName = 'TabList';

// ============================================================================
// Tab
// ============================================================================

/**
 * Individual tab button with support for icons and disabled state.
 */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      children,
      isDisabled = false,
      leftIcon,
      rightIcon,
      _index = 0,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const { selectedIndex, setSelectedIndex, registerTab, variant, size } = useTabs();
    const isSelected = selectedIndex === _index;

    const internalRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      registerTab(_index, internalRef.current);
    }, [_index, registerTab]);

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!isDisabled) {
          setSelectedIndex(_index);
        }
        onClick?.(event);
      },
      [_index, isDisabled, setSelectedIndex, onClick]
    );

    const classNames = [
      'sk-tab',
      `sk-tab--${variant}`,
      `sk-tab--${size}`,
      isSelected && 'sk-tab--selected',
      isDisabled && 'sk-tab--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        type="button"
        role="tab"
        className={classNames}
        aria-selected={isSelected}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        tabIndex={isSelected ? 0 : -1}
        id={`sk-tab-${_index}`}
        aria-controls={`sk-tabpanel-${_index}`}
        onClick={handleClick}
        {...props}
      >
        {leftIcon && <span className="sk-tab-icon sk-tab-icon--left">{leftIcon}</span>}
        <span className="sk-tab-label">{children}</span>
        {rightIcon && <span className="sk-tab-icon sk-tab-icon--right">{rightIcon}</span>}
      </button>
    );
  }
);

Tab.displayName = 'Tab';

// ============================================================================
// TabPanels
// ============================================================================

/**
 * Container for tab panel content.
 */
export const TabPanels = forwardRef<HTMLDivElement, TabPanelsProps>(
  ({ children, className, ...props }, ref) => {
    const childrenWithIndex = React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<TabPanelProps>, {
          _index: index,
        });
      }
      return child;
    });

    const classNames = ['sk-tab-panels', className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classNames} {...props}>
        {childrenWithIndex}
      </div>
    );
  }
);

TabPanels.displayName = 'TabPanels';

// ============================================================================
// TabPanel
// ============================================================================

/**
 * Individual tab panel content. Only the selected panel is rendered/visible.
 */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ children, _index = 0, className, ...props }, ref) => {
    const { selectedIndex } = useTabs();
    const isSelected = selectedIndex === _index;

    const classNames = [
      'sk-tab-panel',
      isSelected && 'sk-tab-panel--selected',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={classNames}
        id={`sk-tabpanel-${_index}`}
        aria-labelledby={`sk-tab-${_index}`}
        hidden={!isSelected}
        tabIndex={isSelected ? 0 : -1}
        {...props}
      >
        {isSelected && children}
      </div>
    );
  }
);

TabPanel.displayName = 'TabPanel';

// ============================================================================
// Exports
// ============================================================================

export default Tabs;
