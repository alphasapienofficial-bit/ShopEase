export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="muted grid justify-items-center gap-3 py-16 text-sm" role="status">
      <span
        className="size-7 animate-spin rounded-full border-[3px] border-zinc-200 border-t-violet-600 dark:border-zinc-800 dark:border-t-violet-400"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
