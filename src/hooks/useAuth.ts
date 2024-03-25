import { useCallback, useEffect, useState } from 'react';

export interface AuthData {
  email: string;
  password: string;
  name?: string;
}

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

// Simplified version of fetch API calls for demonstration purposes
const fetchData = async (
  url: string,
  method: 'POST' | 'PUT',
  body: unknown
) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }
  return data;
};

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState<boolean>(
    !!localStorage.getItem('token')
  );
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = () => {
    setError(null);
  };

  const signup = async (url: string, formData: SignupForm) => {
    setAuthLoading(true);
    const authData = {
      email: formData.email.value,
      password: formData.password.value,
      name: formData.name.value,
    };

    try {
      const resData = await fetchData(url, 'POST', authData);
      console.log(resData);
    } catch (err) {
      setError(
        new Error(
          err instanceof Error ? err.message : 'An error occurred during signup'
        )
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (authData: AuthData, url: string) => {
    setAuthLoading(true);
    try {
      const resData = await fetchData(url, 'POST', authData);
      if (resData.token) {
        const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000);
        localStorage.setItem('token', resData.token);
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        localStorage.setItem('userId', resData.userId);
        setIsAuth(true);
        setAutoLogout(60 * 60 * 1000);
      }
    } catch (err) {
      setError(
        new Error(err instanceof Error ? err.message : 'An error occurred')
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
    setIsAuth(false);
  }, []);

  const setAutoLogout = useCallback(
    (milliseconds: number) => {
      setTimeout(() => {
        logout();
      }, milliseconds);
    },
    [logout]
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if (token && expiryDate) {
      const remainingMilliseconds =
        new Date(expiryDate).getTime() - new Date().getTime();
      if (remainingMilliseconds > 0) {
        setAutoLogout(remainingMilliseconds);
      } else {
        logout();
      }
    }
  }, [logout, setAutoLogout]);

  return { isAuth, login, logout, signup, authLoading, error, handleError };
};