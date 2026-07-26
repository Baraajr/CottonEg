import useUser from '../../hooks/useUser';
import Modal from '../../ui/Modal';
import UpdateUserForm from './UpdateUserForm';

function ProfileSection() {
  const { data, isPending: isLoading } = useUser();

  if (isLoading) return null;

  const user = data?.data;

  return (
    <Modal>
      {/* Profile card */}
      <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6">
        {/* user info */}
        <div className="flex items-center gap-4">
          <img
            src={user.profileImg || '/default-avatar.png'}
            alt={user.name}
            className="h-12 w-12 rounded-full object-cover border border-gray-200"
          />

          <div className="flex flex-col">
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* button */}
        <Modal.Open opens="profile-form">
          <button
            className="relative overflow-hidden px-4 py-2 text-sm font-medium rounded-lg
                       border border-gray-200 text-gray-900 group"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              Update profile
            </span>

            {/* hover fill animation */}
            <span
              className="absolute inset-0 bg-black transform -translate-x-full
                         group-hover:translate-x-0 transition-transform duration-300"
            />
          </button>
        </Modal.Open>
      </div>

      {/* Modal */}
      <Modal.Window name="profile-form">
        <UpdateUserForm user={user} />
      </Modal.Window>
    </Modal>
  );
}

export default ProfileSection;
