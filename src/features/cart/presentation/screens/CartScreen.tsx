import React, { useCallback, useLayoutEffect } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { useCartStore } from '../../../../store/cartStore';
import { CartItem } from '../../../../types/cart';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const CartScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const items = useCartStore(state => state.items);
  const incrementQuantity = useCartStore(state => state.incrementQuantity);
  const decrementQuantity = useCartStore(state => state.decrementQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const clearCart = useCartStore(state => state.clearCart);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handleClearCart = useCallback(() => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => clearCart() },
      ],
    );
  }, [clearCart]);

  const handleCheckout = () => {
    Alert.alert(
      'Order Confirmation',
      `Thank you for your order!\n\nTotal: $${totalPrice.toFixed(2)}\nItems: ${totalItems}`,
      [
        {
          text: 'Great!',
          onPress: () => {
            clearCart();
            navigation.navigate('Home');
          },
        },
      ],
    );
  };

  const renderHeaderRight = useCallback(() => {
    if (items.length === 0) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.headerClearButton}
        onPress={handleClearCart}
      >
        <Text style={styles.headerClearText}>Clear</Text>
      </TouchableOpacity>
    );
  }, [items.length, handleClearCart]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `Cart (${totalItems})`,
      headerTintColor: '#172554',
      headerRight: renderHeaderRight,
    });
  }, [navigation, totalItems, renderHeaderRight]);

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const itemTotal = item.product.price * item.quantity;

    return (
      <View style={styles.cartCard}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProductDetail', { product: item.product })
          }
          style={styles.itemImageContainer}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: item.product.image }}
            style={styles.itemImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.itemDetails}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProductDetail', { product: item.product })
            }
            activeOpacity={0.7}
          >
            <Text style={styles.itemTitle} numberOfLines={2}>
              {item.product.title}
            </Text>
          </TouchableOpacity>

          <Text style={styles.itemUnitPrice}>
            ${item.product.price.toFixed(2)} each
          </Text>

          <View style={styles.itemActionRow}>
            {/* Quantity Controller */}
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => decrementQuantity(item.product.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => incrementQuantity(item.product.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Subtotal */}
            <Text style={styles.itemSubtotal}>${itemTotal.toFixed(2)}</Text>

            {/* Remove item */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeFromCart(item.product.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
        </View>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySubtitle}>
          Looks like you haven't added anything to your cart yet. Explore our
          catalog and find something amazing!
        </Text>
        <TouchableOpacity
          style={styles.shopNowButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.8}
        >
          <Text style={styles.shopNowText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => item.product.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Summary Footer */}
      <View
        style={[
          styles.summaryContainer,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Items</Text>
          <Text style={styles.summaryValue}>{totalItems}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.freeShipping}>FREE</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutText}>
            Proceed to Checkout (${totalPrice.toFixed(2)})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  headerClearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  headerClearText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  cartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    marginRight: 14,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  itemUnitPrice: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
  },
  itemActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    paddingHorizontal: 10,
  },
  itemSubtotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#315CEB',
  },
  deleteButton: {
    padding: 6,
    marginLeft: 6,
  },
  deleteIcon: {
    fontSize: 16,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  freeShipping: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#172554',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#315CEB',
  },
  checkoutButton: {
    backgroundColor: '#315CEB',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F5F6FA',
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#172554',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  shopNowButton: {
    backgroundColor: '#315CEB',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  shopNowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
