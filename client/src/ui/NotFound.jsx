export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-lg text-center">
        <span className="section-label">Page not found</span>

        <h1 className="mt-4 font-display text-8xl leading-none sm:text-9xl">
          404
        </h1>

        <div className="mx-auto my-6 h-px w-16 bg-border" />

        <h2 className="font-display text-2xl sm:text-3xl">
          Lost in the collection?
        </h2>

        <p className="mt-3 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>

        <a
          href="/"
          className="mt-7 inline-flex items-center justify-center border border-foreground bg-primary px-8 py-3 text-xs font-semibold tracking-[0.15em] text-primary-foreground transition-opacity hover:opacity-80"
        >
          BACK TO HOME
        </a>
      </div>
    </section>
  );
}
