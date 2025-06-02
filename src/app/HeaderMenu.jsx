"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export function HeaderMenu() {
  const [menuOpen0, setMenuOpen0] = useState(false);
  const toggleMenu0 = () => setMenuOpen0((open) => !open);
  return (
    <nav className="nav">
      <button onClick={toggleMenu0} className="menu-button">
        Menu ▼
      </button>
      {menuOpen0 && (
        <ul className="dropdown">
          <li className="menu-title"><b>Sobre</b></li>
          <li><Link href="/" className="link">Página inicial do blog</Link></li>
          <li><a href="https://dominioeletrico.com.br" className="link">Site Domínio Elétrico</a></li>
        </ul>
      )}
    </nav>
  );
}
