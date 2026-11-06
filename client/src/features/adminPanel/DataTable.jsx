function DataTable({ head, children }) {
  return (
    <table className="w-full text-sm text-foreground">
      <thead className="sticky top-0 z-10 bg-surface text-muted-foreground">
        <tr className="border-b border-border">{head}</tr>
      </thead>

      <tbody className="divide-y divide-border">{children}</tbody>
    </table>
  );
}

export default DataTable;
