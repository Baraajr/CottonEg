import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

// icons
import { RiDashboardLine } from 'react-icons/ri';
import { IoIosSearch } from 'react-icons/io';
import { FaCartShopping, FaHeart } from 'react-icons/fa6';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FiShoppingCart } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import { CiHeart } from 'react-icons/ci';

// hooks
import useUser from '../hooks/useUser';
import useWishlist from '../features/wishlist/useWishlist';

import { GENDERS } from '../constants/constants';
import useNavByGender from '../hooks/useMenu';
import useCart from '../features/cart/useCart';
import MobileMenu from './MobileMenu';
import IconButton from './IconButton';
import SearchBar from '../features/products/SearchBar';
import GenderMenu from './Gendermenu';

const MOTION = {
  duration: 0.28,
  ease: [0.4, 0, 0.2, 1], // smooth standard ease
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

  const textColor = transparent ? 'text-white' : 'text-black';
  const iconColor = transparent ? 'text-white' : 'text-gray-700';
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
      {/* SEARCH BAR */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-500 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION.duration, ease: MOTION.ease }}
          >
            {/* OVERLAY */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* DRAWER */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: MOTION.duration, ease: MOTION.ease }}
              className="relative h-screen w-[70%] bg-white shadow-xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-20 border-b border-gray-200 flex items-center justify-between px-4">
                <h1 className="text-2xl font-bold">CottonEg.</h1>

                <IconButton
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <HiOutlineX className="h-5 w-5" />
                </IconButton>
              </div>

              <div className="h-[calc(100vh-80px)] overflow-y-auto p-4">
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
        className={`fixed inset-x-0 top-0 z-50 h-20 transition-all duration-300 ${
          transparent
            ? 'bg-transparent border-transparent'
            : 'bg-white border-b border-gray-200 shadow-sm'
        }`}
      >
        <div className="h-full px-4 md:px-6 flex items-center justify-between">
          <h1
            onClick={() => navigate('/')}
            className={`text-2xl md:text-3xl font-bold cursor-pointer transition-colors ${textColor}`}
          >
            CottonEg.
          </h1>

          <nav className="hidden md:flex flex-1 justify-center items-stretch gap-6 h-full">
            <div className="flex items-center">
              <NavLink
                to="/"
                className={`text-sm transition-colors ${
                  transparent
                    ? 'text-white hover:text-gray-200'
                    : 'text-black hover:text-gray-500'
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
                className="relative flex items-center h-full"
              >
                <NavLink
                  to={`/products?gender=${gender}`}
                  className={`text-sm transition-colors ${
                    transparent
                      ? 'text-white hover:text-gray-200'
                      : 'text-black hover:text-gray-500'
                  }`}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </NavLink>

                {activeGender === gender && (
                  <div
                    onMouseEnter={handleMenuEnter}
                    onMouseLeave={handleGenderLeave}
                    className="absolute top-full left-0"
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

          <div className="flex items-center gap-2">
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <IconButton
                onClick={() => setSearchOpen((s) => !s)}
                tooltip="Search"
              >
                <IoIosSearch className={`w-6 h-6 ${iconColor}`} />
              </IconButton>

              {user?.role === 'user' && (
                <>
                  <IconButton
                    onClick={() => navigate('/wishlist')}
                    badge={wishlistCount}
                    tooltip="Wishlist"
                  >
                    {wishlistCount > 0 ? (
                      <FaHeart className="w-6 h-6 text-red-500" />
                    ) : (
                      <CiHeart className={`w-6 h-6 ${iconColor}`} />
                    )}
                  </IconButton>

                  <IconButton
                    onClick={() => navigate('/cart')}
                    badge={cartCount}
                    tooltip="Cart"
                  >
                    {cartCount > 0 ? (
                      <FaCartShopping className={`w-6 h-6 ${iconColor}`} />
                    ) : (
                      <FiShoppingCart className={`w-6 h-6 ${iconColor}`} />
                    )}
                  </IconButton>
                </>
              )}

              {user?.role === 'admin' && (
                <IconButton
                  onClick={() => navigate('/admin')}
                  tooltip="Admin Panel"
                >
                  <RiDashboardLine className={`w-6 h-6 ${iconColor}`} />
                </IconButton>
              )}

              <IconButton
                onClick={() => {
                  if (!user) return navigate('/login');
                  navigate('/account');
                }}
                tooltip={user ? 'Profile' : 'Login'}
              >
                <FiUser className={`w-6 h-6 ${iconColor}`} />
              </IconButton>
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-1">
              <IconButton onClick={() => setSearchOpen((s) => !s)}>
                <IoIosSearch className={`w-6 h-6 ${iconColor}`} />
              </IconButton>

              <IconButton
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <HiOutlineMenu className="h-7 w-7" />
              </IconButton>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
