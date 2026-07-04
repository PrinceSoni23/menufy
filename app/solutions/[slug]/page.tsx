import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { businessTypePages } from "@/lib/seo-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return businessTypePages.map(page => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = businessTypePages.find(item => item.slug === slug);

  if (!page) {
    return buildMetadata({
      title: "Page Not Found | Menuffy",
      description: "That solution page could not be found.",
      path: "/solutions",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: page.title,
    description: page.description,
    path: `/solutions/${page.slug}`,
    keywords: page.keywords,
  });
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const page = businessTypePages.find(item => item.slug === slug);

  if (!page) {
    notFound();
  }

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.title,
      description: page.description,
      provider: {
        "@type": "Organization",
        name: "Menuffy",
        url: "https://menuffy.com",
      },
      areaServed: page.slug,
      url: `https://menuffy.com/solutions/${page.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (page.faqs || []).map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <main
      id="main-content"
      className="min-h-screen bg-[linear-gradient(135deg,_#fff1cf_0%,_#e7d3d3_35%,_#cce5ff_100%)] text-[#5d2d2d]"
    >
      <Header skipAuth />
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            items={[
              { label: "Solutions", href: "/solutions" },
              { label: page.heroTitle },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8b2323]">
                {page.slug.replace(/-/g, " ")}
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {page.heroTitle}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#6f4f45]">
                {page.summary}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/book-demo" className="btn-primary inline-flex">
                  Book a demo
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex rounded-full border border-[#a24e4e]/25 px-6 py-3 font-semibold text-[#8b2323] transition hover:bg-white/70"
                >
                  View pricing
                </Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-[#5d2d2d]">
                Why Menuffy works
              </h2>
              <ul className="mt-4 space-y-3 text-[#6f4f45]">
                <li>
                  • Premium digital menus that feel polished across every
                  device.
                </li>
                <li>
                  • QR-first ordering for faster service and fewer bottlenecks.
                </li>
                <li>
                  • Analytics that help teams understand what guests engage with
                  most.
                </li>
                <li>
                  • Fast updates for seasonal promotions, bundles, and daily
                  specials.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#5d2d2d]">
                Built for hospitality growth
              </h2>
              <p className="mt-3 text-[#6f4f45] leading-7">
                Menuffy brings together digital menu design, analytics, and
                contactless ordering so hospitality teams can move faster and
                present a stronger guest experience.
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#5d2d2d]">
                SEO keywords
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {page.keywords.map(keyword => (
                  <span
                    key={keyword}
                    className="rounded-full bg-[#fff1cf] px-3 py-1 text-sm text-[#8b2323]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <JsonLd data={schema} />
    </main>
  );
}
