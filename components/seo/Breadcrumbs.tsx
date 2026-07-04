import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#6f4f45]">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="font-medium text-[#8b2323] hover:underline">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              <span aria-hidden="true">/</span>
              {isLast || !item.href ? (
                <span className="font-semibold text-[#5d2d2d]">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium text-[#8b2323] hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
