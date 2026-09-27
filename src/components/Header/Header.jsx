import React from 'react';
import { Music, Sun, Moon, RotateCw, Menu } from 'lucide-react';

export default function Header({
  theme, onToggleTheme,
  onRotateScreen,
  onToggleMobileMenu
}) {
  return (
    <header className="header glass-panel">
      <div className="brand-title">
        <div className="brand-logo">
          <Music size={18} color="#ffffff" />
        </div>
        <h1 className="brand-name">SURPRISE PIANO</h1>
      </div>

      <div className="header-actions">
        {onRotateScreen && (
          <button
            className="btn btn-icon btn-header-action btn-rotate-header"
            title="Rotate Screen to Landscape"
            onClick={onRotateScreen}
            id="btn-rotate"
            aria-label="Rotate Screen"
          >
            <RotateCw size={15} />
            <span className="btn-label-desktop">Rotate</span>
          </button>
        )}

        <button
          className="btn btn-icon btn-header-action"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onClick={onToggleTheme}
          id="btn-theme"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {onToggleMobileMenu && (
          <button
            className="btn btn-primary btn-header-action btn-mobile-menu"
            title="Open Controls & Settings Menu"
            onClick={onToggleMobileMenu}
            id="btn-mobile-menu"
            aria-label="Open Menu"
          >
            <Menu size={16} />
            <span className="btn-mobile-menu-text">Menu</span>
          </button>
        )}
      </div>
    </header>
  );
}
