'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, ArrowRight } from 'lucide-react';
import './rodape.css';

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="rodape-container">
        {/* Logo and About Section */}
        <div className="rodape-section">
          <Image
            src="/dominio_eletrico_logo_2023_square_fundo_transparente.png"
            alt="Domínio Elétrico Logo"
            width={120}
            height={120}
            className="rodape-logo"
          />
          <p className="rodape-description">
            Domínio Elétrico é um site dedicado ao ensino de circuitos elétricos, com foco em alunos de engenharia.
          </p>
          <div className="rodape-contact">
            <p>
              <MapPin className="rodape-icon" /> De São Paulo/SP, para o mundo inteiro
            </p>
            <p>
              <Mail className="rodape-icon" /> contato@dominioeletrico.com.br
            </p>
          </div>
        </div>

        {/* Useful Links Columns */}
        <div className="rodape-links">
          <div className="rodape-links-column">
            <h4 className="rodape-links-title">Explorar</h4>
            <ul>
              <li>
                <ArrowRight className="rodape-arrow" /> <Link href="/">Início</Link>
              </li>
              <li>
                <ArrowRight className="rodape-arrow" /> <Link href="/conteudo">Conteúdo</Link>
              </li>
              <li>
                <ArrowRight className="rodape-arrow" /> <Link href="/sobre">Sobre nós</Link>
              </li>
            </ul>
          </div>

          <div className="rodape-links-column">
            <h4 className="rodape-links-title">Ajuda</h4>
            <ul>
              <li>
                <ArrowRight className="rodape-arrow" /> <Link href="/duvidas">Perguntas frequentes</Link>
              </li>
              <li>
                <ArrowRight className="rodape-arrow" /> <Link href="/termosdeuso">Termos de uso</Link>
              </li>
              <li>
                <ArrowRight className="rodape-arrow" /> <Link href="/politicadeprivacidade">Política de privacidade</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="rodape-bottom">
        <p className="rodape-copy">
          © {new Date().getFullYear()} Domínio Elétrico. Todos os direitos reservados.
        </p>
        <p className="rodape-cnpj">CNPJ: 44.282.205/0001-82 (N.Y. TECH CURSOS)</p>
      </div>
    </footer>
  );
}
