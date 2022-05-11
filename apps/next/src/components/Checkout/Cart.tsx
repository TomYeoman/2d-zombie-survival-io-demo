import React, { ReactNode } from 'react';
import { CartProvider } from 'use-shopping-cart/react';
import * as config from 'src/config/index';

const Cart = ({ children }: { children: ReactNode }) => (
  <CartProvider
    mode="subscription"
    cartMode="client-only"
    stripe={process.env.NEXT_STRIPE_SECRET_KEY as string}
    successUrl="/success"
    cancelUrl="/failure"
    allowedCountries={['US', 'GB', 'CA']}
    billingAddressCollection={true}
    currency={config.CURRENCY}
  >
    <>{children}</>
  </CartProvider>
);

export default Cart;
