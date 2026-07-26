function Address({ address }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold text-gray-900">{address.alias}</p>

      <p className="text-sm text-gray-600">{address.details}</p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
        <span>{address.phone}</span>
        <span>{address.city}</span>
        <span>{address.postalCode}</span>
      </div>
    </div>
  );
}

export default Address;
