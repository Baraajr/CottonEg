function Contact() {
  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-2xl">
        <span className="section-label">Get in touch</span>
        <h1 className="section-heading mt-3 text-4xl sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
          Have a question or need assistance? We&apos;d love to hear from you.
        </p>

        <div className="mt-10 divide-y divide-border border-y border-border">
          <div className="py-5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Email
            </span>
            <p className="mt-2 text-base text-foreground">
              support@cottoneg.com
            </p>
          </div>

          <div className="py-5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Phone
            </span>
            <p className="mt-2 text-base text-foreground">+20 100 000 0000</p>
          </div>

          <div className="py-5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Location
            </span>
            <p className="mt-2 text-base text-foreground">Egypt</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
