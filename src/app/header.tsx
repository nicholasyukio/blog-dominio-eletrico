"use client";
import React, { useState } from 'react';
import './header.css';

export interface HeaderProps {
  isMobile: boolean;
}

export function Header() {
  const [menuOpen0, setMenuOpen0] = useState(false);
  const [menuOpen1, setMenuOpen1] = useState(false);
  const [menuOpen2, setMenuOpen2] = useState(false);
  const [menuOpen3, setMenuOpen3] = useState(false);
  const [menuOpen4, setMenuOpen4] = useState(false);

  const toggleMenu0 = () => setMenuOpen0((open) => !open);

return (
    <header className="header">
    {/* Logo quadrado */}
    <div className="logo-container">
        <a href="/" title="Domínio Elétrico" className="logo-link">
        <img
            src="/dominio_eletrico_logo_2023_square_fundo_transparente.png"
            alt="Logo do Domínio Elétrico"
            className="logo"
        />
        </a>
    </div>
    <div className="header-title">
        <h1>Blog do Domínio Elétrico</h1>
    </div>
    <nav className="nav">
        <button onClick={toggleMenu0} className="menu-button">
        Menu ▼
        </button>
        {menuOpen0 && (
        <ul className="dropdown">
            <li className="menu-title"><b>Sobre</b></li>
            <li><a href="/" className="link">Página inicial do blog</a></li>
            <li><a href="https://dominioeletrico.com.br" className="link">Site Domínio Elétrico</a></li>
        </ul>
        )}
    </nav>
    </header>
);
}
