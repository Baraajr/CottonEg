import { Outlet } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { IoIosMenu } from 'react-icons/io';
import AccountNav from '../features/account/AccountNav';

function Account() {
  return (
    <div className="min-h-[calc(100vh-80px-72px)] bg-gray-50">
      {' '}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-3 md:p-4">
        {/* Navigation */}
        <aside className="w-full md:w-64 shrink-0 md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-6rem)] md:overflow-y-auto">
          {' '}
          <AccountNav />
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Account;
