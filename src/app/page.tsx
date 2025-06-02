import Link from "next/link";
import styles from "./page.module.css";
import { Header } from "./header";
import type { Post } from "./posts/[slug]/page";
import { KnowCourseFromBlogButton } from "./posts/[slug]/KnowCourseFromBlogButton";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_BASE_ENDPOINT;

async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/get-all-posts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default async function Home() {
  let posts: Post[] = [];
  try {
    posts = await getPosts();
  } catch {
    return (
      <>
        <Header />
        <div className={styles.page}>
          <main className={styles.main}>
            <h1>Erro ao carregar posts</h1>
            <p>Não foi possível obter os posts do servidor.</p>
          </main>
        </div>
      </>
    );
  }
  return (
    <>
      <Header />
      <div className={styles.page}>
        <main className={styles.main}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Artigos recentes do blog
          </h1>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {posts.slice(0, 10).map((post) => (
              <li
                key={post.slug}
                style={{
                  marginBottom: "0.5rem",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "0.5rem",
                }}
              >
                <Link
                  href={`/posts/${post.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "#0070f3",
                    fontSize: "1.3rem",
                    fontWeight: 600,
                  }}
                >
                  {post.title}
                </Link>
                <div
                  style={{
                    color: "#888",
                    fontSize: "0.95rem",
                    marginTop: "0.3rem",
                  }}
                >
                  {post.date}
                </div>
                <div
                  style={{
                    color: "#444",
                    marginTop: "0.7rem",
                  }}
                >
                  {post.description?.slice(0, 80)}
                  {post.description && post.description.length > 80 ? "..." : ""}
                </div>
              </li>
            ))}
          </ul>
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
