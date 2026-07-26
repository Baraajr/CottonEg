import Address from './Address';
import Modal from '../../ui/Modal';
import AddAddressForm from './AddAddressForm';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserAddresses, removeAddress } from '../../services/address';

function Addresses() {
  const queryClient = useQueryClient();

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: getUserAddresses,
    staleTime: 1000 * 120,
    retry: 1,
  });

  const { mutate: deleteAddress, isPending: isDeleting } = useMutation({
    mutationFn: removeAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  if (isLoading) return null;

  const addresses = data?.addresses ?? [];

  return (
    <Modal>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold hidden md:inline-block text-gray-900">
            My Addresses
          </h2>

          <Modal.Open opens="add-address">
            <button
              className="group relative overflow-hidden rounded-lg border
             border-gray-300 px-4 py-2 text-sm text-gray-900 transition-colors duration-300"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                Add Address
              </span>

              <span className="absolute inset-0 -translate-x-full transform bg-black transition-transform duration-300 group-hover:translate-x-0" />
            </button>
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
                  <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 transition hover:bg-red-50">
                    Delete
                  </button>
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
