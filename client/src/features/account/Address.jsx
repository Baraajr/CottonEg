import { FiMapPin, FiPhone, FiMap, FiHash } from 'react-icons/fi';

function Address({ address }) {
  return (
    <div className="flex min-w-0 gap-2">
      {/* Location icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
        <FiMapPin size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-serif text-lg font-medium text-foreground">
            {address.alias}
          </h3>

          <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Saved address
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {address.details}
        </p>

        <div className="mt-4 flex flex-col gap-2.5">
          {address.phone && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <FiPhone size={14} className="shrink-0 text-muted-foreground" />
              <span>{address.phone}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {address.city && (
              <span className="flex items-center gap-2">
                <FiMap size={14} className="shrink-0" />
                {address.city}
              </span>
            )}

            {address.postalCode && (
              <span className="flex items-center gap-2">
                <FiHash size={14} className="shrink-0" />
                {address.postalCode}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Address;
