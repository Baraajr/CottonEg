import React, { useState } from 'react';
import AdminPageLayout from '../AdminPageLayout';
import DataTable from '../DataTable';
import useOrders from '../../../hooks/useOrders';
import Spinner from '../../../ui/Spinner';
import Button from '../../../ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markOrderDelivered, markOrderPaid } from '../../../services/orders';

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

  return (
    <AdminPageLayout title="Orders">
      {isPending && <Spinner />}

      {!isPending && (
        <>
          {/* ================= MOBILE ================= */}
          <div className="space-y-3 lg:hidden">
            {orders.length === 0 && (
              <div className="py-10 text-center text-gray-500">
                No orders found
              </div>
            )}

            {orders.map((order) => {
              const isOpen = expandedId === order._id;

              return (
                <div
                  key={order._id}
                  className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">
                        #{order._id.slice(-6)}
                      </div>

                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right font-semibold">
                      ${order.totalOrderPrice}
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="mt-3 flex items-center gap-2 border-t pt-3">
                    <img
                      src={order.user?.profileImg}
                      alt={order.user?.name}
                      className="h-9 w-9 rounded-full border object-cover"
                    />

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {order.user?.name}
                      </div>

                      <div className="truncate text-xs text-gray-500">
                        {order.user?.email}
                      </div>
                    </div>
                  </div>

                  {/* Payment + Status */}
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3">
                    <div>
                      <div className="mb-1 text-xs text-gray-500">Payment</div>

                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                          order.paymentMethodType === 'card'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.paymentMethodType}
                      </span>
                    </div>

                    <div>
                      <div className="mb-1 text-xs text-gray-500">Status</div>

                      <div className="flex flex-wrap gap-1">
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            order.isPaid
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </span>

                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            order.isDelivered
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.isDelivered ? 'Delivered' : 'Delivering'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedId(isOpen ? null : order._id)}
                      className="flex-1"
                    >
                      {isOpen ? 'Hide Details' : 'View Details'}
                    </Button>

                    {order.paymentMethodType !== 'card' && !order.isPaid && (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={isPaying}
                        onClick={() => handlePay(order._id)}
                        className="flex-1"
                      >
                        Mark Paid
                      </Button>
                    )}

                    {!order.isDelivered && (
                      <Button
                        size="sm"
                        disabled={isDelivering}
                        onClick={() => handleDeliver(order._id)}
                        className="flex-1"
                      >
                        Deliver
                      </Button>
                    )}

                    {order.isPaid && order.isDelivered && (
                      <span className="ml-auto self-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  {isOpen && (
                    <div className="mt-3 space-y-3 border-t pt-3">
                      {/* Shipping */}
                      <div className="rounded border bg-gray-50 p-3 text-sm">
                        <div className="mb-2 font-semibold">
                          Shipping Address
                        </div>

                        <div>{order.shippingAddress?.details}</div>
                        <div>{order.shippingAddress?.city}</div>
                        <div>{order.shippingAddress?.phone}</div>
                        <div>{order.shippingAddress?.postalCode}</div>
                      </div>

                      {/* Items */}
                      <div className="rounded border bg-gray-50 p-3">
                        <div className="mb-2 font-semibold">Items</div>

                        <div className="space-y-3">
                          {order.cartItems.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3 text-sm"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <img
                                  src={item.product?.imageCover}
                                  alt={item.product?.name}
                                  className="h-10 w-10 shrink-0 rounded border object-cover"
                                />

                                <div className="min-w-0">
                                  <div className="truncate font-medium">
                                    {item.product?.name}
                                  </div>

                                  <div className="text-xs text-gray-500">
                                    Qty: {item.quantity}
                                  </div>
                                </div>
                              </div>

                              <div className="shrink-0 font-semibold">
                                ${item.price}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ================= DESKTOP ================= */}
          <div className="hidden lg:block">
            <DataTable
              head={
                <>
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-center">Payment</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Total</th>
                  <th className="px-4 py-3 text-right">Details</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </>
              }
            >
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}

              {orders.map((order) => {
                const isOpen = expandedId === order._id;

                return (
                  <React.Fragment key={order._id}>
                    <tr className="border-b hover:bg-gray-50">
                      {/* Order */}
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          #{order._id.slice(-6)}
                        </div>

                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={order.user?.profileImg}
                            alt={order.user?.name}
                            className="h-8 w-8 rounded-full border object-cover"
                          />

                          <div>
                            <div className="font-medium">
                              {order.user?.name}
                            </div>

                            <div className="text-xs text-gray-500">
                              {order.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            order.paymentMethodType === 'card'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.paymentMethodType}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`rounded px-2 py-1 text-xs ${
                              order.isPaid
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>

                          <span
                            className={`rounded px-2 py-1 text-xs ${
                              order.isDelivered
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {order.isDelivered ? 'Delivered' : 'Delivering'}
                          </span>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 text-center font-semibold">
                        ${order.totalOrderPrice}
                      </td>

                      {/* Details */}
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setExpandedId(isOpen ? null : order._id)
                          }
                        >
                          {isOpen ? 'Hide' : 'View'}
                        </Button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {order.paymentMethodType !== 'card' &&
                            !order.isPaid && (
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
                              Deliver
                            </Button>
                          )}

                          {order.isPaid && order.isDelivered && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                              Completed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {isOpen && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid gap-4 lg:grid-cols-2">
                            {/* Shipping */}
                            <div className="rounded border bg-white p-3 text-sm">
                              <div className="mb-2 font-semibold">
                                Shipping Address
                              </div>

                              <div>{order.shippingAddress?.details}</div>
                              <div>{order.shippingAddress?.city}</div>
                              <div>{order.shippingAddress?.phone}</div>
                              <div>{order.shippingAddress?.postalCode}</div>
                            </div>

                            {/* Items */}
                            <div className="rounded border bg-white p-3">
                              <div className="mb-2 font-semibold">Items</div>

                              <div className="space-y-2">
                                {order.cartItems.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={item.product?.imageCover}
                                        alt={item.product?.name}
                                        className="h-10 w-10 rounded border object-cover"
                                      />

                                      <div>
                                        <div className="font-medium">
                                          {item.product?.name}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                          Qty: {item.quantity}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="font-semibold">
                                      ${item.price}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </DataTable>
          </div>
        </>
      )}
    </AdminPageLayout>
  );
}

export default OrdersTable;
