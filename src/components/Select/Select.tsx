import React, {
  forwardRef,
  SelectHTMLAttributes,
  ReactNode,
  useId,
} from 'react';
import './Select.css';

// ============================================================================
// Types
// ============================================================================

export type SelectVariant = 'default' | 'filled' | 'flushed';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOptionType<T = string> {
  /**
   * The value of the option
   */
  value: T;

  /**
   * The label to display for the option
   */
  label: string;

  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
}

export interface SelectProps<T = string>
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    'size' | 'value' | 'onChange'
  > {
  /**
   * The visual style variant of the select
   * @default 'default'
   */
  variant?: SelectVariant;

  /**
   * The size of the select
   * @default 'md'
   */
  size?: SelectSize;

  /**
   * The current value of the select
   */
  value?: T;

  /**
   * Callback when the value changes
   */
  onChange?: (
    value: T,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;

  /**
   * Label text to display above the select
   */
  label?: string;

  /**
   * Helper text to display below the select
   */
  helperText?: string;

  /**
   * Error message to display below the select
   * When provided, the select will be styled as invalid
   */
  errorMessage?: string;

  /**
   * Placeholder text shown when no value is selected
   */
  placeholder?: string;

  /**
   * Whether the select is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the select is required
   * @default false
   */
  required?: boolean;

  /**
   * Array of options to render
   * Alternative to using SelectOption children
   */
  options?: SelectOptionType<T>[];

  /**
   * Custom chevron icon to display
   * Pass null to hide the chevron
   */
  chevronIcon?: ReactNode;

  /**
   * Whether the select takes the full width of its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Children elements (SelectOption components)
   */
  children?: ReactNode;
}

// ============================================================================
// SelectOption Component
// ============================================================================

export interface SelectOptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {
  /**
   * The value of the option
   */
  value: string | number;

  /**
   * The label to display
   */
  children: ReactNode;
}

/**
 * Option component for use within Select
 *
 * @example
 * ```tsx
 * <SelectOption value="apple">Apple</SelectOption>
 * ```
 */
export const SelectOption = forwardRef<HTMLOptionElement, SelectOptionProps>(
  ({ children, ...props }, ref) => {
    return (
      <option ref={ref} className="sk-select-option" {...props}>
        {children}
      </option>
    );
  }
);

SelectOption.displayName = 'SelectOption';

// ============================================================================
// SelectOptGroup Component
// ============================================================================

export interface SelectOptGroupProps
  extends React.OptgroupHTMLAttributes<HTMLOptGroupElement> {
  /**
   * Label for the option group
   */
  label: string;

  /**
   * Children elements (SelectOption components)
   */
  children: ReactNode;
}

/**
 * Option group component for use within Select
 *
 * @example
 * ```tsx
 * <SelectOptGroup label="Fruits">
 *   <SelectOption value="apple">Apple</SelectOption>
 *   <SelectOption value="banana">Banana</SelectOption>
 * </SelectOptGroup>
 * ```
 */
export const SelectOptGroup = forwardRef<
  HTMLOptGroupElement,
  SelectOptGroupProps
>(({ children, ...props }, ref) => {
  return (
    <optgroup ref={ref} className="sk-select-optgroup" {...props}>
      {children}
    </optgroup>
  );
});

SelectOptGroup.displayName = 'SelectOptGroup';

// ============================================================================
// Default Chevron Icon
// ============================================================================

const DefaultChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ============================================================================
// Select Component
// ============================================================================

/**
 * A versatile select component that wraps the native select element with custom styling.
 * Supports multiple variants, sizes, and states. Works seamlessly across all 8 StyleKit themes.
 *
 * @example
 * ```tsx
 * // Using options array
 * <Select
 *   label="Choose a fruit"
 *   placeholder="Select a fruit"
 *   options={[
 *     { value: 'apple', label: 'Apple' },
 *     { value: 'banana', label: 'Banana' },
 *     { value: 'orange', label: 'Orange' },
 *   ]}
 *   value={selectedFruit}
 *   onChange={(value) => setSelectedFruit(value)}
 * />
 *
 * // Using SelectOption children
 * <Select
 *   variant="filled"
 *   size="lg"
 *   label="Country"
 *   helperText="Select your country of residence"
 * >
 *   <SelectOption value="us">United States</SelectOption>
 *   <SelectOption value="uk">United Kingdom</SelectOption>
 *   <SelectOption value="ca">Canada</SelectOption>
 * </Select>
 *
 * // With error state
 * <Select
 *   label="Category"
 *   errorMessage="Please select a category"
 *   required
 * >
 *   <SelectOption value="">Select a category</SelectOption>
 *   <SelectOption value="tech">Technology</SelectOption>
 * </Select>
 * ```
 */
function SelectInner<T = string>(
  {
    variant = 'default',
    size = 'md',
    value,
    onChange,
    label,
    helperText,
    errorMessage,
    placeholder,
    disabled = false,
    required = false,
    options,
    chevronIcon,
    fullWidth = false,
    children,
    className,
    id: propId,
    'aria-describedby': ariaDescribedBy,
    ...props
  }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  const generatedId = useId();
  const id = propId || generatedId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  const hasError = Boolean(errorMessage);
  const hasHelperText = Boolean(helperText);

  // Build aria-describedby
  const describedByIds: string[] = [];
  if (ariaDescribedBy) describedByIds.push(ariaDescribedBy);
  if (hasError) describedByIds.push(errorId);
  else if (hasHelperText) describedByIds.push(helperId);

  const wrapperClassNames = [
    'sk-select-wrapper',
    `sk-select-wrapper--${size}`,
    fullWidth && 'sk-select-wrapper--full-width',
  ]
    .filter(Boolean)
    .join(' ');

  const selectClassNames = [
    'sk-select',
    `sk-select--${variant}`,
    `sk-select--${size}`,
    hasError && 'sk-select--error',
    disabled && 'sk-select--disabled',
    !value && placeholder && 'sk-select--placeholder',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event.target.value as T, event);
    }
  };

  // Determine what to render as options
  const renderOptions = () => {
    // If options array is provided, render from that
    if (options && options.length > 0) {
      return options.map((option) => (
        <option
          key={String(option.value)}
          value={String(option.value)}
          disabled={option.disabled}
          className="sk-select-option"
        >
          {option.label}
        </option>
      ));
    }
    // Otherwise, render children
    return children;
  };

  // Render chevron icon
  const renderChevron = () => {
    if (chevronIcon === null) return null;
    if (chevronIcon) {
      return <span className="sk-select-chevron">{chevronIcon}</span>;
    }
    return (
      <span className="sk-select-chevron">
        <DefaultChevronIcon className="sk-select-chevron-icon" />
      </span>
    );
  };

  return (
    <div className={wrapperClassNames}>
      {label && (
        <label htmlFor={id} className="sk-select-label">
          {label}
          {required && <span className="sk-select-required">*</span>}
        </label>
      )}

      <div className="sk-select-container">
        <select
          ref={ref}
          id={id}
          className={selectClassNames}
          value={value !== undefined ? String(value) : undefined}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            describedByIds.length > 0 ? describedByIds.join(' ') : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="sk-select-placeholder-option">
              {placeholder}
            </option>
          )}
          {renderOptions()}
        </select>

        {renderChevron()}
      </div>

      {hasError && (
        <span id={errorId} className="sk-select-error" role="alert">
          {errorMessage}
        </span>
      )}

      {!hasError && hasHelperText && (
        <span id={helperId} className="sk-select-helper">
          {helperText}
        </span>
      )}
    </div>
  );
}

// Use type assertion to properly type the forwardRef with generics
export const Select = forwardRef(SelectInner) as <T = string>(
  props: SelectProps<T> & { ref?: React.ForwardedRef<HTMLSelectElement> }
) => React.ReactElement;

// For display name
(Select as React.FC).displayName = 'Select';

export default Select;
