import Link from "next/link";
import styles from "./page.module.css";
import Header from "./header.jsx";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_BASE_ENDPOINT;

function getRandomPostIds(count, max = 100) {
  const ids = new Set();
  while (ids.size < count) {
    const n = Math.floor(Math.random() * max);
    ids.add(n.toString().padStart(5, '0'));
  }
  return Array.from(ids);
}

async function getPosts() {
  const ids = getRandomPostIds(10, 100);
  const posts = [];
  await Promise.all(
    ids.map(async (id) => {
      try {
        const res = await fetch(`${API_BASE}/get-post-by-id/${id}`, { cache: 'no-store' });
        if (res.ok) {
          const post = await res.json();
          if (post && post.title) posts.push(post);
        }
      } catch {}
    })
  );
  return posts;
}

export default async function Home() {
  let posts = [];
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
    </>
  );
}
