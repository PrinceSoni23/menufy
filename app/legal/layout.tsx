import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal - menuffy",
  description: "Privacy Policy and Terms & Conditions for menuffy",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
