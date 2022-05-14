import Image from 'next/image';
import products from 'src/data/products.json';
import { Product } from 'use-shopping-cart/core';
import { useShoppingCart, formatCurrencyString } from 'use-shopping-cart/react';

const Products = () => {
  const { addItem, removeItem } = useShoppingCart();

  return (
    <section className="products">
      {products.map((product) => (
        <div key={product.sku} className="product">
          <Image src={product.image} alt={product.name} />
          <h2>{product.name}</h2>
          <p className="price">
            {formatCurrencyString({
              value: product.price,
              currency: product.currency,
            })}
          </p>
          <button
            className="cart-style-background"
            onClick={() => addItem(product)}
          >
            Add to cart
          </button>
          <button
            className="cart-style-background"
            onClick={() => removeItem(product.sku)}
          >
            Remove
          </button>
        </div>
      ))}
    </section>
  );
};

export default Products;
