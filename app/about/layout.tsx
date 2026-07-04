import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Menuffy | Premium Digital Restaurant Menus",
  description:
    "Learn how Menuffy helps hospitality brands launch premium QR menus, digital ordering experiences, and data-driven restaurant growth tools.",
  path: "/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
