import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { setCredentials } from './features/authentication/authSlice';
import { logout } from './features/authentication/authSlice';
import { useEffect } from 'react';
import axios from 'axios';

import AdminRoutes from '@/components/AdminRoutes';
import PrivateRoutes from '@/components/PrivateRoutes';

import AppLayout from '@/components/AppLayout';
import HomeScreen from '@/screens/HomeScreen';
import ProductScreen from '@/screens/ProductScreen';
import CartScreen from '@/screens/CartScreen';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import ShippingScreen from '@/screens/ShippingScreen';
import PaymentScreen from '@/screens/PaymentScreen';
import PlaceOrderScreen from '@/screens/PlaceOrderScreen';
import OrderScreen from '@/screens/OrderScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import OrderListScreen from '@/screens/admin/OrderListScreen';
import ProductListScreen from '@/screens/admin/ProductListScreen';
import ProductEditScreen from '@/screens/admin/ProductEditScreen';
import CreateProductScreen from '@/screens/admin/CreateProductScreen';
import UserListScreen from '@/screens/admin/UserListScreen';
import OTPRegisterScreen from '@/screens/OTPRegisterScreen';
import CouponScreen from '@/screens/CouponScreen';
import VnpaySuccess from '@/features/checkout/pages/VnpaySuccess';
import MessageScreen from '@/screens/admin/MessageScreen';
import CouponListScreen from '@/screens/admin/CouponListScreen';
import CouponEditScreen from '@/screens/admin/CouponEditScreen';
import CreateCouponScreen from '@/screens/admin/CreateCouponScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

const App = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch({ type: 'socket/connect', payload: userInfo._id });
    }

    return () => {
      dispatch({ type: 'socket/disconnect' });
    };
  }, [userInfo, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authUser = params.get('authUser');

    if (authUser) {
      const userData = JSON.parse(decodeURIComponent(authUser));
      dispatch(setCredentials(userData));
      window.history.replaceState({}, '', '/');
    }
  }, [dispatch]);

  // Redux is persisted locally while the JWT is an HTTP-only cookie. Validate
  // the cookie on refresh so a deleted/expired account does not look logged in.
  useEffect(() => {
    if (!userInfo) return;

    axios
      .get('/api/v1/users/profile')
      .then(({ data }) => dispatch(setCredentials(data)))
      .catch(() => dispatch(logout()));
  }, [dispatch, userInfo?._id]);

  return (
    <PayPalScriptProvider deferLoading={true}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path='/' element={<HomeScreen />} />
              <Route path='/page/:pageNumber' element={<HomeScreen />} />
              <Route path='/search/:keyword' element={<HomeScreen />} />
              <Route
                path='/search/:keyword/page/:pageNumber'
                element={<HomeScreen />}
              />
              <Route path='/product/:slug' element={<ProductScreen />} />
              <Route path='/coupon' element={<CouponScreen />} />

              <Route element={<PrivateRoutes />}>
                <Route path='/profile' element={<ProfileScreen />} />
                <Route path='/cart' element={<CartScreen />} />
                <Route path='/shipping' element={<ShippingScreen />} />
                <Route path='/payment' element={<PaymentScreen />} />
                <Route path='/place-order' element={<PlaceOrderScreen />} />
                <Route path='/order/:id' element={<OrderScreen />} />
                <Route path='/vnpay-return' element={<VnpaySuccess />} />
              </Route>
            </Route>

            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/register/verify' element={<OTPRegisterScreen />} />

            <Route element={<AdminRoutes />}>
              <Route path='/admin/order-list' element={<OrderListScreen />} />
              <Route
                path='/admin/product-list'
                element={<ProductListScreen />}
              />
              <Route
                path='/admin/product-list/:pageNumber'
                element={<ProductListScreen />}
              />
              <Route
                path='/admin/product/:id/edit'
                element={<ProductEditScreen />}
              />
              <Route
                path='/admin/product/create'
                element={<CreateProductScreen />}
              />
              <Route path='/admin/user-list' element={<UserListScreen />} />
              <Route path='/admin/coupon-list' element={<CouponListScreen />} />
              <Route
                path='/admin/coupon-list/:pageNumber'
                element={<CouponListScreen />}
              />
              <Route
                path='/admin/coupon/create'
                element={<CreateCouponScreen />}
              />
              <Route
                path='/admin/coupon/:id/edit'
                element={<CouponEditScreen />}
              />
              <Route path='/admin/chat' element={<MessageScreen />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </PayPalScriptProvider>
  );
};

export default App;
