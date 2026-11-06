import { HiOutlineChevronLeft } from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GENDERS } from '../constants/constants';

const MOTION = {
  duration: 0.18,
  ease: [0.4, 0, 0.2, 1],
};

export default function MobileMenu({ menus, onClose }) {
  const [selectedGender, setSelectedGender] = useState(null);
  const navigate = useNavigate();

  const categories = menus?.[selectedGender]?.data || [];

  const menuItemClass =
    'flex w-full items-center justify-between rounded-lg p-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent';

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!selectedGender ? (
        <motion.div
          key="genders"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: MOTION.duration, ease: MOTION.ease }}
          className="min-h-75 rounded-xl bg-surface p-3 text-foreground"
        >
          <div className="space-y-1">
            <button
              onClick={() => {
                onClose();
                navigate('/');
              }}
              className={menuItemClass}
            >
              <span>Home</span>
            </button>

            {GENDERS.map((gender) => (
              <button
                key={gender}
                onClick={() => setSelectedGender(gender)}
                className={menuItemClass}
              >
                <span className="capitalize">{gender}</span>
                <span className="text-lg text-muted-foreground">›</span>
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
          className="min-h-75 rounded-xl bg-surface p-3 text-foreground"
        >
          <button
            onClick={() => setSelectedGender(null)}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <HiOutlineChevronLeft className="h-5 w-5" />
            <span className="capitalize">{selectedGender}</span>
          </button>

          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category._id}
                className="rounded-lg p-3 transition-colors hover:bg-accent"
              >
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-foreground">
                  {category.name}
                </h3>

                <div className="border-l border-border pl-3">
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
                        className="text-left text-sm text-muted-foreground transition-all hover:translate-x-1 hover:text-foreground"
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
