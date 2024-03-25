import NavigationItems from '../NavigationItems/NavigationItems';
import './MobileNavigation.css';

interface MobileNavigationProps {
  open: boolean;
  mobile?: boolean;
  onChooseItem: () => void;
  isAuth: boolean;
  onLogout: () => void;
}

const MobileNavigation = ({
  open,
  mobile,
  onChooseItem,
  isAuth,
  onLogout,
}: MobileNavigationProps) => (
  <nav className={['mobile-nav', open ? 'open' : ''].join(' ')}>
    <ul className={['mobile-nav__items', mobile ? 'mobile' : ''].join(' ')}>
      <NavigationItems
        mobile
        onChoose={onChooseItem}
        isAuth={isAuth}
        onLogout={onLogout}
      />
    </ul>
  </nav>
);

export default MobileNavigation;
