import {
  FiBox,
  FiCheckCircle,
  FiDollarSign,
  FiShoppingBag,
  FiTruck,
  FiUsers,
  FiAlertTriangle,
  FiPackage,
  FiArrowUpRight,
  FiTrendingUp,
} from 'react-icons/fi';

import { useDashboard } from '../../../hooks/useDashboard';

const formatPrice = (value) => `${Number(value || 0).toLocaleString()} EGP`;

const formatNumber = (value) => Number(value || 0).toLocaleString();

function StatCard({ title, value, icon: Icon, description, featured = false }) {
  return (
    <div
      className={`rounded-xl border p-5 transition-colors ${
        featured
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-surface hover:border-foreground/20'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p
            className={`text-sm ${
              featured ? 'opacity-70' : 'text-muted-foreground'
            }`}
          >
            {title}
          </p>
          <h3 className="mt-3 truncate text-2xl font-semibold tracking-tight">
            {value}
          </h3>
          {description && (
            <p
              className={`mt-2 text-xs ${
                featured ? 'opacity-60' : 'text-muted-foreground'
              }`}
            >
              {description}
            </p>
          )}
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            featured ? 'bg-white/10' : 'bg-background'
          }`}
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, description, action }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h2 className="font-serif text-xl text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

function ChartCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function Dashboard() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl bg-surface"
          />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <FiAlertTriangle
          className="mx-auto mb-3 text-muted-foreground"
          size={24}
        />
        <p className="text-sm text-foreground">Failed to load dashboard.</p>
      </div>
    );
  }

  const totalOrders = Number(data.orders.total || 0);
  const paidOrders = Number(data.orders.paid || 0);
  const unpaidOrders = Math.max(totalOrders - paidOrders, 0);
  const paidPercentage = totalOrders ? (paidOrders / totalOrders) * 100 : 0;

  const topProducts = data.topProducts || [];
  const maxRevenue = Math.max(
    ...topProducts.map((product) => Number(product.revenue || 0)),
    1,
  );

  const inventoryItems = [
    { label: 'Active Products', value: data.products.active },
    { label: 'Low Stock', value: data.products.lowStock },
    { label: 'Out of Stock', value: data.products.outOfStock },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="section-label">Store management</span>
          <h1 className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            An overview of your CottonEg store performance.
          </p>
        </div>

        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Store overview
        </span>
      </header>

      {/* Performance */}
      <section className="space-y-4">
        <span className="section-label">Performance</span>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatPrice(data.revenue.total)}
            icon={FiDollarSign}
            description="Revenue from paid orders"
            featured
          />
          <StatCard
            title="Monthly Revenue"
            value={formatPrice(data.revenue.thisMonth)}
            icon={FiTrendingUp}
            description="Current month"
          />
          <StatCard
            title="Total Orders"
            value={formatNumber(totalOrders)}
            icon={FiShoppingBag}
            description={`${formatNumber(paidOrders)} paid orders`}
          />
          <StatCard
            title="Customers"
            value={formatNumber(data.users.total)}
            icon={FiUsers}
            description="Registered users"
          />
        </div>
      </section>

      {/* Store activity */}
      <section className="space-y-4">
        <span className="section-label">Store activity</span>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Products"
            value={formatNumber(data.products.total)}
            icon={FiBox}
            description={`${formatNumber(data.products.active)} active products`}
          />
          <StatCard
            title="Products Sold"
            value={formatNumber(data.productsSold)}
            icon={FiPackage}
            description="From paid orders"
          />
          <StatCard
            title="Delivered Orders"
            value={formatNumber(data.orders.delivered)}
            icon={FiTruck}
            description={`${formatNumber(data.orders.pendingDelivery)} pending delivery`}
          />
          <StatCard
            title="Low Stock"
            value={formatNumber(data.products.lowStock)}
            icon={FiAlertTriangle}
            description={`${formatNumber(data.products.outOfStock)} out of stock`}
          />
        </div>
      </section>

      {/* Analytics */}
      <section>
        <div className="mb-4">
          <span className="section-label">Store analytics</span>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Top products chart */}
          <ChartCard>
            <SectionHeader
              title="Top Selling Products"
              description="Revenue generated by your best sellers."
              action={
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-muted-foreground">
                  <FiTrendingUp size={17} />
                </div>
              }
            />

            {topProducts.length ? (
              <div className="space-y-5">
                {topProducts.map((product, index) => {
                  const revenue = Number(product.revenue || 0);
                  const percentage = (revenue / maxRevenue) * 100;

                  return (
                    <div key={product._id} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="w-5 shrink-0 text-xs text-muted-foreground">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="truncate text-sm font-medium text-foreground">
                            {product.name}
                          </span>
                        </div>

                        <span className="shrink-0 text-sm font-semibold text-foreground">
                          {formatPrice(revenue)}
                        </span>
                      </div>

                      <div className="ml-7 h-2 overflow-hidden rounded-full bg-background">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <p className="ml-7 text-xs text-muted-foreground">
                        {formatNumber(product.sold)} units sold
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <FiPackage
                  size={26}
                  className="mx-auto mb-3 text-muted-foreground"
                />
                <p className="text-sm text-muted-foreground">
                  No sales data available.
                </p>
              </div>
            )}
          </ChartCard>

          {/* Payment chart */}
          <ChartCard>
            <SectionHeader
              title="Payment Overview"
              description="Paid and unpaid order distribution."
            />

            <div className="flex flex-col items-center gap-7 py-4 sm:flex-row sm:justify-around">
              <div
                className="relative flex h-44 w-44 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(var(--color-primary) 0% ${paidPercentage}%, var(--color-muted) ${paidPercentage}% 100%)`,
                }}
              >
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-surface">
                  <span className="text-3xl font-semibold tabular-nums text-foreground">
                    {Math.round(paidPercentage)}%
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    Paid orders
                  </span>
                </div>
              </div>

              <div className="w-full max-w-xs space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-sm bg-primary" />
                    <span className="text-sm text-muted-foreground">Paid</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {formatNumber(paidOrders)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-sm bg-muted" />
                    <span className="text-sm text-muted-foreground">
                      Unpaid
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {formatNumber(unpaidOrders)}
                  </span>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total orders
                    </span>
                    <span className="text-lg font-semibold text-foreground">
                      {formatNumber(totalOrders)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </section>

      {/* Orders and inventory */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ChartCard>
          <SectionHeader
            title="Orders Overview"
            description="A breakdown of your order activity."
          />

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'Total Orders',
                value: data.orders.total,
                icon: FiShoppingBag,
              },
              {
                label: 'Paid Orders',
                value: data.orders.paid,
                icon: FiCheckCircle,
              },
              {
                label: 'Delivered',
                value: data.orders.delivered,
                icon: FiTruck,
              },
              {
                label: 'Pending',
                value: data.orders.pendingDelivery,
                icon: FiAlertTriangle,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-lg border border-border bg-background p-4"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon size={15} />
                  <span className="text-xs">{label}</span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-foreground">
                  {formatNumber(value)}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard>
          <SectionHeader
            title="Inventory"
            description="Current product availability."
          />

          <div className="space-y-6">
            {inventoryItems.map(({ label, value }) => {
              const percentage = data.products.total
                ? Math.min(
                    (Number(value || 0) / data.products.total) * 100,
                    100,
                  )
                : 0;

              return (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium tabular-nums text-foreground">
                      {formatNumber(value)}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-7 flex items-center justify-between border-t border-border pt-4 text-sm">
            <span className="text-muted-foreground">Total Products</span>
            <span className="font-semibold text-foreground">
              {formatNumber(data.products.total)}
            </span>
          </div>
        </ChartCard>
      </section>

      {/* Recent orders */}
      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border p-5 sm:p-6">
          <div>
            <SectionHeader
              title="Recent Orders"
              description="The latest orders placed in your store."
            />
          </div>
          <FiArrowUpRight size={20} className="text-muted-foreground" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-175 text-left">
            <thead className="bg-background text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Delivery</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {data.recentOrders?.map((order) => (
                <tr
                  key={order._id}
                  className="transition-colors hover:bg-background"
                >
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
                        <p className="text-sm font-medium text-foreground">
                          {order.user?.name || 'Unknown'}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {order.user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {formatPrice(order.totalOrderPrice)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        order.isPaid
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                      {order.isDelivered ? 'Delivered' : 'Pending'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {!data.recentOrders?.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
