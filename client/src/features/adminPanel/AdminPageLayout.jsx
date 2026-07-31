function AdminPageLayout({ title, headerActions, tableActions, children }) {
  return (
    <div className="relative space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>

        {headerActions && (
          <div className="flex items-center gap-2">{headerActions}</div>
        )}
      </div>

      {/* Table/Card */}
      <div className="overflow-hidden rounded-lg ">
        {tableActions && (
          <div className=" p-4">
            <div className="flex justify-between items-center gap-5">
              {tableActions}
            </div>
          </div>
        )}

        <div className=" border overflow-x-auto">{children}</div>
      </div>
    </div>
  );
}

export default AdminPageLayout;
