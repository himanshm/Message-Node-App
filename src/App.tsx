import { FormEvent } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import FeedPage from './pages/Feed/Feed';
import SinglePostPage from './pages/Feed/SinglePost/SinglePost';
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';
import { useAuth } from './hooks/useAuth';
import { AuthData } from './hooks/useAuth';
import { SignupForm } from './hooks/useAuth';

import './App.css';
import MainLayoutPage from './pages/MainLayout';
const BASE_URL: string = 'http://localhost:8080/auth/';

const App: React.FC = () => {
  const navigate = useNavigate();
  const { isAuth, login, authLoading, signup } = useAuth();

  const loginHandler = (e: FormEvent, authData: AuthData) => {
    e.preventDefault();
    login(`${BASE_URL}login`, authData);
  };

  const signupHandler = async (e: FormEvent, authData: SignupForm) => {
    e.preventDefault();
    const success = await signup(`${BASE_URL}signup`, authData);
    if (success) {
      navigate('/login');
    }
  };
  return (
    <>
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
                  <SignupPage onSignup={signupHandler} loading={authLoading} />
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
    </>
  );
};

export default App;
