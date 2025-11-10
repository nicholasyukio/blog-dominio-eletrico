'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../services/AuthContext.js';
import {
  X, ChevronDown, ChevronRight, ChevronUp, Home, Info, BookOpen, Cpu,
  Users, FileCheck, Lightbulb, Hammer, LayoutDashboard, Library,
  MessageSquare, MessageCircle, Zap, LogIn, UserPlus, LogOut, ArrowUpCircle,
  MessageCircleQuestion, GraduationCap
} from 'lucide-react';
import './header.css';

// ✅ NEXT: environment variable must start with NEXT_PUBLIC
const baseAPI_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_ENDPOINT;

function getNomeCurto(user) {
  const nomeCompleto = user?.attributes?.name || user?.getUsername?.() || 'Usuário';
  const primeiroNome = nomeCompleto.split(' ')[0];
  return primeiroNome.length > 12 ? primeiroNome.slice(0, 12) + '…' : primeiroNome;
}

const publicLinks = [
  { label: 'Início', href: 'https://dominioeletrico.com.br/', icon: <Home size={18} /> },
  { label: 'Sobre', href: 'https://dominioeletrico.com.br/sobre', icon: <Info size={18} /> },
  { label: 'Conteúdo', href: 'https://dominioeletrico.com.br/conteudo', icon: <BookOpen size={18} /> },
  { label: 'FAQ', href: 'https://dominioeletrico.com.br/duvidas', icon: <MessageCircleQuestion size={18} /> },
  { label: 'Alunos Antigos', href: 'https://dominioeletrico.com.br/antigos', icon: <GraduationCap size={18} /> },
];

const courses = [
  { label: 'Domínio Elétrico (conteúdo principal)', href: 'https://dominioeletrico.com.br/public-course-page/curso-dominio-eletrico', icon: <BookOpen size={18} /> },
  { label: 'Domínio Elétrico Labs', href: 'https://dominioeletrico.com.br/public-course-page/dominio-eletrico-labs', icon: <BookOpen size={18} /> },
  { label: 'Matemática do Elétron', href: 'https://dominioeletrico.com.br/public-course-page/matematica-do-eletron', icon: <BookOpen size={18} /> },
];

