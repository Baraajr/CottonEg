function Store() {
  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <span className="section-label">Find us</span>
      <h1 className="section-heading mt-3 text-4xl sm:text-5xl">
        Store Location
      </h1>

      <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
        Visit CottonEg in Egypt. Our physical store offers the latest
        collections and in-store assistance.
      </p>

      <div className="mt-9 max-w-xl border border-border bg-surface p-5 sm:p-7">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Our location
        </span>

        <div className="mt-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-background">
            <span className="text-lg">⌖</span>
          </div>

          <div>
            <h2 className="font-display text-xl text-foreground">Address</h2>
            <p className="mt-1 text-sm text-muted-foreground">Egypt</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Store;
