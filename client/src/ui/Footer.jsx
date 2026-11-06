import { Link } from 'react-router-dom';
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
} from 'react-icons/fi';

function Footer() {
  const linkClass =
    'text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground';

  const headingClass = 'mb-5 font-display text-lg text-foreground';

  const socialClass =
    'flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-all duration-200 hover:border-foreground hover:bg-foreground hover:text-background';

  return (
    <footer className="border-t border-border bg-surface text-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-12 lg:py-14">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link
            to="/"
            className="inline-block font-display text-3xl tracking-tight text-foreground"
          >
            CottonEg.
          </Link>

          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            Everyday essentials, thoughtfully selected.
          </p>

          <div className="mt-6 flex gap-2">
            <a href="#" aria-label="Facebook" className={socialClass}>
              <FiFacebook size={17} />
            </a>

            <a href="#" aria-label="Instagram" className={socialClass}>
              <FiInstagram size={17} />
            </a>

            <a href="#" aria-label="Twitter" className={socialClass}>
              <FiTwitter size={17} />
            </a>
          </div>
        </div>

        {/* Find Us */}
        <div>
          <h3 className={headingClass}>Find Us</h3>

          <ul className="space-y-3">
            <li>
              <Link to="pages/store" className={linkClass}>
                Store Location
              </Link>
            </li>

            <li>
              <a href="#" className={linkClass}>
                Google Maps
              </a>
            </li>

            <li>
              <Link to="pages/contact" className={linkClass}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className={headingClass}>Customer Care</h3>

          <ul className="space-y-3">
            <li>
              <Link to="pages/shipping" className={linkClass}>
                Shipping
              </Link>
            </li>

            <li>
              <Link to="pages/returns" className={linkClass}>
                Returns
              </Link>
            </li>

            <li>
              <Link to="pages/privacy" className={linkClass}>
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link to="pages/terms" className={linkClass}>
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className={headingClass}>Get in Touch</h3>

          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <FiMail className="shrink-0 text-foreground" />
              <span>support@cottoneg.com</span>
            </li>

            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <FiPhone className="shrink-0 text-foreground" />
              <span>+20 100 000 0000</span>
            </li>

            <li className="flex items-center gap-3 text-sm text-muted-foreground">
              <FiMapPin className="shrink-0 text-foreground" />
              <span>Egypt</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:flex-row">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} CottonEg. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-5 text-xs">
            <Link to="pages/terms" className={linkClass}>
              Terms
            </Link>

            <Link to="pages/privacy" className={linkClass}>
              Privacy
            </Link>

            <Link to="pages/cookies" className={linkClass}>
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
