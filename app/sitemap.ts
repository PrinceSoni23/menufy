import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { businessTypePages } from "@/lib/seo-data";
import { blogPosts } from "@/lib/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/pricing",
    "/book-demo",
    "/legal",
    "/legal/privacy",
    "/legal/terms",
    "/blog",
    "/solutions",
  ];

  const staticEntries = staticRoutes.map(route => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const businessEntries = businessTypePages.map(page => ({
    url: `${siteConfig.url}/solutions/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const blogEntries = blogPosts.map(post => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...businessEntries, ...blogEntries];
}
