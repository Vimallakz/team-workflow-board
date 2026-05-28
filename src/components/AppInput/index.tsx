import clsx from 'clsx';
import type { FC } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

const baseClassName =
  'w-full rounded-lg border bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

const inputSizeClassName = 'h-8';
const textareaSizeClassName = 'min-h-[96px] py-2 resize-y';

type CommonProps = {
  placeholder?: string;
  className?: string;
  error?: string;
  label?: string;
  multiline?: boolean;
};

export type AppInputControlledProps = CommonProps & {
  value: string;
  onChange: (value: string) => void;
};

export type AppInputRegisterProps = CommonProps &
  Pick<UseFormRegisterReturn, 'name' | 'onChange' | 'onBlur' | 'ref'>;

export type AppInputProps = AppInputControlledProps | AppInputRegisterProps;

const isControlled = (props: AppInputProps): props is AppInputControlledProps =>
  'value' in props;

export const AppInput: FC<AppInputProps> = (props) => {
  const {
    placeholder = '',
    className = '',
    error,
    label,
    multiline = false,
  } = props;

  const borderClassName = error
    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
    : 'border-slate-300';

  const sharedClassName = clsx(
    baseClassName,
    borderClassName,
    multiline ? textareaSizeClassName : inputSizeClassName,
    className,
  );

  const field = isControlled(props) ? (
    multiline ? (
      <textarea
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={placeholder}
        className={sharedClassName}
      />
    ) : (
      <input
        type="text"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={placeholder}
        className={sharedClassName}
      />
    )
  ) : multiline ? (
    <textarea
      {...(props as AppInputRegisterProps)}
      placeholder={placeholder}
      className={sharedClassName}
    />
  ) : (
    <input
      type="text"
      {...(props as AppInputRegisterProps)}
      placeholder={placeholder}
      className={sharedClassName}
    />
  );

  return (
    <div className="flex w-full flex-col gap-1">
      {label ? (
        <label
          htmlFor={!isControlled(props) ? props.name : undefined}
          className="text-xs font-medium text-slate-600"
        >
          {label}
        </label>
      ) : null}
      {field}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
};
