"use client";
import React from 'react';
import { KnowCourseFromBlogButton } from './KnowCourseFromBlogButton';
import styles from './page.module.css';

export function BioBlog() {
  return (
    <section className={styles.bioSection}>
      <img
        src="/foto_pessoal_pequena-768x765.jpg"
        alt="Imagem da Seção 1"
        width={160}
        className={styles['bio-image']}
      />
      <div className={styles.bioText}>
        <h2>Sobre o Prof. Nicholas Yukio</h2>
        <p>Sou engenheiro eletrônico formado no ITA em 2017. </p>
        <p>Comecei a vida profissional como professor da disciplina de circuitos elétricos no ITA, onde trabalhei de 2018 até março de 2020.</p>
        <p>Em 2019, levei meu ensino de circuitos elétricos para a internet, com minhas aulas públicas no Canal do Elétron.</p>
        <p>No início de 2020, criei meu curso online de circuitos elétricos, o Domínio Elétrico, focado em alunos de engenharia.</p>
        <p>De lá para cá, já são cerca de 500 alunos do curso que aprendem comigo e que podem tirar dúvidas individualmente comigo.</p>
        <p>Muitos são alunos de diversas faculdades, públicas e privadas, mas há também alunos de cursos técnicos e profissionais já formados que querem revisar seus conhecimentos.</p>
        <p>A minha missão aqui é: ensinar da melhor forma possível quem quer estudar sério circuitos elétricos.</p>
        <KnowCourseFromBlogButton />
      </div>
    </section>
  );
}
