import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error(`Failed to fetch products (${response.status})`);
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load products';
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#315CEB']}
          tintColor="#315CEB"
        />
      }>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.heading}>Find your Products</Text>
        </View>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartText}>🛒</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchinput}
        placeholder="Search for products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        clearButtonMode="while-editing"
      />

      {/* Categories */}
      <Text style={styles.searchTitle}>Categories</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map(category => {
          const isSelected = selectedCategory === category;
          const displayLabel =
            category === 'All'
              ? '✨ All'
              : category === "men's clothing"
              ? "👕 Men's"
              : category === "women's clothing"
              ? "👗 Women's"
              : category === 'jewelery'
              ? '💍 Jewelry'
              : category === 'electronics'
              ? '💻 Electronics'
              : category.charAt(0).toUpperCase() + category.slice(1);

          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.category,
                isSelected && styles.categorySelected,
              ]}
              onPress={() => setSelectedCategory(category)}>
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextSelected,
                ]}>
                {displayLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Products Heading */}
      <View style={styles.productHeader}>
        <Text style={styles.searchTitle}>Products</Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Products List / State */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#315CEB" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No products found.</Text>
        </View>
      ) : (
        <View style={styles.productList}>
          {filteredProducts.map(product => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productImageContainer}>
                <Image
                  source={{uri: product.image}}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.productName} numberOfLines={2}>
                {product.title}
              </Text>
              <Text style={styles.productPrice}>
                ${product.price.toFixed(2)}
              </Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#777777',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#172554',
    marginTop: 4,
  },
  cartButton: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
  },
  cartText: {
    fontSize: 24,
  },
  searchinput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
    marginBottom: 25,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 15,
  },
  category: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 25,
  },
  categorySelected: {
    backgroundColor: '#315CEB',
  },
  categoryText: {
    color: '#333333',
    fontWeight: '500',
    fontSize: 14,
  },
  categoryTextSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: {
    color: '#315CEB',
    marginBottom: 15,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  productImageContainer: {
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    padding: 6,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
    minHeight: 36,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#315CEB',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#315CEB',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  centerContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#315CEB',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
  },
  bottomSpacer: {
    height: 50,
  },
});

export default HomeScreen;
