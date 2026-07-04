import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Menuffy Pricing | QR Menus, Analytics and Hospitality Software",
  description:
    "Explore Menuffy pricing plans for restaurants, cafes, hotels, and multi-location hospitality teams looking to grow with digital menus.",
  path: "/pricing",
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
