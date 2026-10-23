import { useCartStore } from '../src/store/cartStore';
import { Product } from '../src/types/product';

const mockProduct1: Product = {
  id: 1,
  title: 'Test Product 1',
  price: 25.5,
  description: 'Test description 1',
  category: 'electronics',
  image: 'https://example.com/1.png',
  rating: { rate: 4.5, count: 10 },
};

const mockProduct2: Product = {
  id: 2,
  title: 'Test Product 2',
  price: 15.0,
  description: 'Test description 2',
  category: 'clothing',
  image: 'https://example.com/2.png',
  rating: { rate: 4.0, count: 5 },
};

describe('CartStore Zustand tests', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  test('adds product to cart with default quantity 1', () => {
    useCartStore.getState().addToCart(mockProduct1);

    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].product.id).toBe(1);
    expect(items[0].quantity).toBe(1);
    expect(useCartStore.getState().getTotalItems()).toBe(1);
    expect(useCartStore.getState().getTotalPrice()).toBe(25.5);
  });

  test('increments quantity when same product is added again', () => {
    useCartStore.getState().addToCart(mockProduct1, 2);
    useCartStore.getState().addToCart(mockProduct1, 3);

    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(5);
    expect(useCartStore.getState().getTotalItems()).toBe(5);
    expect(useCartStore.getState().getTotalPrice()).toBe(25.5 * 5);
  });

  test('increments and decrements product quantity', () => {
    useCartStore.getState().addToCart(mockProduct1, 2);
    useCartStore.getState().incrementQuantity(mockProduct1.id);

    expect(useCartStore.getState().getItemQuantity(mockProduct1.id)).toBe(3);

    useCartStore.getState().decrementQuantity(mockProduct1.id);
    expect(useCartStore.getState().getItemQuantity(mockProduct1.id)).toBe(2);

    useCartStore.getState().decrementQuantity(mockProduct1.id);
    useCartStore.getState().decrementQuantity(mockProduct1.id);
    // When decremented below 1, it should be removed from the cart
    expect(useCartStore.getState().getItemQuantity(mockProduct1.id)).toBe(0);
    expect(useCartStore.getState().items.length).toBe(0);
  });

  test('removes product from cart', () => {
    useCartStore.getState().addToCart(mockProduct1);
    useCartStore.getState().addToCart(mockProduct2);

    expect(useCartStore.getState().items.length).toBe(2);

    useCartStore.getState().removeFromCart(mockProduct1.id);
    expect(useCartStore.getState().items.length).toBe(1);
    expect(useCartStore.getState().items[0].product.id).toBe(mockProduct2.id);
  });

  test('clears all items from cart', () => {
    useCartStore.getState().addToCart(mockProduct1);
    useCartStore.getState().addToCart(mockProduct2);

    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items.length).toBe(0);
    expect(useCartStore.getState().getTotalItems()).toBe(0);
    expect(useCartStore.getState().getTotalPrice()).toBe(0);
  });
});
