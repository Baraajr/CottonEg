import { FiUser, FiMail, FiShield, FiEdit2 } from 'react-icons/fi';

import useUser from '../../hooks/useUser';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import UpdateUserForm from './UpdateUserForm';

function ProfileSection() {
  const { data, isPending: isLoading } = useUser();

  if (isLoading) return null;

  const user = data?.data;

  if (!user) return null;

  return (
    <Modal>
      <section className="overflow-hidden border border-border bg-surface shadow-soft">
        {/* Section header */}
        <div className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <span className="section-label">Personal information</span>
            <h2 className="section-heading mt-1 text-xl sm:text-2xl">
              Your profile
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your personal details and account information.
            </p>
          </div>

          <Modal.Open opens="profile-form">
            <Button>
              <span className="flex items-center gap-2">
                <FiEdit2 size={15} />
                Edit profile
              </span>
            </Button>
          </Modal.Open>
        </div>

        {/* Profile content */}
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex shrink-0 items-center gap-4">
              <div className="relative">
                <img
                  src={user.profileImg || '/default-avatar.png'}
                  alt={user.name}
                  className="h-20 w-20 rounded-full border border-border object-cover sm:h-24 sm:w-24"
                />
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-surface bg-foreground" />
              </div>

              <div className="min-w-0 sm:hidden">
                <h3 className="truncate font-display text-xl text-foreground">
                  {user.name}
                </h3>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Account details */}
            <div className="grid min-w-0 flex-1 gap-5 sm:grid-cols-2 sm:gap-8">
              <div className="hidden min-w-0 sm:block">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Account name
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <FiUser
                    className="shrink-0 text-muted-foreground"
                    size={16}
                  />
                  <p className="truncate font-medium text-foreground">
                    {user.name}
                  </p>
                </div>
              </div>

              <div className="min-w-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Email address
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <FiMail
                    className="shrink-0 text-muted-foreground"
                    size={16}
                  />
                  <p className="truncate text-sm text-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <FiShield size={14} className="shrink-0" />
                  Your account information is private and secure.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal.Window name="profile-form">
        <UpdateUserForm user={user} />
      </Modal.Window>
    </Modal>
  );
}

export default ProfileSection;
