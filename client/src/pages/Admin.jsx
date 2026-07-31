import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { IoIosMenu } from 'react-icons/io';
import { HiOutlineX } from 'react-icons/hi';
import AdminNav from '../features/adminPanel/AdminNav';

function Admin() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-80px-72px)] bg-gray-50 mt-15 lg:mt-6">
      <div className="p-3 md:p-4 flex gap-4 md:gap-6">
        {/* Mobile button */}
        <button
          className="md:hidden fixed top-24 left-3 z-50 bg-white border px-3 py-2 rounded shadow"
          onClick={() => setOpen(true)}
        >
          <IoIosMenu className="text-xl" />
        </button>

        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-x-0 bottom-0 top-20 bg-black/40 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static
            top-20 left-0
            h-[calc(100vh-80px)] md:h-auto
            w-54
            bg-white md:bg-transparent
            border-r md:border-r-0
            z-50 md:z-auto
            p-4 md:p-0
            transform transition-transform duration-300
            ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
             md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-6rem)] md:overflow-y-auto`}
        >
          {/* Close button */}
          <button
            className="ml-auto block md:hidden mb-4 text-gray-600"
            onClick={() => setOpen(false)}
          >
            <HiOutlineX className="w-7 h-7" />
          </button>

          <AdminNav onClickItem={() => setOpen(false)} />
        </aside>

        {/* Content */}
        <main className="flex-2 min-w-0 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Admin;
