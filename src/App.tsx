import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import FeedPage from './pages/Feed/Feed';
import SinglePostPage from './pages/Feed/SinglePost/SinglePost';
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';
import { useAuth } from './hooks/useAuth';
import { AuthData } from './hooks/useAuth';
import { SignupForm } from './hooks/useAuth';

import './App.css';
import { FormEvent } from 'react';
import MainLayoutPage from './pages/MainLayout';
const URL: string = 'http://localhost';

const App: React.FC = () => {
  const { isAuth, login, authLoading, signup } = useAuth();
  const loginHandler = (e: FormEvent, authData: AuthData) => {
    e.preventDefault();
    login(authData, URL);
  };

  const signupHandler = (e: FormEvent, formData: SignupForm) => {
    e.preventDefault();
    signup(URL, formData);
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          {!isAuth ? (
            <>
              <Route element={<MainLayoutPage />}>
                <Route
                  index
                  element={
                    <LoginPage onLogin={loginHandler} loading={authLoading} />
                  }
                />
                <Route
                  path='/signup'
                  element={
                    <SignupPage
                      onSignup={signupHandler}
                      loading={authLoading}
                    />
                  }
                />
                <Route path='*' element={<Navigate to='/' replace />} />
              </Route>
            </>
          ) : (
            <>
              <Route element={<MainLayoutPage />}>
                <Route path='/' element={<FeedPage />} />
                <Route path='/:postId' element={<SinglePostPage />} />
                <Route path='*' element={<Navigate to='/' replace />} />
              </Route>
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
