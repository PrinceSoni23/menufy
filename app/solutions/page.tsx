import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { businessTypePages } from "@/lib/seo-data";

export const metadata: Metadata = buildMetadata({
  title: "Hospitality SEO Landing Pages | Menuffy",
  description:
    "Explore Menuffy solution pages for restaurants, cafés, hotels, resorts, bars, cloud kitchens, and more hospitality businesses.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-[linear-gradient(135deg,_#fff1cf_0%,_#e7d3d3_35%,_#cce5ff_100%)] text-[#5d2d2d]"
    >
      <Header skipAuth />
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={[{ label: "Solutions" }]} />
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8b2323]">
                SEO landing pages
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Scalable digital menu solutions for every hospitality business.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#6f4f45]">
                Menuffy supports restaurants, cafés, hotels, resorts, bars,
                pubs, cloud kitchens, and other hospitality brands with modern
                QR menus, contactless ordering, and actionable analytics.
              </p>
              <Link href="/book-demo" className="btn-primary inline-flex">
                Book a demo
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {businessTypePages.slice(0, 8).map(page => (
                <Link
                  key={page.slug}
                  href={`/solutions/${page.slug}`}
                  className="rounded-3xl border border-[#a24e4e]/15 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <h2 className="text-lg font-semibold text-[#5d2d2d]">
                    {page.heroTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#6f4f45]">
                    {page.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Menuffy solution pages",
          description:
            "A library of SEO landing pages for hospitality businesses using Menuffy.",
          url: "https://menuffy.in/solutions",
        }}
      />
    </main>
  );
}
