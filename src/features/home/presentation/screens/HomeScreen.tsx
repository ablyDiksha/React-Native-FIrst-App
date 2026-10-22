
import React, {useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useProductStore} from '../../../../store/productStore';

const HomeScreen = () => {
  const products = useProductStore(state => state.products);
  const loading = useProductStore(state => state.loading);
  const error = useProductStore(state => state.error);
  const searchQuery = useProductStore(state => state.searchQuery);
  const selectedCategory = useProductStore(
    state => state.selectedCategory,
  );

  const fetchProducts = useProductStore(
    state => state.fetchProducts,
  );
  const setSearchQuery = useProductStore(
    state => state.setSearchQuery,
  );
  const setSelectedCategory = useProductStore(
    state => state.setSelectedCategory,
  );
  const resetFilters = useProductStore(
    state => state.resetFilters,
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(
    () => [
      'All',
      ...new Set(products.map(product => product.category)),
    ],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return products.filter(product => {
      const matchesCategory =
        selectedCategory === 'All' ||
        product.category === selectedCategory;

      const matchesSearch =
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <ScrollView style={{flex: 1, padding: 16}}>
      <Text style={{fontSize: 24, fontWeight: 'bold'}}>
        Find your Products
      </Text>

      <TextInput
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          backgroundColor: '#fff',
          padding: 12,
          marginVertical: 16,
          borderRadius: 10,
        }}
      />

      <ScrollView horizontal>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={{padding: 10}}>
            <Text>
              {selectedCategory === category ? '✓ ' : ''}
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={resetFilters}>
        <Text style={{color: 'blue', marginVertical: 12}}>
          See All
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <View>
          <Text>{error}</Text>
          <TouchableOpacity onPress={fetchProducts}>
            <Text>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredProducts.length === 0 ? (
        <Text>No products found.</Text>
      ) : (
        filteredProducts.map(product => (
          <View key={product.id} style={{padding: 12}}>
            <Text>{product.title}</Text>
            <Text>${product.price.toFixed(2)}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default HomeScreen;

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

