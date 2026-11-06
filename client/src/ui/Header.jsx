import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { RiDashboardLine } from 'react-icons/ri';
import { IoIosSearch } from 'react-icons/io';
import { FaCartShopping, FaHeart } from 'react-icons/fa6';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { CiHeart } from 'react-icons/ci';

import useUser from '../hooks/useUser';
import useWishlist from '../features/wishlist/useWishlist';
import { GENDERS } from '../constants/constants';
import useNavByGender from '../hooks/useMenu';
import useCart from '../features/cart/useCart';
import MobileMenu from './MobileMenu';
import IconButton from './IconButton';
import SearchBar from '../features/Products/SearchBar';
import GenderMenu from './Gendermenu';

const MOTION = {
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1],
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeGender, setActiveGender] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';
  const closeTimer = useRef(null);

  const { data } = useUser();
  const user = data?.data;

  const transparent = isHome && !scrolled;

  const textColor = transparent ? 'text-white' : 'text-foreground';
  const iconColor = transparent ? 'text-white' : 'text-foreground';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: cartData } = useCart({ enabled: user?.role === 'user' });
  const { data: wishlistData } = useWishlist({
    enabled: user?.role === 'user',
  });

  const cartCount = cartData?.data?.cartItems?.length || 0;
  const wishlistCount = wishlistData?.data?.length || 0;

  const menMenu = useNavByGender('men');
  const womenMenu = useNavByGender('women');
  const kidsMenu = useNavByGender('kids');

  const menus = {
    men: menMenu,
    women: womenMenu,
    kids: kidsMenu,
  };

  function handleGenderEnter(gender) {
    clearTimeout(closeTimer.current);
    setActiveGender(gender);
  }

  function handleGenderLeave() {
    closeTimer.current = setTimeout(() => setActiveGender(null), 100);
  }

  function handleMenuEnter() {
    clearTimeout(closeTimer.current);
  }

  return (
    <>
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-500 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION.duration, ease: MOTION.ease }}
          >
            <motion.div
              className="absolute inset-0 bg-foreground/50"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: MOTION.duration, ease: MOTION.ease }}
              className="relative z-10 h-screen w-[78%] max-w-sm border-r border-border bg-background shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-5">
                <h1
                  onClick={() => navigate('/')}
                  className="cursor-pointer font-display text-2xl text-foreground"
                >
                  CottonEg.
                </h1>

                <IconButton
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <HiOutlineX className="h-5 w-5 text-foreground" />
                </IconButton>
              </div>

              <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
                <MobileMenu
                  menus={menus}
                  onClose={() => setMobileMenuOpen(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={`fixed inset-x-0 top-0 z-50 h-16 md:h-20 transition-all duration-300 ${
          transparent
            ? 'border-transparent bg-transparent'
            : 'border-transparent bg-background/95 shadow-sm backdrop-blur-md'
        }`}
      >
        <div className="flex h-full items-center justify-between px-4 md:px-8">
          <h1
            onClick={() => navigate('/')}
            className={`cursor-pointer font-display text-2xl md:text-[2rem] tracking-tight transition-colors ${textColor}`}
          >
            CottonEg.
          </h1>

          <nav className="hidden h-full flex-1 items-stretch justify-center gap-8 md:flex">
            <div className="flex items-center">
              <NavLink
                to="/"
                className={`relative text-[13px] font-medium tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all hover:after:w-full ${
                  transparent
                    ? 'text-white/90 hover:text-white'
                    : 'text-foreground hover:text-muted-foreground'
                }`}
              >
                Home
              </NavLink>
            </div>

            {GENDERS.map((gender) => (
              <div
                key={gender}
                onMouseEnter={() => handleGenderEnter(gender)}
                onMouseLeave={handleGenderLeave}
                className="relative flex h-full items-center"
              >
                <NavLink
                  to={`/products?gender=${gender}`}
                  className={`relative text-[13px] font-medium capitalize tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all hover:after:w-full ${
                    transparent
                      ? 'text-white/90 hover:text-white'
                      : 'text-foreground hover:text-muted-foreground'
                  }`}
                >
                  {gender}
                </NavLink>

                {activeGender === gender && (
                  <div
                    onMouseEnter={handleMenuEnter}
                    onMouseLeave={handleGenderLeave}
                    className="absolute left-0 top-full"
                  >
                    <GenderMenu
                      gender={gender}
                      data={menus[gender]?.data || []}
                      onClose={() => setActiveGender(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            {/* Desktop actions */}
            <div className="hidden items-center gap-1 md:flex">
              <IconButton
                onClick={() => setSearchOpen((s) => !s)}
                tooltip="Search"
              >
                <IoIosSearch className={`h-5 w-5 ${iconColor}`} />
              </IconButton>

              {user?.role === 'user' && (
                <>
                  <IconButton
                    onClick={() => navigate('/wishlist')}
                    badge={wishlistCount}
                    tooltip="Wishlist"
                  >
                    {wishlistCount > 0 ? (
                      <FaHeart className={`h-[18px] w-[18px] ${iconColor}`} />
                    ) : (
                      <CiHeart className={`h-6 w-6 ${iconColor}`} />
                    )}
                  </IconButton>

                  <IconButton
                    onClick={() => navigate('/cart')}
                    badge={cartCount}
                    tooltip="Cart"
                  >
                    {cartCount > 0 ? (
                      <FaCartShopping
                        className={`h-[18px] w-[18px] ${iconColor}`}
                      />
                    ) : (
                      <FiShoppingCart className={`h-5 w-5 ${iconColor}`} />
                    )}
                  </IconButton>
                </>
              )}

              {user?.role === 'admin' && (
                <IconButton
                  onClick={() => navigate('/admin')}
                  tooltip="Admin Panel"
                >
                  <RiDashboardLine className={`h-5 w-5 ${iconColor}`} />
                </IconButton>
              )}

              <IconButton
                onClick={() => {
                  if (!user) return navigate('/login');
                  navigate('/account');
                }}
                tooltip={user ? 'Profile' : 'Login'}
              >
                <FiUser className={`h-5 w-5 ${iconColor}`} />
              </IconButton>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-1 md:hidden">
              <IconButton onClick={() => setSearchOpen((s) => !s)}>
                <IoIosSearch className={`h-5 w-5 ${iconColor}`} />
              </IconButton>

              <IconButton
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <HiOutlineMenu className={`h-6 w-6 ${iconColor}`} />
              </IconButton>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
