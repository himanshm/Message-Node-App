import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

interface ButtonProps {
  link?: string;
  design?: string;
  mode?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children?: ReactNode;
}

const Button = ({
  link,
  design,
  mode,
  onClick,
  disabled,
  loading,
  type = 'button',
  children,
}: ButtonProps) =>
  !link ? (
    <button
      className={['button', `button--${design}`, `button--${mode}`].join(' ')}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? 'Loading...' : children}
    </button>
  ) : (
    <Link
      className={['button', `button--${design}`, `button--${mode}`].join(' ')}
      to={link}
    >
      {children}
    </Link>
  );

export default Button;
