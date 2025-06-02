"use client";
import React from 'react';
import './header.css';
import Link from 'next/link';
import Image from 'next/image';
import { HeaderMenu } from './HeaderMenu';

export function Header() {
  return (
    <header className="header">
      {/* Logo quadrado */}
      <div className="logo-container">
        <Link href="/" title="Domínio Elétrico" className="logo-link">
          <Image
            src="/dominio_eletrico_logo_2023_square_fundo_transparente.png"
            alt="Logo do Domínio Elétrico"
            className="logo"
            width={60}
            height={60}
            priority
          />
        </Link>
      </div>
      <div className="header-title">
        <h1>Blog do Domínio Elétrico</h1>
      </div>
      <HeaderMenu />
    </header>
  );
}
