import { useState, FormEvent } from 'react';

import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';

interface FormField {
  value: string;
  valid: boolean;
  touched: boolean;
  validators: ((value: string) => boolean)[];
}

export interface LoginForm {
  email: FormField;
  password: FormField;
}

type LoginPageProps = {
  onLogin: (
    event: FormEvent,
    authData: { email: string; password: string }
  ) => void;
  loading: boolean;
};

const LoginPage = ({ onLogin, loading }: LoginPageProps) => {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: {
      value: '',
      valid: false,
      touched: false,
      validators: [required, email],
    },
    password: {
      value: '',
      valid: false,
      touched: false,
      validators: [required, length({ min: 5 })],
    },
  });

  const checkFormIsValid = () =>
    Object.values(loginForm).every((field) => field.valid);

  const inputChangeHandler = (inputId: keyof LoginForm, value: string) => {
    let isValid = true;
    for (const validator of loginForm[inputId].validators) {
      isValid = isValid && validator(value);
    }

    const updatedForm = {
      ...loginForm,
      [inputId]: {
        ...loginForm[inputId],
        valid: isValid,
        value: value,
        touched: loginForm[inputId].touched,
      },
    };
    setLoginForm(updatedForm);
  };

  const inputBlurHandler = (inputId: keyof LoginForm) => {
    setLoginForm((prevState) => ({
      ...prevState,
      [inputId]: { ...prevState[inputId], touched: true },
    }));
  };
  return (
    <Auth>
      <form
        onSubmit={(e) =>
          onLogin(e, {
            email: loginForm.email.value,
            password: loginForm.password.value,
          })
        }
      >
        <Input
          id='email'
          label='Your E-Mail'
          type='email'
          control='input'
          onChange={(e) => inputChangeHandler('email', e.currentTarget.value)}
          onBlur={() => inputBlurHandler('email')}
          value={loginForm.email.value}
          valid={loginForm.email.valid}
          touched={loginForm.email.touched}
        />
        <Input
          id='password'
          label='Password'
          type='password'
          control='input'
          onChange={(e) =>
            inputChangeHandler('password', e.currentTarget.value)
          }
          onBlur={() => inputBlurHandler('password')}
          value={loginForm.password.value}
          valid={loginForm.password.valid}
          touched={loginForm.password.touched}
        />
        <Button
          design='raised'
          type='submit'
          loading={loading}
          disabled={!checkFormIsValid()}
        >
          Login
        </Button>
      </form>
    </Auth>
  );
};

export default LoginPage;
