import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Book a Menuffy Demo | Digital Menu Software for Restaurants",
  description:
    "Book a live demo to see how Menuffy can power your restaurant’s QR menu, contactless ordering, and analytics strategy.",
  path: "/book-demo",
});

export default function BookDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