const loggedLinks = [
  { label: 'Dashboard', href: 'https://dominioeletrico.com.br/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Cursos', href: 'https://dominioeletrico.com.br/allcourses', icon: <Library size={18} /> },
  { label: 'Fórum', href: 'https://dominioeletrico.com.br/forum', icon: <MessageSquare size={18} /> },
  { label: 'Chats', href: 'https://dominioeletrico.com.br/chats', icon: <MessageCircle size={18} /> },
];

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [loggedOpen, setLoggedOpen] = useState(false);
  const [accountType, setAccountType] = useState('unknown');
  //const { user } = useAuth();
  const user = null;
  const loggedRef = useRef(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleCourses = () => setCoursesOpen((prev) => !prev);
  const toggleLogged = () => setLoggedOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchAccountType() {
      if (!user) return;
      try {
        const res = await fetch(`${baseAPI_URL}/get-user-data/${user.cognitoUser.username}`);
        const data = await res.json();
        setAccountType(data.account_type);
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    }
    fetchAccountType();
  }, [user]);

  // Close logged dropdown when clicking outside (desktop)
  useEffect(() => {
    function handleClickOutside(event) {
      if (loggedRef.current && !loggedRef.current.contains(event.target)) {
        setLoggedOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pin header to top when mobile menu open
  useEffect(() => {
    const header = document.querySelector('.header');
    if (header) {
      if (menuOpen) header.classList.add('fixed-top');
      else header.classList.remove('fixed-top');
    }
  }, [menuOpen]);

  let authLinks;
  if (user && accountType === 'free') {
    authLinks = [
      { label: `${getNomeCurto(user)} (sair)`, href: 'https://dominioeletrico.com.br/logon', type: 'logout', icon: <LogOut size={18} /> },
      { label: 'Upgrade', href: 'https://dominioeletrico.com.br/upgrade', type: 'upgrade', icon: <ArrowUpCircle size={18} /> },
    ];
  } else if (user) {
    authLinks = [{ label: `${getNomeCurto(user)} (sair)`, href: '/logon', type: 'logout', icon: <LogOut size={18} /> }];
  } else {
    authLinks = [
      { label: 'Login', href: 'https://dominioeletrico.com.br/logon', type: 'login', icon: <LogIn size={18} /> },
      { label: 'Criar conta', href: 'https://dominioeletrico.com.br/signup', type: 'signup', icon: <UserPlus size={18} /> },
    ];
  }

  // ✅ MOBILE VERSION
  if (isMobile) {
    return (
      <header className="header">
        <div className="logo-container">
          <Link href="https://dominioeletrico.com.br/" title="Domínio Elétrico" className="logo-link">
            <img src="/dominio_eletrico_logo_2023_square_fundo_transparente.png" alt="Logo do Domínio Elétrico" className="logo" />
          </Link>
        </div>

        <nav className="nav">
          <button onClick={toggleMenu} className="menu-button" aria-expanded={menuOpen}>
            <span className="menu-label">
              Menu {menuOpen ? <X size={22} /> : <ChevronDown size={22} />}
            </span>
          </button>

          {menuOpen && (
            <ul className="dropdown" role="menu">
              <div className="mobile-auth-buttons">
                {authLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={`auth-button mobile-auth-button ${link.type}`}>
                    {link.icon} {link.label}
                  </Link>
                ))}
              </div>

              {publicLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link" role="menuitem">
                    {link.icon} {link.label}
                  </Link>
                </li>
              ))}

              {/* Cursos dropdown */}
              <li className="menu-title-collapsible">
                <div className="menu-title-row">
                  <Link href="https://dominioeletrico.com.br/allcourses" className="link">Cursos</Link>
                  <button onClick={toggleCourses} className="collapse-toggle" aria-expanded={coursesOpen}>
                    {coursesOpen ? <ChevronUp size={18} /> : <ChevronRight size={18} />}
                  </button>
                </div>

                {coursesOpen && (
                  <ul className="submenu">
                    {courses.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="link internal-link">
                          {link.icon} {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              {/* Área logada dropdown */}
              <li className="menu-title-collapsible">
                <div className="menu-title-row">
                  <Link href="https://dominioeletrico.com.br/dashboard" className="link">Área logada</Link>
                  <button onClick={toggleLogged} className="collapse-toggle" aria-expanded={loggedOpen}>
                    {loggedOpen ? <ChevronUp size={18} /> : <ChevronRight size={18} />}
                  </button>
                </div>

                {loggedOpen && (
                  <ul className="submenu">
                    {loggedLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="link internal-link">
                          {link.icon} {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          )}
        </nav>
      </header>
    );
  }

  // ✅ DESKTOP VERSION
  return (
    <header className="header header-desktop">
      <div className="logo-container">
        <Link href="https://dominioeletrico.com.br/" title="Domínio Elétrico" className="logo-link">
          <img src="/dominio_eletrico_logo_2023_square_fundo_transparente.png" alt="Logo do Domínio Elétrico" className="logo" />
        </Link>
      </div>

      <nav className="nav public-nav">
        {publicLinks.map((link) => (
          <Link key={link.href} href={link.href} className="menu-button-desktop">
            {link.icon} {link.label}
          </Link>
        ))}
      </nav>

      <nav className="nav internal-nav" ref={loggedRef}>
        {/* Cursos dropdown */}
        <div className={`dropdown-container ${coursesOpen ? 'open' : ''}`}>
          <button type="button" className="menu-button-desktop internal-link dropdown-toggle-btn" onClick={toggleCourses} aria-expanded={coursesOpen}>
            Cursos <ChevronDown size={16} />
          </button>
          <div className={`dropdown-menu ${coursesOpen ? 'visible' : ''}`} role="menu">
            {courses.map((link) => (
              <Link key={link.href} href={link.href} className="dropdown-item" role="menuitem">
                {link.icon} {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Área logada dropdown */}
        <div className={`dropdown-container ${loggedOpen ? 'open' : ''}`}>
          <button type="button" className="menu-button-desktop internal-link dropdown-toggle-btn" onClick={toggleLogged} aria-expanded={loggedOpen}>
            Área logada <ChevronDown size={16} />
          </button>
          <div className={`dropdown-menu ${loggedOpen ? 'visible' : ''}`} role="menu">
            {loggedLinks.map((link) => (
              <Link key={link.href} href={link.href} className="dropdown-item" role="menuitem">
                {link.icon} {link.label}
              </Link>
            ))}
          </div>
        </div>

        {authLinks.map((link) => (
          <Link key={link.href} href={link.href} className={`menu-button-desktop auth-button ${link.type}`}>
            {link.icon} {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
