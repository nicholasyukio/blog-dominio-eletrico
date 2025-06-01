// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
// @ts-ignore
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';
import styles from './page.module.css';
import { Header } from '../../header';
import { BioBlog } from './BioBlog';
import { KnowCourseFromBlogButton } from './KnowCourseFromBlogButton';
import Link from 'next/link';

export type Post = {
  post_id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
};

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_BASE_ENDPOINT;

async function getPost(post_id: string): Promise<Post | null> {
  const res = await fetch(`${API_BASE}/get-post-by-id/${post_id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function generateStaticParams() {
   return [
    { slug: 'first-post' },
    { slug: 'my-second-post' },
    { slug: 'hello-world' },
  ];
  const res = await fetch('https://your-backend.com/api/posts');
  const posts: Post[] = await res.json();

  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getPost(slug.substring(0, 5));
  return {
    title: post?.title ?? 'Post Not Found',
  };
}

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getPost(slug.substring(0, 5));
  if (!post) return notFound();

  // Fetch recommended posts (random, excluding current)
  let recommendedPosts: Post[] = [];
  try {
    const res = await fetch(`${API_BASE}/get-all-posts`, { cache: 'no-store' });
    if (res.ok) {
      const allPosts: Post[] = await res.json();
      const filtered = allPosts.filter(p => p.slug !== slug);
      // Shuffle filtered posts and pick 10
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
      }
      recommendedPosts = filtered.slice(0, 10);
    }
  } catch {}

  // Parse Markdown to HTML and sanitize (await in case marked.parse is async)
  const rawHtml = await marked.parse(post.content as string);
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
