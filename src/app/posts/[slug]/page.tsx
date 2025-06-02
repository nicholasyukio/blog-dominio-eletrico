// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
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
  const res = await fetch(`${API_BASE}/get-post-by-id/${post_id}`);
  if (!res.ok) return null;
  return res.json();
}

// Remove explicit type from generateStaticParams (Next.js infers it)
export async function generateStaticParams() {
  // Generate all possible slugs for post_id 00000-00099
  const params = [];
  for (let i = 0; i < 100; i++) {
    const id = i.toString().padStart(5, '0');
    params.push({ slug: id });
  }
  return params;
}

// Use correct type for generateMetadata props
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPost(slug);
  return {
    title: post?.title ?? 'Post Not Found',
  };
}

// Use correct type for PostPage props
export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPost(slug);
  if (!post) return notFound();

  // Fetch recommended posts (random, excluding current)
  const recommendedPosts: Post[] = [];
  const currentId = slug.substring(0, 5);
  const getRandomPostIds = (count: number, max: number = 100, excludeId?: string): string[] => {
    const ids = new Set<string>();
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
