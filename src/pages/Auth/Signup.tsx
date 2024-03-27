import { useState, FormEvent } from 'react';

import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';

interface FormField {
  value: string;
  valid: boolean;
  touched: boolean;
  validators: ((value: string) => boolean)[];
}

export interface SignupForm {
  email: FormField;
  password: FormField;
  name: FormField;
}

type SignupProps = {
  onSignup: (event: FormEvent, formData: SignupForm) => void;
  loading: boolean;
  error: Error | null;
  onClearError: () => void;
};

const SignupPage = ({
  onSignup,
  loading,
  error,
  onClearError,
}: SignupProps) => {
  const [signupForm, setSignupForm] = useState<SignupForm>({
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
    name: {
      value: '',
      valid: false,
      touched: false,
      validators: [required],
    },
  });

  const checkFormIsValid = () =>
    Object.values(signupForm).every((field) => field.valid);

  const inputChangeHandler = (inputId: keyof SignupForm, value: string) => {
    let isValid = true;
    for (const validator of signupForm[inputId].validators) {
      isValid = isValid && validator(value);
    }

    const updatedForm = {
      ...signupForm,
      [inputId]: {
        ...signupForm[inputId],
        valid: isValid,
        value: value,
      },
    };
    setSignupForm(updatedForm);
  };

  const inputBlurHandler = (inputId: keyof SignupForm) => {
    setSignupForm((prevState) => ({
      ...prevState,
      [inputId]: { ...prevState[inputId], touched: true },
    }));
  };

  return (
    <>
      {error && <ErrorHandler error={error} onHandle={onClearError} />}
      <Auth>
        <form onSubmit={(e) => onSignup(e, signupForm)}>
          <Input
            id='email'
            label='Your E-Mail'
            type='email'
            control='input'
            onChange={(e) => inputChangeHandler('email', e.target.value)}
            onBlur={() => inputBlurHandler('email')}
            value={signupForm.email.value}
            valid={signupForm.email.valid}
            touched={signupForm.email.touched}
          />
          <Input
            id='name'
            label='Your Name'
            type='text'
            control='input'
            onChange={(e) => inputChangeHandler('name', e.target.value)}
            onBlur={() => inputBlurHandler('name')}
            value={signupForm.name.value}
            valid={signupForm.name.valid}
            touched={signupForm.name.touched}
          />
          <Input
            id='password'
            label='Password'
            type='password'
            control='input'
            onChange={(e) => inputChangeHandler('password', e.target.value)}
            onBlur={() => inputBlurHandler('password')}
            value={signupForm.password.value}
            valid={signupForm.password.valid}
            touched={signupForm.password.touched}
          />
          <Button
            design='raised'
            type='submit'
            loading={loading}
            disabled={!checkFormIsValid()}
          >
            Signup
          </Button>
        </form>
      </Auth>
    </>
  );
};

export default SignupPage;
