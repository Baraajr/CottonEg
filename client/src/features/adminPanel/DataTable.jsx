function DataTable({ head, children }) {
  return (
    <table className="w-full text-sm">
      <thead className="sticky top-0 z-10 bg-gray-50 text-gray-600">
        <tr className="border-b">{head}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
export default DataTable;
