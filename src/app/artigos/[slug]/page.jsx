// app/posts/[slug]/page.jsx
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import styles from './page.module.css';
import Header from '../../header';
import Rodape from '../../rodape';
import Link from 'next/link';
import Head from 'next/head';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_BASE_ENDPOINT;

async function getPost(slug) {
  const res = await fetch(`${API_BASE}/get-post-by-id/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function PostPage({ params }) {
  const resolvedParams = typeof params.then === 'function' ? await params : params;
  const { slug } = resolvedParams;
  const post = await getPost(slug);
  console.log(post);
  if (!post) return notFound();

  // Mocked metadata until backend provides real info
  const mockMeta = {
    author: 'Prof. Nicholas Yukio',
    date: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    category: 'Circuitos Elétricos'
  };

  const rawHtml = await marked.parse(typeof post.content === 'string' ? post.content : '');
  const html = DOMPurify.sanitize(rawHtml);

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Header />
      <div className={styles.postContainer}>
        <main className={styles.postMain}>
          <h1 className={styles.postTitle}>{post.title}</h1>

          <div className={styles.postMeta}>
            <span className={styles.metaAuthor}>{post.author}</span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaDate}>
              {new Date(post.created_at).toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaCategory}>{post.category}</span>
          </div>

          <img src={`https://dominio-eletrico-static-site.s3.sa-east-1.amazonaws.com/images/${post.thumbnail}`} alt={post.title}/>

          <article className={styles.postContent} dangerouslySetInnerHTML={{ __html: html }} />

          <hr className={styles.postSeparator} />

          <hr className={styles.postSeparator} />
          <p className={styles.postFooterText}>
            Se você gostou deste artigo, explore mais o{' '}
            <a href="https://dominioeletrico.com.br" className={styles.footerLink}>
              site Domínio Elétrico
            </a>, onde você pode acessar o curso principal Domínio Elétrico, além de vários outros conteúdos em vídeo de circuitos elétricos produzidos pelo Prof. Nicholas Yukio.
          </p>
        </main>
      </div>
      <Rodape />
    </>
  );
}

export const dynamic = 'force-static';
