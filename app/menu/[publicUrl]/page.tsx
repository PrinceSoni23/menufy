import PublicMenuPageClient from "./PublicMenuPageClient";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:5000/api");

type PublicMenuPagePayload = {
  publicUrl: string;
  restaurantId: string;
  restaurant: any;
  menuItems: any[];
};

async function getInitialPublicMenuPayload(
  publicUrl: string,
): Promise<PublicMenuPagePayload | null> {
  try {
    const response = await fetch(
      `${API_BASE}/qrcode/public/${encodeURIComponent(publicUrl)}`,
      {
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    if (!payload?.data?.restaurantId) {
      return null;
    }

    return payload.data as PublicMenuPagePayload;
  } catch (error) {
    console.warn("Failed to prefetch public menu payload:", error);
    return null;
  }
}

export const revalidate = 60;

export default async function PublicMenuPageRoute({
  params,
}: {
  params: Promise<{ publicUrl: string }>;
}) {
  const { publicUrl } = await params;
  const initialPayload = await getInitialPublicMenuPayload(publicUrl);

  return (
    <PublicMenuPageClient
      publicUrl={publicUrl}
      initialPayload={initialPayload ?? undefined}
    />
  );
}
