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
      {isPending && <Spinner />}

      {!isPending && (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <DataTable
            head={
              <>
                <th className="px-5 py-4 text-left">Photo</th>
                <th className="px-5 py-4 text-left">Name</th>
                <th className="px-5 py-4 text-left">Email</th>
                <th className="px-5 py-4 text-center">Role</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </>
            }
          >
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No users found
                </td>
              </tr>
            )}

            {users.map((user) => (
              <tr
                key={user._id}
                className="transition-colors hover:bg-accent/40"
              >
                <td className="px-5 py-4">
                  <img
                    src={user.profileImg || '/default-avatar.png'}
                    alt={user.name}
                    className="h-11 w-11 rounded-full border border-border object-cover"
                  />
                </td>

                <td className="px-5 py-4 font-medium text-foreground">
                  {user.name}
                </td>

                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {user.email}
                </td>

                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${
                      user.role === 'admin'
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-surface text-muted-foreground'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                      user.active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-accent text-muted-foreground'
                    }`}
                  >
                    {user.active ? 'Active' : 'Deactivated'}
                  </span>
                </td>

                <td className="px-5 py-4">
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
        </div>
      )}
    </AdminPageLayout>
  );
}

export default UsersTable;
