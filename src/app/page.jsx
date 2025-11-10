import Link from "next/link";
import styles from "./page.module.css";
import Header from "./header.jsx";
import Rodape from "./rodape.jsx";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_BASE_ENDPOINT;

async function getPosts() {
  let posts = [];
  const res = await fetch(`${API_BASE}/get-all-posts`, { cache: 'no-store' })
  if (res.ok) {
    posts = await res.json();
  }
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
            {posts.slice(0, 100).map((post) => (
              <li
                key={post.slug}
                style={{
                  marginBottom: "0.5rem",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "0.5rem",
                }}
              >
                <Link
                  href={`/artigos/${post.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "#072959",
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
                  {post.description?.slice(0, 200)}
                  {post.description && post.description.length > 200 ? "..." : ""}
                </div>
                <a href={`/artigos/${post.slug}`}>
                <img className={styles["thumbnail-img"]} src={`https://dominio-eletrico-static-site.s3.sa-east-1.amazonaws.com/images/${post.thumbnail}`} alt={post.title}/>
                </a>
              </li>
            ))}
          </ul>
        </main>
      </div>
      <Rodape />
    </>
  );
}
