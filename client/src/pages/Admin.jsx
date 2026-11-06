import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { IoIosMenu } from 'react-icons/io';
import { HiOutlineX } from 'react-icons/hi';

import AdminNav from '../features/adminPanel/AdminNav';

function Admin() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-450 gap-0 md:gap-3 lg:gap-5">
        {/* Mobile menu button */}
        <button
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 md:hidden"
        >
          <IoIosMenu className="text-2xl" />
        </button>

        {/* Mobile overlay */}
        {open && (
          <button
            aria-label="Close navigation overlay"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-67.5
            border-r border-border bg-surface
            p-5 transition-transform duration-300
            md:sticky md:top-0 md:h-screen md:translate-x-0
             md:bg-transparent md:px-6 md:py-8
            ${open ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="mb-8 flex items-center justify-between md:hidden">
            <span className="font-serif text-xl font-semibold text-foreground">
              CottonEg
            </span>

            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <HiOutlineX className="h-6 w-6" />
            </button>
          </div>

          <div className="hidden border-b border-border pb-7 md:mb-7 md:block">
            <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              CottonEg
            </span>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Store administration
            </p>
          </div>

          <AdminNav onClickItem={() => setOpen(false)} />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Admin;
