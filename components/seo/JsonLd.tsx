type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function JsonLd({ data }: JsonLdProps) {
  const content = Array.isArray(data) ? data : [data];

  return (
    <>
      {content.map((item, index) => (
        <script
          key={`${index}-${JSON.stringify(item)}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
