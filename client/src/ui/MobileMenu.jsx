import { HiOutlineChevronLeft } from 'react-icons/hi';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GENDERS } from '../constants/constants';

const MOTION = {
  duration: 0.18,
  ease: [0.4, 0, 0.2, 1], // smooth standard ease
};

export default function MobileMenu({ menus, onClose }) {
  const [selectedGender, setSelectedGender] = useState(null);
  const navigate = useNavigate();

  const categories = menus?.[selectedGender]?.data || [];

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!selectedGender ? (
        <motion.div
          key="genders"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: MOTION.duration, ease: MOTION.ease }}
          className="bg-white rounded-xl p-3 min-h-75"
        >
          <div className="space-y-2">
            <button
              onClick={() => {
                onClose();
                navigate('/');
              }}
              className="w-full flex items-center justify-between rounded-lg p-3
                         hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-sm text-gray-900">Home</span>
            </button>

            {GENDERS.map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className="w-full flex items-center justify-between rounded-lg p-3
                           hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-sm text-gray-900 capitalize">
                  {gender}
                </span>

                <span className="text-gray-400 text-lg">›</span>
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="categories"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 20, opacity: 0 }}
          transition={{ duration: MOTION.duration, ease: MOTION.ease }}
          className="bg-white rounded-xl p-3 min-h-75"
        >
          <button
            onClick={() => setSelectedGender(null)}
            className="flex items-center gap-2 mb-5 text-sm font-medium text-gray-600
                       hover:text-black transition"
          >
            <HiOutlineChevronLeft className="w-5 h-5" />
            <span className="capitalize">{selectedGender}</span>
          </button>

          <div className="space-y-5">
            {categories.map((category) => (
              <div
                key={category._id}
                className="rounded-lg p-3 hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold text-sm text-gray-900 mb-3 tracking-wide">
                  {category.name}
                </h3>

                <div className="pl-3 border-l border-gray-200">
                  <div className="flex flex-col gap-2">
                    {category.subcategories?.map((sub) => (
                      <button
                        key={sub._id}
                        onClick={() => {
                          onClose();
                          navigate(
                            `/products?gender=${selectedGender}&category=${category._id}&subcategory=${sub._id}`,
                          );
                        }}
                        className="text-left text-sm text-gray-500 hover:text-black
                                   hover:translate-x-1 transition"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
