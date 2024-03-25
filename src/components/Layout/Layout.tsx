import { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  header: ReactNode;
  mobileNav: ReactNode;
  children: ReactNode;
}

const Layout = ({ header, mobileNav, children }: LayoutProps) => (
  <>
    <header className='main-header'>{header}</header>
    {mobileNav}
    <main className='content'>{children}</main>
  </>
);

export default Layout;
