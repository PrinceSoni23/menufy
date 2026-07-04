import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { blogPosts } from "@/lib/blog-data";

export const metadata: Metadata = buildMetadata({
  title: "Restaurant Technology Blog | Menuffy",
  description:
    "Read SEO-friendly articles about digital menus, restaurant analytics, QR menus, and hospitality growth.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[linear-gradient(135deg,_#fff1cf_0%,_#e7d3d3_35%,_#cce5ff_100%)] text-[#5d2d2d]"
    >
      <Header skipAuth />
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={[{ label: "Blog" }]} />
          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8b2323]">
              Blog
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Insights for restaurant growth, menu optimization, and digital
              hospitality.
            </h1>
            <p className="text-lg leading-8 text-[#6f4f45]">
              Explore practical content on QR menus, restaurant analytics,
              contactless ordering, and the future of hospitality software.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {blogPosts.map(post => (
              <article
                key={post.slug}
                className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#8b2323]">
                  {post.category}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[#5d2d2d]">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#6f4f45]">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm text-[#8b2323]">
                  <span>{post.readTime}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-semibold hover:underline"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Menuffy blog",
          description:
            "SEO-friendly articles for hospitality leaders and restaurant operators.",
          url: "https://menuffy.com/blog",
        }}
      />
    </main>
  );
}
