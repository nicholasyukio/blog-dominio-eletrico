// app/posts/[slug]/page.jsx
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import styles from './page.module.css';
import { Header } from '../../header';
import { BioBlog } from './BioBlog';
import { KnowCourseFromBlogButton } from './KnowCourseFromBlogButton';
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
  // Await params if it is a Promise (for compatibility with Next.js dynamic API)
  const resolvedParams = typeof params.then === 'function' ? await params : params;
  const { slug } = resolvedParams;
  const post = await getPost(slug.slice(0, 5)); // Ensure slug is 5 characters long
  if (!post) return notFound();

  // Fetch recommended posts (random, excluding current)
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
  const recIds = getRandomPostIds(10, 100, currentId);
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

  // Parse Markdown to HTML and sanitize
  const rawHtml = await marked.parse(typeof post.content === 'string' ? post.content : '');
  const html = DOMPurify.sanitize(rawHtml);

  return (
    <>
      <Header />
      <div className={styles.postContainer}>
        <main className={styles.postMain}>
          <h1 className={styles.postTitle}>{post.title}</h1>
          <article className={styles.postContent} dangerouslySetInnerHTML={{ __html: html }} />
          <hr className={styles.postSeparator} />
          {/* Recommended posts section */}
          {recommendedPosts.length > 0 && (
            <section style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Leia também</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {recommendedPosts.map(rp => (
                  <li key={rp.slug} style={{ marginBottom: '1.1rem' }}>
                    <Link href={`/posts/${rp.slug}`} style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 600, fontSize: '1.05rem' }}>
                      {rp.title}
                    </Link>
                    <span style={{ color: '#888', fontSize: '0.95rem', marginLeft: 8 }}>{rp.date}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <hr className={styles.postSeparator} />
          <p>Se você gostou deste conteúdo, conheça o <a href='https://dominioeletrico.com.br'>site Domínio Elétrico</a>, onde você pode acessar o curso principal Domínio Elétrico, além de vários outros cursos e playlists em vídeos produzidos pelo Prof. Nicholas Yukio.</p>
          <BioBlog />
        </main>
      </div>
      <div className={styles.bottomBanner}>
        <p style={{ margin: 0 }}>
          No site Domínio Elétrico, você tem acesso a cursos em vídeo e playlists de circuitos elétricos criados pelo Prof. Nicholas Yukio. Clique no botão abaixo para criar uma conta gratuita e começar a estudar agora:
        </p>
        <KnowCourseFromBlogButton />
      </div>
    </>
  );
}

export const dynamic = 'force-static';
