import {
  FiBox,
  FiCheckCircle,
  FiDollarSign,
  FiShoppingBag,
  FiTruck,
  FiUsers,
  FiAlertTriangle,
  FiPackage,
} from 'react-icons/fi';
import { useDashboard } from '../../../hooks/useDashboard';

const StatCard = ({ title, value, icon: Icon, description }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="mt-2 text-2xl font-semibold text-gray-900">{value}</h3>

        {description && (
          <p className="mt-1 text-xs text-gray-400">{description}</p>
        )}
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
        <Icon className="text-xl text-gray-700" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-600">
        Failed to load dashboard.
      </div>
    );
  }

  const formatPrice = (value) => `${Number(value || 0).toLocaleString()} EGP`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your CottonEg store.
        </p>
      </div>

      {/* Main Stats */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatPrice(data.revenue.total)}
          icon={FiDollarSign}
          description="From paid orders"
        />

        <StatCard
          title="Monthly Revenue"
          value={formatPrice(data.revenue.thisMonth)}
          icon={FiDollarSign}
          description="Current month"
        />

        <StatCard
          title="Total Orders"
          value={data.orders.total.toLocaleString()}
          icon={FiShoppingBag}
          description={`${data.orders.paid} paid orders`}
        />

        <StatCard
          title="Total Users"
          value={data.users.total.toLocaleString()}
          icon={FiUsers}
          description="Registered users"
        />
      </section>

      {/* Secondary Stats */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={data.products.total.toLocaleString()}
          icon={FiBox}
          description={`${data.products.active} active products`}
        />

        <StatCard
          title="Products Sold"
          value={data.productsSold.toLocaleString()}
          icon={FiPackage}
          description="From paid orders"
        />

        <StatCard
          title="Delivered Orders"
          value={data.orders.delivered.toLocaleString()}
          icon={FiTruck}
          description={`${data.orders.pendingDelivery} pending`}
        />

        <StatCard
          title="Low Stock"
          value={data.products.lowStock.toLocaleString()}
          icon={FiAlertTriangle}
          description={`${data.products.outOfStock} out of stock`}
        />
      </section>

      {/* Orders + Inventory */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Orders Overview */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Orders Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">Current order status</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiShoppingBag />
                Total
              </div>
              <p className="mt-2 text-2xl font-semibold">{data.orders.total}</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiCheckCircle />
                Paid
              </div>
              <p className="mt-2 text-2xl font-semibold">{data.orders.paid}</p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiTruck />
                Delivered
              </div>
              <p className="mt-2 text-2xl font-semibold">
                {data.orders.delivered}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiAlertTriangle />
                Pending
              </div>
              <p className="mt-2 text-2xl font-semibold">
                {data.orders.pendingDelivery}
              </p>
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>
            <p className="mt-1 text-sm text-gray-500">Product availability</p>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">Active Products</span>
                <span className="font-medium">{data.products.active}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-900"
                  style={{
                    width: `${
                      data.products.total
                        ? (data.products.active / data.products.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">Low Stock</span>
                <span className="font-medium">{data.products.lowStock}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-500"
                  style={{
                    width: `${
                      data.products.total
                        ? (data.products.lowStock / data.products.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">Out of Stock</span>
                <span className="font-medium">{data.products.outOfStock}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-300"
                  style={{
                    width: `${
                      data.products.total
                        ? (data.products.outOfStock / data.products.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <p className="mt-1 text-sm text-gray-500">
            Latest orders placed in your store
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Delivery</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {data.recentOrders?.map((order) => (
                <tr key={order._id} className="transition hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          order.user?.profileImg || '/images/default-user.png'
                        }
                        alt={order.user?.name || 'User'}
                        className="h-9 w-9 rounded-full object-cover"
                      />

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.user?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatPrice(order.totalOrderPrice)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        order.isPaid
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {order.isDelivered ? 'Delivered' : 'Pending'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {!data.recentOrders?.length && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top Products */}
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Top Selling Products
          </h2>
          <p className="mt-1 text-sm text-gray-500">Best performing products</p>
        </div>

        <div className="divide-y divide-gray-100">
          {data.topProducts?.map((product, index) => (
            <div
              key={product._id}
              className="flex items-center gap-4 px-6 py-4"
            >
              <span className="w-6 text-sm font-medium text-gray-400">
                #{index + 1}
              </span>

              <img
                src={product.imageCover}
                alt={product.name}
                className="h-14 w-14 rounded-xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {product.name}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {product.sold} units sold
                </p>
              </div>

              <p className="text-sm font-semibold text-gray-900">
                {formatPrice(product.revenue)}
              </p>
            </div>
          ))}

          {!data.topProducts?.length && (
            <p className="px-6 py-10 text-center text-sm text-gray-500">
              No sales data available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
