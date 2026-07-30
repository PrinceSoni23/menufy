import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { blogPosts, getRelatedPosts } from "@/lib/blog-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find(item => item.slug === slug);

  if (!post) {
    return buildMetadata({
      title: "Post Not Found | Menuffy",
      description: "The requested article could not be found.",
      path: "/blog",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.image,
    keywords: post.tags,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find(item => item.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[linear-gradient(135deg,_#fff1cf_0%,_#e7d3d3_35%,_#cce5ff_100%)] text-[#5d2d2d]"
    >
      <Header skipAuth />
      <article className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
          />
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8b2323]">
                {post.category}
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 text-lg leading-8 text-[#6f4f45]">
                {post.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#6f4f45]">
                <span>By {post.author}</span>
                <span>•</span>
                <span>{post.readTime}</span>
                <span>•</span>
                <span>{post.publishedAt}</span>
              </div>
              <div className="mt-8 space-y-4 text-[#5d2d2d] leading-8">
                {post.content.map((paragraph, index) => (
                  <p key={`${post.slug}-${index}`}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#fff1cf] px-3 py-1 text-sm text-[#8b2323]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#5d2d2d]">
                  Related posts
                </h2>
                <ul className="mt-4 space-y-3 text-[#6f4f45]">
                  {relatedPosts.map(item => (
                    <li key={item.slug}>
                      <Link
                        href={`/blog/${item.slug}`}
                        className="font-semibold text-[#8b2323] hover:underline"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </article>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          author: { "@type": "Organization", name: post.author },
          datePublished: post.publishedAt,
          mainEntityOfPage: `https://menuffy.in/blog/${post.slug}`,
          image: `https://menuffy.in${post.image}`,
        }}
      />
    </main>
  );
}
