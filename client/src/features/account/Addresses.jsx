import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiMapPin, FiPlus, FiMap, FiTrash2, FiPackage } from 'react-icons/fi';

import Address from './Address';
import AddAddressForm from './AddAddressForm';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import Spinner from '../../ui/Spinner';
import Button from '../../ui/Button';

import { getUserAddresses, removeAddress } from '../../services/address';
import useUser from '../../hooks/useUser';

function Addresses() {
  const { data: user, isPending: isUserLoading } = useUser();

  const currentUser = user?.data;
  const queryClient = useQueryClient();

  const { data } = useQuery({
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

  if (isUserLoading) return <Spinner />;

  if (currentUser?.role === 'admin') {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface px-5 py-12 text-center">
        <FiMap size={15} className="text-primary" />
        <p className="font-serif text-lg text-foreground">
          Address management unavailable
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Admin accounts cannot have delivery addresses.
        </p>
      </div>
    );
  }

  const addresses = data?.addresses ?? [];

  return (
    <Modal>
      <section className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-label">Delivery information</span>
            <h2 className="section-heading mt-1 text-2xl sm:text-3xl">
              My Addresses
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Manage your saved delivery locations for a smoother checkout
              experience.
            </p>
          </div>

          <Modal.Open opens="add-address">
            <Button disabled={isDeleting}>
              <span className="flex items-center gap-2">
                <FiPlus size={16} />
                Add new address
              </span>
            </Button>
          </Modal.Open>
        </div>

        {/* Address count */}
        {addresses.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FiMap size={15} className="text-muted-foreground" />
            <span>
              {addresses.length} saved{' '}
              {addresses.length === 1 ? 'address' : 'addresses'}
            </span>
          </div>
        )}

        {/* Address list */}
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-surface px-5 py-14 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background">
              <FiMap size={15} className="text-primary" />
            </div>

            <h3 className="font-serif text-xl text-foreground">
              No saved addresses
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Your delivery destinations will appear here. Add your first
              address to make future orders easier.
            </p>

            <Modal.Open opens="add-address">
              <Button disabled={isDeleting} className="mt-6">
                <span className="flex items-center gap-2">
                  <FiPlus size={16} />
                  Add your first address
                </span>
              </Button>
            </Modal.Open>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {addresses.map((address) => (
              <article
                key={address._id}
                className="group flex min-w-0 flex-col justify-between gap-5 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/50 sm:p-6"
              >
                <Address address={address} />

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FiPackage size={14} />
                    Delivery location
                  </span>

                  <Modal.Open opens={`delete-address-${address._id}`}>
                    <Button variant="danger" disabled={isDeleting}>
                      <span className="flex items-center gap-2">
                        <FiTrash2 size={14} />
                        Delete
                      </span>
                    </Button>
                  </Modal.Open>
                </div>

                <Modal.Window name={`delete-address-${address._id}`}>
                  <ConfirmDelete
                    resourceName="address"
                    disabled={isDeleting}
                    onConfirm={() => deleteAddress(address._id)}
                  />
                </Modal.Window>
              </article>
            ))}
          </div>
        )}
      </section>

      <Modal.Window name="add-address">
        <AddAddressForm />
      </Modal.Window>
    </Modal>
  );
}

export default Addresses;
