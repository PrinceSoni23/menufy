import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - menuffy",
  description:
    "Privacy Policy for menuffy. Learn how we collect, use, and protect your data.",
  openGraph: {
    title: "Privacy Policy - menuffy",
    description:
      "Privacy Policy for menuffy. Learn how we collect, use, and protect your data.",
    url: "https://menuffy.in/legal/privacy",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://menuffy.in/legal/privacy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
