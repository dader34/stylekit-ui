import React, {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  createContext,
  useContext,
  useCallback,
  useId,
} from 'react';
import './Checkbox.css';

export type CheckboxSize = 'sm' | 'md' | 'lg';
export type CheckboxColor = 'primary' | 'success' | 'warning' | 'error';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * The size of the checkbox
   * @default 'md'
   */
  size?: CheckboxSize;

  /**
   * The color variant of the checkbox
   * @default 'primary'
   */
  color?: CheckboxColor;

  /**
   * Whether the checkbox is in an indeterminate state
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Whether the checkbox is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Label text displayed next to the checkbox
   */
  label?: ReactNode;

  /**
   * Additional description text below the label
   */
  description?: ReactNode;

  /**
   * Whether the checkbox is checked (controlled mode)
   */
  checked?: boolean;

  /**
   * Default checked state (uncontrolled mode)
   */
  defaultChecked?: boolean;

  /**
   * Callback fired when the checkbox state changes
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Check mark icon component with animation support
 */
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`sk-checkbox-icon ${className || ''}`}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      className="sk-checkbox-check-path"
      d="M2.5 6L5 8.5L9.5 3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Indeterminate (minus) icon component
 */
const IndeterminateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`sk-checkbox-icon ${className || ''}`}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      className="sk-checkbox-indeterminate-path"
      d="M2.5 6H9.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * A customizable checkbox component with support for multiple sizes, colors,
 * indeterminate state, and labels. Works seamlessly across all 8 StyleKit themes.
 *
 * @example
 * ```tsx
 * <Checkbox label="Accept terms" />
 *
 * <Checkbox
 *   color="success"
 *   size="lg"
 *   label="Enable notifications"
 *   description="Receive updates about your account"
 * />
 *
 * <Checkbox indeterminate label="Select all" />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      color = 'primary',
      indeterminate = false,
      disabled = false,
      label,
      description,
      checked,
      defaultChecked,
      onChange,
      className,
      id,
      name,
      value,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const groupContext = useCheckboxGroupContext();

    // Determine if this checkbox is part of a group
    const isInGroup = groupContext !== null;

    // Calculate checked state - group context takes precedence
    const isChecked = isInGroup
      ? groupContext.value.includes(value as string)
      : checked;

    // Handle change - notify group if in group
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (isInGroup && value !== undefined) {
          groupContext.onChange(value as string, event.target.checked);
        }

        onChange?.(event);
      },
      [disabled, isInGroup, value, groupContext, onChange]
    );

    // Inherit size and color from group if available
    const effectiveSize = isInGroup ? groupContext.size || size : size;
    const effectiveColor = isInGroup ? groupContext.color || color : color;
    const effectiveDisabled = isInGroup
      ? groupContext.disabled || disabled
      : disabled;

    const wrapperClassNames = [
      'sk-checkbox-wrapper',
      `sk-checkbox-wrapper--${effectiveSize}`,
      effectiveDisabled && 'sk-checkbox-wrapper--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const boxClassNames = [
      'sk-checkbox-box',
      `sk-checkbox-box--${effectiveSize}`,
      `sk-checkbox-box--${effectiveColor}`,
      (isChecked || indeterminate) && 'sk-checkbox-box--checked',
      indeterminate && 'sk-checkbox-box--indeterminate',
      effectiveDisabled && 'sk-checkbox-box--disabled',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label className={wrapperClassNames} htmlFor={checkboxId}>
        <span className="sk-checkbox-control">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            name={isInGroup ? groupContext.name : name}
            value={value}
            checked={isChecked}
            defaultChecked={!isInGroup ? defaultChecked : undefined}
            disabled={effectiveDisabled}
            onChange={handleChange}
            className="sk-checkbox-input"
            aria-checked={indeterminate ? 'mixed' : isChecked}
            aria-disabled={effectiveDisabled}
            {...props}
          />
          <span className={boxClassNames} aria-hidden="true">
            {indeterminate ? (
              <IndeterminateIcon />
            ) : (
              <CheckIcon />
            )}
          </span>
        </span>
        {(label || description) && (
          <span className="sk-checkbox-content">
            {label && (
              <span className="sk-checkbox-label">{label}</span>
            )}
            {description && (
              <span className="sk-checkbox-description">{description}</span>
            )}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// ============================================================================
// CheckboxGroup
// ============================================================================

interface CheckboxGroupContextValue {
  name?: string;
  value: string[];
  onChange: (value: string, checked: boolean) => void;
  size?: CheckboxSize;
  color?: CheckboxColor;
  disabled?: boolean;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(
  null
);

const useCheckboxGroupContext = () => useContext(CheckboxGroupContext);

export interface CheckboxGroupProps {
  /**
   * The name attribute for all checkboxes in the group
   */
  name?: string;

  /**
   * Array of checked values (controlled mode)
   */
  value?: string[];

  /**
   * Default checked values (uncontrolled mode)
   */
  defaultValue?: string[];

  /**
   * Callback fired when any checkbox in the group changes
   */
  onChange?: (value: string[]) => void;

  /**
   * The size for all checkboxes in the group
   */
  size?: CheckboxSize;

  /**
   * The color for all checkboxes in the group
   */
  color?: CheckboxColor;

  /**
   * Whether all checkboxes in the group are disabled
   */
  disabled?: boolean;

  /**
   * Label for the checkbox group
   */
  label?: ReactNode;

  /**
   * Layout direction of the checkboxes
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * The checkbox components
   */
  children: ReactNode;
}

/**
 * A group component for managing multiple related checkboxes.
 * Provides shared state management, styling, and accessibility.
 *
 * @example
 * ```tsx
 * <CheckboxGroup
 *   label="Select your interests"
 *   value={selectedInterests}
 *   onChange={setSelectedInterests}
 * >
 *   <Checkbox value="music" label="Music" />
 *   <Checkbox value="sports" label="Sports" />
 *   <Checkbox value="tech" label="Technology" />
 * </CheckboxGroup>
 * ```
 */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      name,
      value: controlledValue,
      defaultValue = [],
      onChange,
      size,
      color,
      disabled = false,
      label,
      orientation = 'vertical',
      className,
      children,
    },
    ref
  ) => {
    // Use internal state for uncontrolled mode
    const [internalValue, setInternalValue] =
      React.useState<string[]>(defaultValue);

    // Determine if controlled or uncontrolled
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const handleChange = useCallback(
      (itemValue: string, checked: boolean) => {
        const newValue = checked
          ? [...currentValue, itemValue]
          : currentValue.filter((v) => v !== itemValue);

        if (!isControlled) {
          setInternalValue(newValue);
        }

        onChange?.(newValue);
      },
      [currentValue, isControlled, onChange]
    );

    const contextValue: CheckboxGroupContextValue = {
      name,
      value: currentValue,
      onChange: handleChange,
      size,
      color,
      disabled,
    };

    const groupClassNames = [
      'sk-checkbox-group',
      `sk-checkbox-group--${orientation}`,
      disabled && 'sk-checkbox-group--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <CheckboxGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={groupClassNames}
          role="group"
          aria-labelledby={label ? `${name}-label` : undefined}
          aria-disabled={disabled}
        >
          {label && (
            <span
              id={`${name}-label`}
              className="sk-checkbox-group-label"
            >
              {label}
            </span>
          )}
          <div className="sk-checkbox-group-items">{children}</div>
        </div>
      </CheckboxGroupContext.Provider>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';

export default Checkbox;
