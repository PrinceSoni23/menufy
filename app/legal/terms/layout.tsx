import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - menuffy",
  description:
    "Terms & Conditions for menuffy. Read our full terms of service.",
  openGraph: {
    title: "Terms & Conditions - menuffy",
    description:
      "Terms & Conditions for menuffy. Read our full terms of service.",
    url: "https://menuffy.com/legal/terms",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://menuffy.com/legal/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
