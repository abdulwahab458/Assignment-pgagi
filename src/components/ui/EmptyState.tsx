export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
      <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
      ) : null}
    </div>
  );
}
