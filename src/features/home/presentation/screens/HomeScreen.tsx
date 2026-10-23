import React, { useEffect, useMemo, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { useProductStore } from '../../../../store/productStore';
import { useCartStore } from '../../../../store/cartStore';
import { Product } from '../../../../types/product';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const products = useProductStore(state => state.products);
  const loading = useProductStore(state => state.loading);
  const refreshing = useProductStore(state => state.refreshing);
  const error = useProductStore(state => state.error);
  const searchQuery = useProductStore(state => state.searchQuery);
  const selectedCategory = useProductStore(state => state.selectedCategory);

  const fetchProducts = useProductStore(state => state.fetchProducts);
  const setSearchQuery = useProductStore(state => state.setSearchQuery);
  const setSelectedCategory = useProductStore(
    state => state.setSelectedCategory,
  );
  const resetFilters = useProductStore(state => state.resetFilters);

  const addToCart = useCartStore(state => state.addToCart);
  const totalCartCount = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const [recentlyAddedId, setRecentlyAddedId] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return products.filter(product => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      const matchesSearch =
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(prev => (prev === product.id ? null : prev));
    }, 1200);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'All':
        return '✨ All';
      case "men's clothing":
        return "👕 Men's";
      case "women's clothing":
        return "👗 Women's";
      case 'jewelery':
        return '💍 Jewelry';
      case 'electronics':
        return '💻 Electronics';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchProducts(true)}
            colors={['#315CEB']}
            tintColor="#315CEB"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.heading}>Find your Products</Text>
          </View>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.7}
          >
            <Text style={styles.cartText}>🛒</Text>
            {totalCartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {totalCartCount > 99 ? '99+' : totalCartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <TextInput
          style={styles.searchinput}
          placeholder="Search for products..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map(category => {
            const isSelected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.category, isSelected && styles.categorySelected]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {getCategoryLabel(category)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Products Header */}
        <View style={styles.productHeader}>
          <Text style={styles.sectionTitle}>Products</Text>
          <TouchableOpacity onPress={resetFilters} activeOpacity={0.7}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Product List Content */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#315CEB" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchProducts()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No products found.</Text>
          </View>
        ) : (
          <View style={styles.productList}>
            {filteredProducts.map(product => {
              const isAdded = recentlyAddedId === product.id;

              return (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() =>
                    navigation.navigate('ProductDetail', { product })
                  }
                  activeOpacity={0.9}
                >
                  <View style={styles.productImageContainer}>
                    <Image
                      source={{ uri: product.image }}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.title}
                    </Text>
                    <Text style={styles.productPrice}>
                      ${product.price.toFixed(2)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      isAdded && styles.addButtonSuccess,
                    ]}
                    onPress={() => handleAddToCart(product)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addButtonText}>
                      {isAdded ? '✓ Added' : 'Add to Cart'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#172554',
    marginTop: 4,
  },
  cartButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cartText: {
    fontSize: 22,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  searchinput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 48,
    fontSize: 15,
    color: '#1E293B',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  categoryScroll: {
    paddingRight: 10,
    marginBottom: 18,
  },
  category: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  categorySelected: {
    backgroundColor: '#315CEB',
  },
  categoryText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  seeAll: {
    color: '#315CEB',
    fontWeight: '600',
    fontSize: 14,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  productImageContainer: {
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 6,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
    minHeight: 34,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#315CEB',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#315CEB',
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonSuccess: {
    backgroundColor: '#10B981',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  centerContainer: {
    paddingVertical: 50,
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
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
  },
  bottomSpacer: {
    height: 40,
  },
});
