import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addDecimals, updateCart } from '../cartUtils';

describe('cartUtils', () => {
  beforeEach(() => {
    // Mock localStorage
    const store = {};
    vi.stubGlobal('localStorage', {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = String(value);
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        for (const key of Object.keys(store)) {
          delete store[key];
        }
      },
    });
  });

  describe('addDecimals', () => {
    it('should format numbers with 2 decimal places', () => {
      expect(addDecimals(10)).toBe('10.00');
      expect(addDecimals(10.5)).toBe('10.50');
      expect(addDecimals(10.556)).toBe('10.56');
      expect(addDecimals(0)).toBe('0.00');
    });
  });

  describe('updateCart', () => {
    it('should calculate empty cart correctly', () => {
      const state = {
        cartItems: [],
        coupon: null,
      };

      const result = updateCart(state);
      expect(result.itemsPrice).toBe('0.00');
      expect(result.shippingPrice).toBe('30000.00');
      expect(result.taxPrice).toBe('0.00');
      expect(result.discount).toBe('0.00');
      expect(result.totalPrice).toBe('30000.00');
    });

    it('should calculate itemsPrice correctly with multiple items and quantities', () => {
      const state = {
        cartItems: [
          { price: 100000, qty: 2 },
          { price: 50000, qty: 3 },
        ],
        coupon: null,
      };

      const result = updateCart(state);
      // 100,000 * 2 + 50,000 * 3 = 350,000
      expect(result.itemsPrice).toBe('350000.00');
      // Below 500,000 VND -> shipping is 30,000
      expect(result.shippingPrice).toBe('30000.00');
      // 15% tax on 350,000 = 52,500
      expect(result.taxPrice).toBe('52500.00');
      // Total = 350,000 + 30,000 + 52,500 = 432,500
      expect(result.totalPrice).toBe('432500.00');
    });

    it('should grant free shipping when itemsPrice exceeds 500,000 VND', () => {
      const state = {
        cartItems: [{ price: 600000, qty: 1 }],
        coupon: null,
      };

      const result = updateCart(state);
      expect(result.itemsPrice).toBe('600000.00');
      expect(result.shippingPrice).toBe('0.00');
      // 15% tax on 600,000 = 90,000
      expect(result.taxPrice).toBe('90000.00');
      expect(result.totalPrice).toBe('690000.00');
    });

    it('should calculate percentage coupon discount correctly', () => {
      const state = {
        cartItems: [{ price: 1000000, qty: 1 }],
        coupon: {
          discountType: 'percentage',
          discountValue: 20, // 20%
        },
      };

      const result = updateCart(state);
      expect(result.itemsPrice).toBe('1000000.00');
      expect(result.shippingPrice).toBe('0.00');
      expect(result.taxPrice).toBe('150000.00');
      // 20% discount on 1,000,000 = 200,000
      expect(result.discount).toBe('200000.00');
      // Total = 1,000,000 + 0 + 150,000 - 200,000 = 950,000
      expect(result.totalPrice).toBe('950000.00');
    });

    it('should calculate fixed coupon discount correctly', () => {
      const state = {
        cartItems: [{ price: 400000, qty: 1 }],
        coupon: {
          discountType: 'fixed',
          discountValue: 50000, // 50,000 VND
        },
      };

      const result = updateCart(state);
      expect(result.itemsPrice).toBe('400000.00');
      expect(result.shippingPrice).toBe('30000.00');
      expect(result.taxPrice).toBe('60000.00');
      expect(result.discount).toBe('50000.00');
      // Total = 400,000 + 30,000 + 60,000 - 50,000 = 440,000
      expect(result.totalPrice).toBe('440000.00');
    });

    it('should clamp total price to 0 and not produce negative total', () => {
      const state = {
        cartItems: [{ price: 50000, qty: 1 }],
        coupon: {
          discountType: 'fixed',
          discountValue: 999999,
        },
      };

      const result = updateCart(state);
      expect(Number(result.totalPrice)).toBeGreaterThanOrEqual(0);
    });

    it('should persist cart without coupon or discount in localStorage', () => {
      const state = {
        cartItems: [{ _id: 'item-1', price: 100000, qty: 1 }],
        coupon: { code: 'SAVE20' },
        discount: 20000,
        paymentMethod: 'Paypal',
      };

      updateCart(state);
      const stored = JSON.parse(localStorage.getItem('cart'));
      expect(stored).toBeDefined();
      expect(stored.cartItems).toHaveLength(1);
      expect(stored.coupon).toBeUndefined();
      expect(stored.discount).toBeUndefined();
    });
  });
});
