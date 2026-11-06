import { Outlet } from 'react-router-dom';
import AccountNav from '../features/account/AccountNav';
import { FiShield } from 'react-icons/fi';

function Account() {
  return (
    <div className="min-h-[calc(100vh-80px-72px)] bg-background">
      <div className="flex flex-col items-stretch gap-4 p-4 md:flex-row md:gap-6 md:p-6">
        <aside className="w-full shrink-0 md:sticky md:top-24 md:h-fit md:w-64 md:self-start">
          <AccountNav />
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Account;
