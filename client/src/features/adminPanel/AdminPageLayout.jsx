function AdminPageLayout({ title, headerActions, tableActions, children }) {
  return (
    <div className="relative space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>

        {headerActions && (
          <div className="flex items-center gap-2">{headerActions}</div>
        )}
      </div>

      {/* Table/Card */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {tableActions && (
          <div className="border-b border-border p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-5">
              {tableActions}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">{children}</div>
      </div>
    </div>
  );
}

export default AdminPageLayout;
