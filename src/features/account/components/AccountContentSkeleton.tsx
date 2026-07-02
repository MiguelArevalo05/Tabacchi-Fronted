export default function AccountContentSkeleton() {
  return (
    <div className="animate-pulse space-y-5" aria-hidden="true">
      <div className="h-24 rounded-2xl bg-slate-100" />
      <div className="grid gap-5 md:grid-cols-3">
        <div className="h-48 rounded-2xl bg-slate-100" />
        <div className="h-48 rounded-2xl bg-slate-100" />
        <div className="h-48 rounded-2xl bg-slate-100" />
      </div>
      <div className="h-40 rounded-2xl bg-slate-100" />
    </div>
  );
}
