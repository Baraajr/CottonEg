import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useCart from '../cart/useCart';
import useCreateCashOrder from '../../hooks/useCreateCashOrder';

import Spinner from '../../ui/Spinner';
import SpinnerMini from '../../ui/SpinnerMini';
import Button from '../../ui/Button';

function Checkout() {
  const navigate = useNavigate();

  const { data, isLoading, error } = useCart();

  const { createOrder, isLoading: isCreatingOrder } = useCreateCashOrder();

  const cart = data?.data || data;
  const items = cart?.cartItems || [];

  const [shippingAddress, setShippingAddress] = useState({
    details: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const handleChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCashOrder = (e) => {
    e.preventDefault();

    createOrder({
      cartId: cart._id,
      shippingAddress,
    });
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F3F0]">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F3F0]">
        <p className="font-body text-lg text-red-600">
          Failed to load checkout.
        </p>
      </div>
    );

  if (!items.length)
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center bg-[#F4F3F0] px-4">
        <h2 className="font-display text-3xl font-semibold text-[#1C1B19]">
          Your cart is empty
        </h2>

        <p className="mt-3 font-body text-[#8A857D]">
          Add some products before checking out.
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/products')}
          className="mt-8 rounded-full px-8"
        >
          Continue Shopping
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F4F3F0] font-body lg:grid lg:grid-cols-[4fr_5fr]">
      {/* ---------- Order Summary — styled as a paper receipt ---------- */}
      <aside className="bg-[#F4F3F0] px-6 py-10 lg:sticky lg:top-8 lg:flex lg:justify-center lg:self-start lg:px-10">
        <div className="relative w-full max-w-sm">
          {/* stamp */}
          <div className="pointer-events-none absolute -right-3 top-8 z-10 hidden -rotate-14 rounded-full border-2 border-[#1F4D3D]/70 px-4 py-2 sm:block">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-[#1F4D3D]/80">
              Secured
            </span>
          </div>

          {/* receipt body */}
          <div
            className="relative bg-white px-8 pb-10 pt-9 shadow-[0_18px_50px_-15px_rgba(28,27,25,0.25)]"
            style={{
              clipPath:
                'polygon(0% 0%, 100% 0%, 100% 97%, 96% 100%, 92% 97%, 88% 100%, 84% 97%, 80% 100%, 76% 97%, 72% 100%, 68% 97%, 64% 100%, 60% 97%, 56% 100%, 52% 97%, 48% 100%, 44% 97%, 40% 100%, 36% 97%, 32% 100%, 28% 97%, 24% 100%, 20% 97%, 16% 100%, 12% 97%, 8% 100%, 4% 97%, 0% 100%)',
            }}
          >
            <p className="text-center font-mono text-[11px] uppercase tracking-[0.35em] text-[#8A857D]">
              Order Receipt
            </p>

            <h1 className="mt-2 text-center font-display text-4xl font-semibold text-[#1C1B19]">
              EGP {cart.totalCartPrice.toFixed(2)}
            </h1>

            <div className="mx-auto mt-6 w-full border-t border-dashed border-[#1C1B19]/20" />

            <div className="mt-6 space-y-5">
              {items.map((item) => (
                <div key={item._id} className="flex items-start gap-3">
                  <img
                    src={item.product.imageCover}
                    alt={item.product.name}
                    className="h-12 w-12 shrink-0 rounded-md border border-[#1C1B19]/10 object-cover grayscale-15"
                  />

                  <div className="flex-1">
                    <p className="font-body text-sm font-medium leading-snug text-[#1C1B19]">
                      {item.product.name}
                    </p>
                    <p className="font-mono text-xs text-[#8A857D]">
                      × {item.quantity}
                    </p>
                  </div>

                  <span className="font-mono text-sm text-[#1C1B19]">
                    {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-6 w-full border-t border-dashed border-[#1C1B19]/20" />

            <div className="mt-5 space-y-2 font-mono text-sm text-[#1C1B19]">
              <div className="flex justify-between">
                <span className="text-[#8A857D]">Subtotal</span>
                <span>EGP {cart.totalCartPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-medium">
                <span>Total</span>
                <span>EGP {cart.totalCartPrice.toFixed(2)}</span>
              </div>
            </div>

            <p className="mt-8 text-center font-mono text-[10px] leading-relaxed text-[#8A857D]">
              Payment and personal information
              <br />
              are encrypted end-to-end.
            </p>
          </div>
        </div>
      </aside>

      {/* ---------- Checkout Form ---------- */}
      <main className="bg-white">
        <div className="mx-auto max-w-md px-6 py-5 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#8A857D]">
            Step 2 of 2
          </p>

          <h2 className="mt-3 font-display text-3xl font-semibold text-[#1C1B19]">
            Shipping details
          </h2>

          <p className="mt-2 font-body text-[#8A857D]">
            Tell us where to send your order.
          </p>

          <form onSubmit={handleCashOrder} className="mt-6 space-y-2">
            <div>
              <label className="mb-1.5 block font-body text-sm font-medium text-[#1C1B19]">
                Address details
              </label>

              <input
                name="details"
                value={shippingAddress.details}
                onChange={handleChange}
                placeholder="Street, building, apartment..."
                required
                className="w-full rounded-lg border border-[#1C1B19]/15 bg-[#FDFCFA] px-4 py-3 font-body text-[#1C1B19] outline-none transition placeholder:text-[#8A857D]/70 focus:border-[#1F4D3D] focus:bg-white focus:ring-4 focus:ring-[#1F4D3D]/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block font-body text-sm font-medium text-[#1C1B19]">
                  City
                </label>

                <input
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#1C1B19]/15 bg-[#FDFCFA] px-4 py-3 font-body text-[#1C1B19] outline-none transition focus:border-[#1F4D3D] focus:bg-white focus:ring-4 focus:ring-[#1F4D3D]/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-body text-sm font-medium text-[#1C1B19]">
                  Postal code
                </label>

                <input
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#1C1B19]/15 bg-[#FDFCFA] px-4 py-3 font-mono text-[#1C1B19] outline-none transition focus:border-[#1F4D3D] focus:bg-white focus:ring-4 focus:ring-[#1F4D3D]/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-body text-sm font-medium text-[#1C1B19]">
                Phone number
              </label>

              <input
                name="phone"
                value={shippingAddress.phone}
                onChange={handleChange}
                required
                placeholder="01XXXXXXXXX"
                className="w-full rounded-lg border border-[#1C1B19]/15 bg-[#FDFCFA] px-4 py-3 font-mono text-[#1C1B19] outline-none transition placeholder:text-[#8A857D]/70 focus:border-[#1F4D3D] focus:bg-white focus:ring-4 focus:ring-[#1F4D3D]/10"
              />
            </div>

            <div className="space-y-3 pt-3">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                fullWidth
                loading={isCreatingOrder}
                disabled={isCreatingOrder}
                className="h-14 rounded-lg border-[#1C1B19]/20 text-base text-[#1C1B19] hover:border-[#1C1B19]"
              >
                Place cash order
              </Button>
            </div>
          </form>

          <ul className="mt-1 space-y-2 border-t border-dashed border-[#1C1B19]/15 pt-3 font-body text-sm text-[#8A857D]">
            <li>Fast delivery across Egypt</li>
            <li>Cash on delivery available</li>
            <li>Secure payment powered by Stripe</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Checkout;
