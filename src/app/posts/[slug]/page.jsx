// app/posts/[slug]/page.jsx
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import styles from './page.module.css';
import Header from '../../header';
import Rodape from '../../rodape';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_BASE_ENDPOINT;

async function getPost(post_id) {
  const res = await fetch(`${API_BASE}/get-post-by-id/${post_id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function generateStaticParams() {
  const params = [];
  for (let i = 0; i < 100; i++) {
    const id = i.toString().padStart(5, '0');
    params.push({ slug: id });
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = await getPost(slug);
  return {
    title: post?.title ?? 'Post Not Found',
  };
}

export default async function PostPage({ params }) {
  const resolvedParams = typeof params.then === 'function' ? await params : params;
  const { slug } = resolvedParams;
  const post = await getPost(slug.slice(0, 5));
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

  // Recommended posts (mocked fetch)
  const recommendedPosts = [];
  const currentId = slug.substring(0, 5);
  const getRandomPostIds = (count, max = 100, excludeId) => {
    const ids = new Set();
    while (ids.size < count) {
      const n = Math.floor(Math.random() * max);
      const id = n.toString().padStart(5, '0');
      if (id !== excludeId) ids.add(id);
    }
    return Array.from(ids);
  };
  const recIds = getRandomPostIds(6, 100, currentId);
  await Promise.all(
    recIds.map(async (id) => {
      try {
        const res = await fetch(`${API_BASE}/get-post-by-id/${id}`, { cache: 'no-store' });
        if (res.ok) {
          const post = await res.json();
          if (post && post.title) recommendedPosts.push(post);
        }
      } catch {}
    })
  );

  const rawHtml = await marked.parse(typeof post.content === 'string' ? post.content : '');
  const html = DOMPurify.sanitize(rawHtml);

  return (
    <>
      <Header />
      <div className={styles.postContainer}>
        <main className={styles.postMain}>
          <h1 className={styles.postTitle}>{post.title}</h1>

          <div className={styles.postMeta}>
            <span className={styles.metaAuthor}>{mockMeta.author}</span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaDate}>{mockMeta.date}</span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaCategory}>{mockMeta.category}</span>
          </div>

          <article className={styles.postContent} dangerouslySetInnerHTML={{ __html: html }} />

          <hr className={styles.postSeparator} />

          {recommendedPosts.length > 0 && (
            <section className={styles.recommendedSection}>
              <h2 className={styles.recommendedTitle}>Leia também</h2>
              <ul className={styles.recommendedList}>
                {recommendedPosts.map(rp => (
                  <li key={rp.slug}>
                    <Link href={`/posts/${rp.slug}`} className={styles.recommendedLink}>
                      {rp.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <hr className={styles.postSeparator} />
          <p className={styles.postFooterText}>
            Se você gostou deste conteúdo, conheça o{' '}
            <a href="https://dominioeletrico.com.br" className={styles.footerLink}>
              site Domínio Elétrico
            </a>, onde você pode acessar o curso principal Domínio Elétrico, além de vários outros cursos e playlists em vídeos produzidos pelo Prof. Nicholas Yukio.
          </p>
        </main>
      </div>
      <Rodape />
    </>
  );
}

export const dynamic = 'force-static';
