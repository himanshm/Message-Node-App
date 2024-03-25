import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Backdrop from '../components/Backdrop/Backdrop';
import ErrorHandler from '../components/ErrorHandler/ErrorHandler';
import MainNavigation from '../components/Navigation/MainNavigation/MainNavigation';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import Toolbar from '../components/Toolbar/Toolbar';
import { useAuth } from '../hooks/useAuth';
import './MainLayout.css';

function MainLayoutPage() {
  const { isAuth, logout, error, handleError } = useAuth();

  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  //   const [isAuth, setIsAuth] = useState(true);
  //   const [error, setError] = useState<Error | null>(null);

  const mobileNavHandler = (isOpen: boolean) => {
    setShowMobileNav(isOpen);
    setShowBackdrop(isOpen);
  };

  const backdropClickHandler = () => {
    setShowBackdrop(false);
    setShowMobileNav(false);
    handleError();
  };

  const logoutHandler = () => {
    logout();
  };

  const errorHandler = () => {
    handleError();
  };

  return (
    <>
      {showBackdrop && (
        <Backdrop onClick={backdropClickHandler} open={showBackdrop} />
      )}
      <ErrorHandler error={error} onHandle={errorHandler} />

      <header className='main-header'>
        <Toolbar>
          <MainNavigation
            onOpenMobileNav={() => mobileNavHandler(true)}
            onLogout={logoutHandler}
            isAuth={isAuth}
          />
        </Toolbar>
        <MobileNavigation
          open={showMobileNav}
          onChooseItem={() => mobileNavHandler(false)}
          onLogout={logoutHandler}
          isAuth={isAuth}
        />
      </header>
      <main className='content'>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayoutPage;
