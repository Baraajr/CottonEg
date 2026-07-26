function AdminPageLayout({ title, actions, children }) {
  return (
    <div className="space-y-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex items-center gap-2">{actions}</div>
      </div>

      {/* Content */}
      <div className="overflow-x-auto rounded-lg border bg-white">
        {children}
      </div>
    </div>
  );
}

export default AdminPageLayout;
