import { ComponentPropsWithoutRef } from 'react';
import './Input.css';

// Create a type that includes both input and textarea props, without omitting onChange
type InputProps = {
  label?: string;
  valid?: boolean;
  touched?: boolean;
  control: 'input' | 'textarea';
} & ComponentPropsWithoutRef<'input'> &
  ComponentPropsWithoutRef<'textarea'>;

const Input = ({
  label,
  valid,
  touched,
  control,
  ...rest // Capture all other props
}: InputProps) => (
  <div className='input'>
    {label && <label htmlFor={rest.id}>{label}</label>}
    {control === 'input' && (
      <input
        {...rest}
        className={[
          !valid ? 'invalid' : 'valid',
          touched ? 'touched' : 'untouched',
        ].join(' ')}
      />
    )}
    {control === 'textarea' && (
      <textarea
        {...rest}
        className={[
          !valid ? 'invalid' : 'valid',
          touched ? 'touched' : 'untouched',
        ].join(' ')}
        rows={rest.rows || 3}
      />
    )}
  </div>
);

export default Input;
