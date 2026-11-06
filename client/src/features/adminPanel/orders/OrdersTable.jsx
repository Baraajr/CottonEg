import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FiShoppingBag,
  FiTruck,
  FiCreditCard,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiCheckCircle,
} from 'react-icons/fi';

import AdminPageLayout from '../AdminPageLayout';
import DataTable from '../DataTable';
import useOrders from '../../../hooks/useOrders';
import Spinner from '../../../ui/Spinner';
import Button from '../../../ui/Button';
import { markOrderDelivered, markOrderPaid } from '../../../services/orders';

const formatPrice = (value) => `${Number(value || 0).toLocaleString()} EGP`;

const StatusBadge = ({ children, active = false }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
      active
        ? 'border-primary bg-primary text-primary-foreground'
        : 'border-border bg-background text-muted-foreground'
    }`}
  >
    {children}
  </span>
);

const Customer = ({ user }) => (
  <div className="flex min-w-0 items-center gap-3">
    <img
      src={user?.profileImg || '/images/default-user.png'}
      alt={user?.name || 'Customer'}
      className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
    />
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-foreground">
        {user?.name || 'Unknown'}
      </p>
      <p className="truncate text-xs text-muted-foreground">
        {user?.email || ''}
      </p>
    </div>
  </div>
);

const OrderDetails = ({ order }) => (
  <div className="grid gap-4 lg:grid-cols-2">
    {/* Shipping */}
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <FiMapPin size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">
          Shipping Address
        </h3>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <p>{order.shippingAddress?.details || 'No address details'}</p>
        <p>{order.shippingAddress?.city}</p>
        <p>{order.shippingAddress?.phone}</p>
        {order.shippingAddress?.postalCode && (
          <p>Postal code: {order.shippingAddress.postalCode}</p>
        )}
      </div>
    </div>

    {/* Items */}
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <FiPackage size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Order Items</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {order.cartItems.length} items
        </span>
      </div>

      <div className="space-y-4">
        {order.cartItems.map((item, index) => (
          <div
            key={item._id || index}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={item.product?.imageCover || '/images/placeholder.png'}
                alt={item.product?.name || 'Product'}
                className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover"
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.product?.name || 'Product unavailable'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>

            <p className="shrink-0 text-sm font-medium text-foreground">
              {formatPrice(item.price)}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

function OrdersTable() {
  const { orders = [], isPending } = useOrders();
  const [expandedId, setExpandedId] = useState(null);

  const queryClient = useQueryClient();

  const { mutate: handleDeliver, isPending: isDelivering } = useMutation({
    mutationFn: markOrderDelivered,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const { mutate: handlePay, isPending: isPaying } = useMutation({
    mutationFn: markOrderPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const renderActions = (order) => (
    <div className="flex flex-wrap items-center gap-2">
      {order.paymentMethodType !== 'card' && !order.isPaid && (
        <Button
          size="sm"
          variant="secondary"
          disabled={isPaying}
          onClick={() => handlePay(order._id)}
        >
          Mark Paid
        </Button>
      )}

      {!order.isDelivered && (
        <Button
          size="sm"
          disabled={isDelivering}
          onClick={() => handleDeliver(order._id)}
        >
          Mark Delivered
        </Button>
      )}

      {order.isPaid && order.isDelivered && (
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <FiCheckCircle size={15} />
          Completed
        </span>
      )}
    </div>
  );

  const renderStatuses = (order) => (
    <div className="flex flex-wrap items-center gap-1.5">
      <StatusBadge active={order.isPaid}>
        {order.isPaid ? 'Paid' : 'Unpaid'}
      </StatusBadge>
      <StatusBadge active={order.isDelivered}>
        {order.isDelivered ? 'Delivered' : 'Pending'}
      </StatusBadge>
    </div>
  );

  if (isPending) return <Spinner />;

  return (
    <AdminPageLayout title="Orders">
      <div className="space-y-6">
        {/* Mobile */}
        <div className="space-y-4 lg:hidden">
          {orders.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-surface px-5 py-16 text-center">
              <FiShoppingBag
                size={28}
                className="mx-auto mb-3 text-muted-foreground"
              />
              <h3 className="font-serif text-lg text-foreground">
                No orders yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Orders will appear here when customers make purchases.
              </p>
            </div>
          )}

          {orders.map((order) => {
            const isOpen = expandedId === order._id;

            return (
              <article
                key={order._id}
                className="overflow-hidden rounded-xl border border-border bg-surface"
              >
                <div className="space-y-4 p-4">
                  {/* Order header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        Order number
                      </p>
                      <h3 className="mt-1 font-semibold text-foreground">
                        #{order._id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="text-lg font-semibold text-foreground">
                      {formatPrice(order.totalOrderPrice)}
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <Customer user={order.user} />
                  </div>

                  {/* Payment and delivery */}
                  <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
                    <div>
                      <p className="mb-2 text-xs text-muted-foreground">
                        Payment method
                      </p>
                      <StatusBadge>
                        {order.paymentMethodType || 'Unknown'}
                      </StatusBadge>
                    </div>

                    <div>
                      <p className="mb-2 text-xs text-muted-foreground">
                        Order status
                      </p>
                      {renderStatuses(order)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setExpandedId(isOpen ? null : order._id)}
                      className="flex-1"
                    >
                      {isOpen ? (
                        <>
                          <FiChevronUp size={15} />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <FiChevronDown size={15} />
                          View Details
                        </>
                      )}
                    </Button>

                    {renderActions(order)}
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-border bg-background p-4">
                    <OrderDetails order={order} />
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Desktop */}
        <div className="hidden overflow-hidden rounded-xl border border-border bg-surface lg:block">
          <DataTable
            head={
              <>
                <th className="px-6 py-4 text-left font-medium">Order</th>
                <th className="px-6 py-4 text-left font-medium">Customer</th>
                <th className="px-6 py-4 text-center font-medium">Payment</th>
                <th className="px-6 py-4 text-center font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Total</th>
                <th className="px-6 py-4 text-right font-medium">Details</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </>
            }
          >
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <FiShoppingBag
                    size={28}
                    className="mx-auto mb-3 text-muted-foreground"
                  />
                  <p className="font-serif text-lg text-foreground">
                    No orders yet
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    New customer orders will appear here.
                  </p>
                </td>
              </tr>
            )}

            {orders.map((order) => {
              const isOpen = expandedId === order._id;

              return (
                <React.Fragment key={order._id}>
                  <tr className="border-b border-border transition-colors hover:bg-background">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-foreground">
                        #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <Customer user={order.user} />
                    </td>

                    <td className="px-6 py-4 text-center">
                      <StatusBadge>
                        {order.paymentMethodType || 'Unknown'}
                      </StatusBadge>
                    </td>

                    <td className="px-6 py-4">{renderStatuses(order)}</td>

                    <td className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                      {formatPrice(order.totalOrderPrice)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedId(isOpen ? null : order._id)}
                      >
                        {isOpen ? 'Hide' : 'View'}
                      </Button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        {renderActions(order)}
                      </div>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr className="border-b border-border bg-background">
                      <td colSpan={7} className="px-6 py-5">
                        <OrderDetails order={order} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </DataTable>
        </div>
      </div>
    </AdminPageLayout>
  );
}

export default OrdersTable;
