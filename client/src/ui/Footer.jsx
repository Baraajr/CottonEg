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
  return (
    <footer className="bg-black text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {/* Find Us */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">Find Us</h3>

          <ul className="space-y-3">
            <li>
              <Link to="pages/store" className="transition hover:text-white">
                Store Location
              </Link>
            </li>

            <li>
              <a href="#" className="transition hover:text-white">
                Google Maps
              </a>
            </li>

            <li>
              <Link to="pages/contact" className="transition hover:text-white">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Customer Care
          </h3>

          <ul className="space-y-3">
            <li>
              <Link to="pages/shipping" className="transition hover:text-white">
                Shipping
              </Link>
            </li>

            <li>
              <Link to="pages/returns" className="transition hover:text-white">
                Returns
              </Link>
            </li>

            <li>
              <Link to="pages/privacy" className="transition hover:text-white">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link to="pages/terms" className="transition hover:text-white">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">Contact</h3>

          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <FiMail className="shrink-0" />
              <span>support@cottoneg.com</span>
            </li>

            <li className="flex items-center gap-3">
              <FiPhone className="shrink-0" />
              <span>+20 100 000 0000</span>
            </li>

            <li className="flex items-start gap-3">
              <FiMapPin className="mt-1 shrink-0" />
              <span>Egypt</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
          {/* Social */}
          <div className="flex gap-4">
            <a
              href="#"
              className="rounded-full border border-gray-700 p-3 transition hover:border-white hover:bg-white hover:text-black"
            >
              <FiFacebook size={18} />
            </a>

            <a
              href="#"
              className="rounded-full border border-gray-700 p-3 transition hover:border-white hover:bg-white hover:text-black"
            >
              <FiInstagram size={18} />
            </a>

            <a
              href="#"
              className="rounded-full border border-gray-700 p-3 transition hover:border-white hover:bg-white hover:text-black"
            >
              <FiTwitter size={18} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} CottonEg. All rights reserved.
          </p>

          {/* Bottom Links */}
          <div className="flex gap-6 text-sm">
            <Link
              to="pages/terms"
              className="text-gray-500 transition hover:text-white"
            >
              Terms
            </Link>

            <Link
              to="pages/privacy"
              className="text-gray-500 transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              to="pages/cookies"
              className="text-gray-500 transition hover:text-white"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
