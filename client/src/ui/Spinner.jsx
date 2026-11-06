function Spinner() {
  return (
    <div
      className="flex items-center justify-center py-16"
      role="status"
      aria-label="Loading"
    >
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-border border-t-foreground" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;
