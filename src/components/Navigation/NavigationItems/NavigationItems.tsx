import { NavLink } from 'react-router-dom';
import './NavigationItems.css';

interface NavItem {
  id: string;
  text: string;
  link: string;
  auth: boolean;
}

const navItems: NavItem[] = [
  { id: 'feed', text: 'Feed', link: '/', auth: true },
  { id: 'login', text: 'Login', link: '/', auth: false },
  { id: 'signup', text: 'Signup', link: '/signup', auth: false },
];

interface NavigationItemsProps {
  isAuth: boolean;
  mobile?: boolean;
  onChoose?: () => void;
  onLogout?: () => void;
}

const NavigationItems = ({
  isAuth,
  mobile,
  onChoose,
  onLogout,
}: NavigationItemsProps) => (
  <ul>
    {navItems
      .filter((item) => item.auth === isAuth)
      .map((item) => (
        <li
          key={item.id}
          className={['navigation-item', mobile ? 'mobile' : ''].join(' ')}
        >
          <NavLink to={item.link} onClick={onChoose}>
            {item.text}
          </NavLink>
        </li>
      ))}
    {isAuth && (
      <li className='navigation-item' key='logout'>
        <button onClick={onLogout}>Logout</button>
      </li>
    )}
  </ul>
);

export default NavigationItems;
