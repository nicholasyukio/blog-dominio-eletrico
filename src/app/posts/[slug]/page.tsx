// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
// @ts-ignore
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

type Post = {
  slug: string;
  title: string;
  content: string;
  date: string;
};

const mockPosts: { [key: string]: Post } = {
  'first-post': {
    slug: 'first-post',
    title: 'First Post',
    content: 'This is the content of the **first** post.',
    date: '2025-05-30',
  },
  'my-second-post': {
    slug: 'my-second-post',
    title: 'My Second Post',
    content: 'Here is another blog post, second in line!',
    date: '2025-05-31',
  },
  'hello-world': {
    slug: 'hello-world',
    title: 'Hello, World!',
    content: 'Welcome to the blog. This is just the beginning.',
    date: '2025-06-01',
  },
};

async function getPost(slug: string): Promise<Post | null> {
  return mockPosts[slug] ?? null;
/*   const res = await fetch(`https://your-backend.com/api/posts/${slug}`, {
    cache: 'force-cache', // Enables SSG
  });

  if (!res.ok) return null;
  return res.json(); */
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

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return {
    title: post?.title ?? 'Post Not Found',
  };
}

/* export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post not found' };
  return { title: post.title };
} */


export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return notFound();

  // Parse Markdown to HTML and sanitize (await in case marked.parse is async)
  const rawHtml = await marked.parse(post.content as string);
  const html = DOMPurify.sanitize(rawHtml);

  return (
    <main>
      <h1>{post.title}</h1>
      <p><em>{post.date}</em></p>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
