import { useQuery } from '@tanstack/react-query';
import {
  FiShoppingBag,
  FiPackage,
  FiCreditCard,
  FiCalendar,
  FiMapPin,
} from 'react-icons/fi';

import { getMyOrders } from '../../services/orders';
import useUser from '../../hooks/useUser';

function UserOrders() {
  const { data: user, isLoading } = useUser();
  const currentUser = user?.data;

  const { data, isPending } = useQuery({
    queryKey: ['my-orders'],
    queryFn: getMyOrders,
    enabled: currentUser?.role === 'user',
  });

  if (isLoading) return null;

  if (currentUser?.role === 'admin') {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface px-5 py-12 text-center">
        <FiShoppingBag size={28} className="mb-3 text-muted-foreground" />
        <h3 className="font-serif text-lg text-foreground">
          Order history unavailable
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Admin accounts cannot place orders.
        </p>
      </div>
    );
  }

  if (isPending) return null;

  const orders = data?.data || [];

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <span className="section-label">Your purchases</span>
        <h2 className="section-heading mt-1 text-2xl sm:text-3xl">My Orders</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Keep track of your purchases and delivery progress.
        </p>
      </div>

      {/* Order count */}
      {orders.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FiPackage size={15} className="text-accent" />
          <span>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </span>
        </div>
      )}

      {/* Empty state */}
      {!orders.length ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-surface px-5 py-14 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background">
            <FiShoppingBag size={26} className="text-accent" />
          </div>

          <h3 className="font-serif text-xl text-foreground">No orders yet</h3>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Your purchase history will appear here once you place your first
            order. Your next favorite piece might be waiting for you.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {orders.map((order) => (
            <article
              key={order._id}
              className="overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent/40"
            >
              {/* Order header */}
              <div className="flex flex-col gap-4 border-b border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Order
                    </span>
                    <h3 className="font-serif text-lg text-foreground">
                      #{order._id.slice(-6)}
                    </h3>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={13} />
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                      })}
                    </span>

                    <span>
                      {new Date(order.createdAt).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      order.isPaid
                        ? 'border-success/40 bg-success/10 text-success'
                        : 'border-warning/40 bg-warning/10 text-warning'
                    }`}
                  >
                    {order.isPaid ? 'Paid' : 'Payment pending'}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      order.isDelivered
                        ? 'border-success/40 bg-success/10 text-success'
                        : 'border-border bg-surface text-muted-foreground'
                    }`}
                  >
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </div>
              </div>

              {/* Products */}
              <div className="p-4 sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <FiPackage size={15} className="text-accent" />
                  <span className="section-label">
                    Order items ({order.cartItems.length})
                  </span>
                </div>

                <div className="flex flex-col divide-y divide-border">
                  {order.cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-background sm:h-20 sm:w-20">
                          <img
                            src={item.product?.imageCover}
                            alt={item.product?.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-medium leading-relaxed text-foreground">
                            {item.product?.title}
                          </p>

                          <p className="mt-1.5 text-xs text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.price} EGP / item
                          </p>
                        </div>
                      </div>

                      <p className="shrink-0 text-sm font-medium text-foreground">
                        {item.price * item.quantity} EGP
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order footer */}
              <div className="border-t border-border bg-background/50 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <FiCreditCard size={14} className="text-accent" />
                      {order.paymentMethodType}
                    </span>

                    <span className="flex items-center gap-2">
                      <FiMapPin size={14} className="text-accent" />
                      Delivery order
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-border pt-3 sm:border-0 sm:pt-0">
                    <span className="text-sm text-muted-foreground">
                      Order total
                    </span>

                    <p className="font-serif text-xl font-medium text-foreground">
                      {order.totalOrderPrice} EGP
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default UserOrders;
