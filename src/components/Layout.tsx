import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__content">
          <NavLink to="/products" className="app-logo">
            Product SPA
          </NavLink>
          <nav className="app-nav">
            <NavLink to="/products" className={({ isActive }) => (isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link')}>
              Продукты
            </NavLink>
            <NavLink to="/create-product" className={({ isActive }) => (isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link')}>
              Создать продукт
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};

export default Layout;
