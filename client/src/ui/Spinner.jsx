function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-black"
        aria-label="Loading"
      />
    </div>
  );
}

export default Spinner;
