import { useQuery } from '@tanstack/react-query';
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
      <p className="flex h-10 w-full items-center justify-center text-center">
        Admins cannot order
      </p>
    );
  }

  if (isPending) return null;

  const orders = data?.data || [];

  if (!orders.length) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-900">My Orders</h2>

        <div className="rounded-xl border border-gray-200 p-6 text-center text-gray-500">
          No orders yet
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-900">My Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Order #{order._id.slice(-6)}
              </p>

              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                })}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span
                className={`rounded-full border px-2 py-1 text-xs ${
                  order.isPaid
                    ? 'border-gray-900 text-gray-900'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {order.isPaid ? 'Paid' : 'Pending'}
              </span>

              <span
                className={`rounded-full border px-2 py-1 text-xs ${
                  order.isDelivered
                    ? 'border-gray-900 text-gray-900'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                {order.isDelivered ? 'Delivered' : 'Processing'}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {order.cartItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product?.imageCover}
                    alt={item.product?.name}
                    className="h-10 w-10 rounded-md border border-gray-200 object-cover"
                  />

                  <div>
                    <p className="text-gray-900">{item.product?.title}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="font-medium text-gray-900">
                  {item.price * item.quantity} EGP
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <p className="text-sm text-gray-600">
              Payment: {order.paymentMethodType}
            </p>

            <p className="text-sm font-semibold text-gray-900">
              Total: {order.totalOrderPrice} EGP
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserOrders;
