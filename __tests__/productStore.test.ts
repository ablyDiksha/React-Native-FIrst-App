import { useProductStore } from '../src/store/productStore';

describe('ProductStore Zustand tests', () => {
  beforeEach(() => {
    useProductStore.setState({
      products: [
        {
          id: 1,
          title: 'Fjallraven Backpack',
          price: 109.95,
          description: 'Your perfect pack for everyday use',
          category: "men's clothing",
          image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
          rating: { rate: 3.9, count: 120 },
        },
        {
          id: 2,
          title: 'Mens Casual Slim Fit',
          price: 22.3,
          description: 'Slim-fitting style, contrast raglan long sleeve',
          category: "men's clothing",
          image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
          rating: { rate: 4.1, count: 259 },
        },
      ],
      loading: false,
      refreshing: false,
      error: null,
      searchQuery: '',
      selectedCategory: 'All',
    });
  });

  test('updates search query', () => {
    useProductStore.getState().setSearchQuery('backpack');
    expect(useProductStore.getState().searchQuery).toBe('backpack');
  });

  test('updates selected category', () => {
    useProductStore.getState().setSelectedCategory("men's clothing");
    expect(useProductStore.getState().selectedCategory).toBe("men's clothing");
  });

  test('resets filters', () => {
    useProductStore.getState().setSearchQuery('backpack');
    useProductStore.getState().setSelectedCategory("men's clothing");

    useProductStore.getState().resetFilters();

    expect(useProductStore.getState().searchQuery).toBe('');
    expect(useProductStore.getState().selectedCategory).toBe('All');
  });

  test('retrieves product by id', () => {
    const product = useProductStore.getState().getProductById(1);
    expect(product).toBeDefined();
    expect(product?.title).toBe('Fjallraven Backpack');

    const nonExistent = useProductStore.getState().getProductById(999);
    expect(nonExistent).toBeUndefined();
  });
});
