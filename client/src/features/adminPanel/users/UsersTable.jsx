import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import useUsers from '../../../hooks/useUsers';
import { activateUser, makeUserAdmin } from '../../../services/users';

import AdminPageLayout from '../AdminPageLayout';
import DataTable from '../DataTable';
import Spinner from '../../../ui/Spinner';
import Button from '../../../ui/Button';

function UsersTable() {
  const { users = [], isPending } = useUsers();
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['users'] });

  const { mutate: toggleActive } = useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      toast.success('User updated');
      invalidate();
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update user');
    },
  });

  const { mutate: promoteToAdmin } = useMutation({
    mutationFn: makeUserAdmin,
    onSuccess: () => {
      toast.success('Role updated');
      invalidate();
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to update role');
    },
  });

  return (
    <AdminPageLayout title="Users">
      {/* Loading */}
      {isPending && <Spinner />}

      {/* Table */}
      {!isPending && (
        <DataTable
          head={
            <>
              <th className="px-4 py-3 text-left">Photo</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-center">Email</th>
              <th className="px-4 py-3 text-center">Role</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </>
          }
        >
          {/* Empty */}
          {users.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500">
                No users found
              </td>
            </tr>
          )}

          {/* Rows */}
          {users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
              {/* Photo */}
              <td className="px-4 py-3">
                <img
                  src={user.profileImg || '/default-avatar.png'}
                  alt={user.name}
                  className="h-12 w-12 rounded-full border object-cover"
                />
              </td>

              {/* Name */}
              <td className="px-4 py-3 font-medium">{user.name}</td>

              {/* Email */}
              <td className="px-4 py-3 text-center">{user.email}</td>

              {/* Role */}
              <td className="px-4 py-3 text-center">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    user.role === 'admin'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {user.role}
                </span>
              </td>

              {/* Status */}
              <td className="px-4 py-3 text-center">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    user.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {user.active ? 'Active' : 'Deactivated'}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {!user.active && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleActive(user._id)}
                    >
                      Activate
                    </Button>
                  )}

                  {user.role !== 'admin' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => promoteToAdmin(user._id)}
                    >
                      Make Admin
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </AdminPageLayout>
  );
}

export default UsersTable;
