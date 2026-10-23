import React, { useState, useLayoutEffect, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { useCartStore } from '../../../../store/cartStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen = ({ route, navigation }: Props) => {
  const { product } = route.params;
  const insets = useSafeAreaInsets();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const addToCart = useCartStore(state => state.addToCart);
  const cartItems = useCartStore(state => state.items);
  const totalCartCount = useCartStore(state =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const cartItem = cartItems.find(item => item.product.id === product.id);
  const currentInCartCount = cartItem ? cartItem.quantity : 0;

  const renderHeaderRight = useCallback(() => {
    return (
      <TouchableOpacity
        style={styles.headerCartButton}
        onPress={() => navigation.navigate('Cart')}
        activeOpacity={0.7}
      >
        <Text style={styles.headerCartIcon}>🛒</Text>
        {totalCartCount > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              {totalCartCount > 99 ? '99+' : totalCartCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [navigation, totalCartCount]);

  // Header cart icon with badge
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Product Details',
      headerTintColor: '#172554',
      headerRight: renderHeaderRight,
    });
  }, [navigation, renderHeaderRight]);

  const handleAddToCart = () => {
    addToCart(product, selectedQuantity);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2500);
  };

  const handleIncrement = () => {
    setSelectedQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(prev => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image Card */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Content Section */}
        <View style={styles.detailsCard}>
          {/* Category Badge & Rating */}
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {product.category.toUpperCase()}
              </Text>
            </View>

            {product.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.starIcon}>★</Text>
                <Text style={styles.ratingScore}>{product.rating.rate}</Text>
                <Text style={styles.ratingCount}>
                  ({product.rating.count} reviews)
                </Text>
              </View>
            )}
          </View>

          {/* Product Title */}
          <Text style={styles.title}>{product.title}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {currentInCartCount > 0 && (
              <View style={styles.inCartBadge}>
                <Text style={styles.inCartText}>
                  {currentInCartCount} in your cart
                </Text>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Quantity Selector Section */}
          <View style={styles.divider} />
          <View style={styles.quantitySection}>
            <Text style={styles.sectionHeader}>Select Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={[
                  styles.qtyButton,
                  selectedQuantity <= 1 && styles.qtyButtonDisabled,
                ]}
                onPress={handleDecrement}
                disabled={selectedQuantity <= 1}
              >
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{selectedQuantity}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={handleIncrement}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Added feedback banner */}
          {addedToast && (
            <View style={styles.toast}>
              <Text style={styles.toastText}>
                ✓ Added {selectedQuantity} {selectedQuantity > 1 ? 'items' : 'item'} to cart!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 14) },
        ]}
      >
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.bottomPriceLabel}>Total Price</Text>
          <Text style={styles.bottomPriceValue}>
            ${(product.price * selectedQuantity).toFixed(2)}
          </Text>
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cartShortcutButton}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.8}
          >
            <Text style={styles.cartShortcutText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  headerCartButton: {
    padding: 6,
    marginRight: 8,
    position: 'relative',
  },
  headerCartIcon: {
    fontSize: 22,
  },
  headerBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    height: 320,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginTop: 14,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    color: '#315CEB',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  starIcon: {
    color: '#F59E0B',
    fontSize: 14,
    marginRight: 4,
  },
  ratingScore: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 11,
    color: '#78350F',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 28,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: '#315CEB',
  },
  inCartBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  inCartText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 18,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
  },
  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyButtonDisabled: {
    opacity: 0.4,
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    paddingHorizontal: 16,
  },
  toast: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 18,
    alignItems: 'center',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 10,
  },
  bottomPriceContainer: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  bottomPriceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#172554',
  },
  bottomButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addToCartButton: {
    backgroundColor: '#315CEB',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cartShortcutButton: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  cartShortcutText: {
    color: '#315CEB',
    fontSize: 14,
    fontWeight: '700',
  },
});
