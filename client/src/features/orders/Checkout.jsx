import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useCart from '../cart/useCart';
import useCreateCashOrder from '../../hooks/useCreateCashOrder';

import Spinner from '../../ui/Spinner';
import Button from '../../ui/Button';
import useCreateCheckoutSession from '../../hooks/useCreateCheckoutSession';

function Checkout() {
  const navigate = useNavigate();
  const { checkout, isLoading: isCreatingSession } = useCreateCheckoutSession();

  const [paymentMethod, setPaymentMethod] = useState('cash');
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === 'cash') {
      createOrder({
        cartId: cart._id,
        shippingAddress,
      });
    } else {
      checkout({
        cartId: cart._id,
        shippingAddress,
      });
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-lg text-muted-foreground">
          Failed to load checkout.
        </p>
      </div>
    );

  if (!items.length)
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center bg-background px-4">
        <h2 className="font-display text-3xl text-foreground">
          Your cart is empty
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Add some products before checking out.
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/products')}
          className="mt-6"
        >
          Continue Shopping
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      {/* Order Summary */}
      <aside className="flex justify-center  bg-surface px-5 py-8 sm:px-8 lg:sticky lg:top-20 lg:flex lg:min-h-screen lg:items-start lg:justify-center lg:px-10 lg:py-12">
        <div className="relative w-full max-w-sm">
          <div className="relative border border-border bg-background px-6 py-7 shadow-sm sm:px-8">
            <p className="text-center text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Order Summary
            </p>

            <h1 className="mt-2 text-center font-display text-3xl text-foreground">
              EGP {cart.totalCartPrice.toFixed(2)}
            </h1>

            <div className="my-6 border-t border-dashed border-border" />

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex items-start gap-3">
                  <img
                    src={item.product.imageCover}
                    alt={item.product.name}
                    className="h-14 w-12 shrink-0 border border-border object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-foreground">
                      {item.product.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm tabular-nums text-foreground">
                    {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-dashed border-border" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="tabular-nums">
                  EGP {cart.totalCartPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-t border-border pt-3 font-semibold text-foreground">
                <span>Total</span>
                <span className="tabular-nums">
                  EGP {cart.totalCartPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="mt-7 text-center text-[10px] leading-relaxed text-muted-foreground">
              Payment and personal information
              <br />
              are encrypted end-to-end.
            </p>
          </div>
        </div>
      </aside>

      {/* Checkout Form */}
      <main className="bg-background px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-md">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Step 2 of 2
          </p>

          <h2 className="mt-2 font-display text-3xl text-foreground">
            Shipping details
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Tell us where to send your order.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Address details
              </label>

              <input
                name="details"
                value={shippingAddress.details}
                onChange={handleChange}
                placeholder="Street, building, apartment..."
                required
                className="w-full border border-border bg-surface px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  City
                </label>

                <input
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-border bg-surface px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-foreground"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground">
                  Postal code
                </label>

                <input
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full border border-border bg-surface px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-foreground"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                Phone number
              </label>

              <input
                name="phone"
                value={shippingAddress.phone}
                onChange={handleChange}
                required
                placeholder="01XXXXXXXXX"
                className="w-full border border-border bg-surface px-3.5 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-foreground"
              />
            </div>

            <div className="space-y-2 pt-2">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => setPaymentMethod('cash')}
                loading={isCreatingOrder}
                disabled={isCreatingOrder || isCreatingSession}
              >
                Place Cash Order
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setPaymentMethod('stripe')}
                loading={isCreatingSession}
                disabled={isCreatingOrder || isCreatingSession}
              >
                Pay with Card (Stripe)
              </Button>
            </div>
          </form>

          <ul className="mt-5 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
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
