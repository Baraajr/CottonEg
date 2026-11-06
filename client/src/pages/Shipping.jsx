function Shipping() {
  return (
    <section className="mx-auto min-h-[70vh] max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <span className="section-label">Customer care</span>
      <h1 className="section-heading mt-3 text-4xl sm:text-5xl">
        Shipping Policy
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
        <p>Orders are processed within 1–2 business days.</p>
        <p>Delivery times depend on your location.</p>
        <p>You will receive a tracking number once your order ships.</p>
      </div>
    </section>
  );
}

export default Shipping;
