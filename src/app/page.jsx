import Link from "next/link";
import styles from "./page.module.css";
import Header from "./header.jsx";
import Rodape from "./rodape.jsx";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_BASE_ENDPOINT;

export const revalidate = 86400;

async function getPosts() {
  let posts = [];
  const res = await fetch(`${API_BASE}/get-all-posts`);
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
            <h1>Erro ao carregar artigos</h1>
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
              <li key={post.slug} className={styles.articleCard}>
                  <a href={`/blog/artigos/${post.slug}`}>
                    <img
                      className={styles.thumbnailImg}
                      src={`https://dominio-eletrico-static-site.s3.sa-east-1.amazonaws.com/images/${post.thumbnail}`}
                      alt={post.title}
                    />
                  </a>

                  <div className={styles.articleContent}>
                    <Link
                      href={`/blog/artigos/${post.slug}`}
                      className={styles.articleTitle}
                    >
                      {post.title}
                    </Link>

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

                    <p className={styles.description}>
                      {post.description?.slice(0, 150)}
                      {post.description && post.description.length > 150 ? "..." : ""}
                    </p>

                    <div className={styles.readMoreContainer}>
                      <a
                        href={`/blog/artigos/${post.slug}`}
                        className={styles.readMore}
                      >
                        Ler artigo completo
                      </a>
                    </div>
                  </div>
                </li>
            ))}
          </ul>
        </main>
      </div>
      <Rodape />
    </>
  );
}
