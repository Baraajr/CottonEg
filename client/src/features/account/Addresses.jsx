import Address from './Address';
import Modal from '../../ui/Modal';
import AddAddressForm from './AddAddressForm';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Spinner from '../../ui/Spinner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserAddresses, removeAddress } from '../../services/address';
import Button from '../../ui/Button';
import useUser from '../../hooks/useUser';

function Addresses() {
  const { data: user, isPending: isUserLoading } = useUser();

  const currentUser = user?.data;
  const queryClient = useQueryClient();

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: getUserAddresses,
    staleTime: 1000 * 120,
    retry: 1,
    enabled: currentUser?.role === 'user',
  });

  const { mutate: deleteAddress, isPending: isDeleting } = useMutation({
    mutationFn: removeAddress,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['addresses'], (old) => {
        if (!old) return old;

        return {
          ...old,
          addresses: old.addresses.filter(
            (address) => address._id !== deletedId,
          ),
        };
      });
    },
  });

  if (isLoading) return <Spinner />;

  if (isUserLoading) return <Spinner />;

  if (currentUser?.role === 'admin') {
    return (
      <p className="flex h-10 w-full items-center justify-center text-center">
        Admins cannot have addresses
      </p>
    );
  }

  const addresses = data?.addresses ?? [];

  return (
    <Modal>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="hidden text-lg font-semibold text-gray-900 md:inline-block">
            My Addresses
          </h2>

          <Modal.Open opens="add-address">
            <Button disabled={isDeleting}>Add Address</Button>
          </Modal.Open>
        </div>

        {addresses.length === 0 ? (
          <div className="rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-500">No addresses found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-sm"
              >
                <Address address={address} />

                <Modal.Open opens={`delete-address-${address._id}`}>
                  <Button variant="danger">Delete</Button>
                </Modal.Open>

                <Modal.Window name={`delete-address-${address._id}`}>
                  <ConfirmDelete
                    resourceName="address"
                    disabled={isDeleting}
                    onConfirm={() => deleteAddress(address._id)}
                  />
                </Modal.Window>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal.Window name="add-address">
        <AddAddressForm />
      </Modal.Window>
    </Modal>
  );
}

export default Addresses;
