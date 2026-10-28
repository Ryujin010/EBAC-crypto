import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import useWatchlist from '../hooks/useWatchlist';
import './Navbar.scss';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useWatchlist();
  const closeMenu = () => setOpen(false);

  // Con el menú abierto, la tecla Escape lo cierra
  
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const links = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/coins', label: 'Coins' },
    { to: '/watchlist', label: `Watchlist ★ (${count})` },
  ];

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          🪙 Crypto Tracker
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? '✕' : '☰'}
        </button>

        <nav
          id="main-nav"
          className={`navbar__links ${open ? 'is-open' : ''}`}
        >
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={closeMenu}>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;