import type { Metadata } from "next";

export const siteConfig = {
  name: "Menuffy",
  title: "Menuffy | Digital Restaurant Menus, QR Ordering & Analytics",
  description:
    "Menuffy helps restaurants launch modern QR menus, contactless ordering, analytics, and premium digital experiences that increase conversions.",
  url: "https://menuffy.com",
  locale: "en_US",
  defaultLanguage: "en",
  keywords: [
    "restaurant QR menu",
    "digital menu software",
    "restaurant ordering system",
    "restaurant analytics",
    "restaurant management software",
    "hospitality software",
    "contactless ordering",
  ],
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
  keywords,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const canonical = new URL(path, siteConfig.url).toString();
  const imageUrl = image
    ? new URL(image, siteConfig.url).toString()
    : `${siteConfig.url}/logo.png`;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: {
      canonical,
    },
    keywords: keywords ?? siteConfig.keywords,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    authors: [{ name: siteConfig.name }],
    category: "Technology",
    manifest: "/manifest.webmanifest",
  };
}
