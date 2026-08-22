import useUser from '../../hooks/useUser';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import UpdateUserForm from './UpdateUserForm';

function ProfileSection() {
  const { data, isPending: isLoading } = useUser();

  if (isLoading) return null;

  const user = data?.data;

  return (
    <Modal>
      {/* Profile card */}
      <div className="flex sm:flex-row flex-col justify-between gap-6 rounded-xl border border-gray-200 bg-white p-6">
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
          <Button>Update profile</Button>
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
