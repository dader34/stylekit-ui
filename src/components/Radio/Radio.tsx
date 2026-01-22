import React, {
  forwardRef,
  createContext,
  useContext,
  useId,
  InputHTMLAttributes,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import './Radio.css';

// ============================================================================
// Types
// ============================================================================

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioColor = 'primary' | 'success' | 'warning' | 'error';
export type RadioGroupOrientation = 'horizontal' | 'vertical';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * The size of the radio button
   * @default 'md'
   */
  size?: RadioSize;

  /**
   * The color scheme of the radio button
   * @default 'primary'
   */
  color?: RadioColor;

  /**
   * Label text displayed next to the radio button
   */
  label?: ReactNode;

  /**
   * Whether the radio button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional description text below the label
   */
  description?: ReactNode;
}

export interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  size?: RadioSize;
  color?: RadioColor;
  disabled?: boolean;
  orientation: RadioGroupOrientation;
}

export interface RadioGroupProps {
  /**
   * The name for all radio inputs in the group
   */
  name?: string;

  /**
   * The controlled value of the radio group
   */
  value?: string;

  /**
   * The default value for uncontrolled usage
   */
  defaultValue?: string;

  /**
   * Callback when the selected value changes
   */
  onChange?: (value: string) => void;

  /**
   * The size applied to all radio buttons in the group
   * @default 'md'
   */
  size?: RadioSize;

  /**
   * The color applied to all radio buttons in the group
   * @default 'primary'
   */
  color?: RadioColor;

  /**
   * Whether all radio buttons in the group are disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * The orientation of the radio group
   * @default 'vertical'
   */
  orientation?: RadioGroupOrientation;

  /**
   * Label for the radio group
   */
  label?: ReactNode;

  /**
   * The radio buttons to render
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}

// ============================================================================
// Context
// ============================================================================

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(
  undefined
);

function useRadioGroupContext(): RadioGroupContextValue | undefined {
  return useContext(RadioGroupContext);
}

// ============================================================================
// Radio Component
// ============================================================================

/**
 * Radio button component with custom styling, multiple sizes and colors,
 * and support for labels. Works seamlessly with RadioGroup for managing
 * radio button groups.
 *
 * @example
 * ```tsx
 * // Standalone usage
 * <Radio label="Option A" name="choice" value="a" />
 *
 * // With RadioGroup
 * <RadioGroup value={selected} onChange={setSelected}>
 *   <Radio value="option1" label="Option 1" />
 *   <Radio value="option2" label="Option 2" />
 * </RadioGroup>
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      size: sizeProp,
      color: colorProp,
      label,
      disabled: disabledProp,
      description,
      className = '',
      id: idProp,
      name: nameProp,
      value,
      checked: checkedProp,
      onChange: onChangeProp,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const groupContext = useRadioGroupContext();

    // Merge props with group context
    const size = sizeProp ?? groupContext?.size ?? 'md';
    const color = colorProp ?? groupContext?.color ?? 'primary';
    const disabled = disabledProp ?? groupContext?.disabled ?? false;
    const name = nameProp ?? groupContext?.name;
    const id = idProp ?? generatedId;

    // Handle checked state - either controlled directly or via group
    const isChecked = groupContext
      ? groupContext.value === value
      : checkedProp;

    // Handle change
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (groupContext && value !== undefined) {
          groupContext.onChange(value as string);
        }

        onChangeProp?.(event);
      },
      [disabled, groupContext, value, onChangeProp]
    );

    const classNames = [
      'sk-radio',
      `sk-radio--${size}`,
      `sk-radio--${color}`,
      disabled && 'sk-radio--disabled',
      isChecked && 'sk-radio--checked',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const labelId = label ? `${id}-label` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;

    return (
      <label
        className={classNames}
        htmlFor={id}
        aria-disabled={disabled}
      >
        <span className="sk-radio__input-wrapper">
          <input
            ref={ref}
            type="radio"
            id={id}
            name={name}
            value={value}
            checked={isChecked}
            disabled={disabled}
            onChange={handleChange}
            className="sk-radio__input"
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            {...props}
          />
          <span className="sk-radio__control" aria-hidden="true">
            <span className="sk-radio__indicator" />
          </span>
        </span>

        {(label || description) && (
          <span className="sk-radio__label-wrapper">
            {label && (
              <span id={labelId} className="sk-radio__label">
                {label}
              </span>
            )}
            {description && (
              <span id={descriptionId} className="sk-radio__description">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    );
  }
);

Radio.displayName = 'Radio';

// ============================================================================
// RadioGroup Component
// ============================================================================

/**
 * RadioGroup component for managing a group of radio buttons.
 * Provides context for shared name, value, and change handling.
 *
 * @example
 * ```tsx
 * const [value, setValue] = useState('option1');
 *
 * <RadioGroup
 *   value={value}
 *   onChange={setValue}
 *   label="Choose an option"
 *   orientation="vertical"
 * >
 *   <Radio value="option1" label="Option 1" />
 *   <Radio value="option2" label="Option 2" />
 *   <Radio value="option3" label="Option 3" />
 * </RadioGroup>
 * ```
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name: nameProp,
      value: valueProp,
      defaultValue,
      onChange,
      size = 'md',
      color = 'primary',
      disabled = false,
      orientation = 'vertical',
      label,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const name = nameProp ?? `radio-group-${generatedId}`;

    // Support both controlled and uncontrolled usage
    const [internalValue, setInternalValue] = React.useState<string | undefined>(
      defaultValue
    );
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;

    const handleChange = useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      },
      [isControlled, onChange]
    );

    const contextValue = useMemo<RadioGroupContextValue>(
      () => ({
        name,
        value,
        onChange: handleChange,
        size,
        color,
        disabled,
        orientation,
      }),
      [name, value, handleChange, size, color, disabled, orientation]
    );

    const classNames = [
      'sk-radio-group',
      `sk-radio-group--${orientation}`,
      disabled && 'sk-radio-group--disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="radiogroup"
          aria-label={typeof label === 'string' ? label : undefined}
          aria-disabled={disabled}
          className={classNames}
          {...props}
        >
          {label && (
            <span className="sk-radio-group__label">{label}</span>
          )}
          <div className="sk-radio-group__items">{children}</div>
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

// ============================================================================
// Exports
// ============================================================================

export default Radio;
