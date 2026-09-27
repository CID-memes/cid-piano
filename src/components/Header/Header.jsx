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
          <Music size={22} color="#ffffff" />
        </div>
        <div>
          <h1>SURPRISE PIANO</h1>
        </div>
      </div>

      <div className="header-actions">
        {onRotateScreen && (
          <button
            className="btn btn-icon btn-rotate-header"
            title="Rotate Screen to Landscape"
            onClick={onRotateScreen}
            id="btn-rotate"
          >
            <RotateCw size={16} />
            <span className="btn-label-mobile">Rotate</span>
          </button>
        )}

        <button
          className="btn btn-icon"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onClick={onToggleTheme}
          id="btn-theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {onToggleMobileMenu && (
          <button
            className="btn btn-primary btn-icon btn-mobile-menu"
            title="Open Controls & Settings Menu"
            onClick={onToggleMobileMenu}
            id="btn-mobile-menu"
          >
            <Menu size={18} />
            <span className="btn-mobile-menu-text">Menu</span>
          </button>
        )}
      </div>
    </header>
  );
}


