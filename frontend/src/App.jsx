import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { setCredentials, logout } from './features/authentication/authSlice';
import { useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { queryClient } from '@/lib/queryClient';
import { Spinner } from '@/components/ui/spinner';

import AdminRoutes from '@/components/AdminRoutes';
import PrivateRoutes from '@/components/PrivateRoutes';
import AppLayout from '@/components/AppLayout';

// Lazy-loaded routes for code-splitting
const HomeScreen = lazy(() => import('@/screens/HomeScreen'));
const ProductScreen = lazy(() => import('@/screens/ProductScreen'));
const CartScreen = lazy(() => import('@/screens/CartScreen'));
const LoginScreen = lazy(() => import('@/screens/LoginScreen'));
const RegisterScreen = lazy(() => import('@/screens/RegisterScreen'));
const ShippingScreen = lazy(() => import('@/screens/ShippingScreen'));
const PaymentScreen = lazy(() => import('@/screens/PaymentScreen'));
const PlaceOrderScreen = lazy(() => import('@/screens/PlaceOrderScreen'));
const OrderScreen = lazy(() => import('@/screens/OrderScreen'));
const ProfileScreen = lazy(() => import('@/screens/ProfileScreen'));
const OrderListScreen = lazy(() => import('@/screens/admin/OrderListScreen'));
const ReturnListScreen = lazy(() => import('@/screens/admin/ReturnListScreen'));
const ProductListScreen = lazy(() => import('@/screens/admin/ProductListScreen'));
const ProductEditScreen = lazy(() => import('@/screens/admin/ProductEditScreen'));
const CreateProductScreen = lazy(() => import('@/screens/admin/CreateProductScreen'));
const UserListScreen = lazy(() => import('@/screens/admin/UserListScreen'));
const OTPRegisterScreen = lazy(() => import('@/screens/OTPRegisterScreen'));
const CouponScreen = lazy(() => import('@/screens/CouponScreen'));
const VnpaySuccess = lazy(() => import('@/features/checkout/pages/VnpaySuccess'));
const MessageScreen = lazy(() => import('@/screens/admin/MessageScreen'));
const CouponListScreen = lazy(() => import('@/screens/admin/CouponListScreen'));
const CouponEditScreen = lazy(() => import('@/screens/admin/CouponEditScreen'));
const CreateCouponScreen = lazy(() => import('@/screens/admin/CreateCouponScreen'));
const DashboardScreen = lazy(() => import('@/screens/admin/DashboardScreen'));
const ForgotPasswordScreen = lazy(() => import('./screens/ForgotPasswordScreen'));
const ResetPasswordScreen = lazy(() => import('./screens/ResetPasswordScreen'));
const NotFoundScreen = lazy(() => import('@/screens/NotFoundScreen'));

const RouteLoadingFallback = () => (
  <div className='flex min-h-[50vh] w-full items-center justify-center py-12'>
    <Spinner className='size-8 text-primary' />
  </div>
);

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

  // Redux is persisted locally while the JWT is an HTTP-only cookie. Validate
  // the cookie on refresh so a deleted/expired account does not look logged in.
  useEffect(() => {
    if (userInfo) {
      axios
        .get('/api/v1/users/profile')
        .then(({ data }) => dispatch(setCredentials(data)))
        .catch(() => dispatch(logout()));
    }
  }, [dispatch, userInfo]);

  return (
    <PayPalScriptProvider deferLoading={true}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <Suspense fallback={<RouteLoadingFallback />}>
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
                <Route path='/coupon/:pageNumber' element={<CouponScreen />} />

                <Route element={<PrivateRoutes />}>
                  <Route path='/profile' element={<ProfileScreen />} />
                  <Route path='/cart' element={<CartScreen />} />
                  <Route path='/shipping' element={<ShippingScreen />} />
                  <Route path='/payment' element={<PaymentScreen />} />
                  <Route path='/place-order' element={<PlaceOrderScreen />} />
                  <Route path='/order/:id' element={<OrderScreen />} />
                  <Route path='/vnpay-return' element={<VnpaySuccess />} />
                </Route>

                {/* 404 Catch-All Route inside AppLayout */}
                <Route path='*' element={<NotFoundScreen />} />
              </Route>

              <Route path='/login' element={<LoginScreen />} />
              <Route path='/register' element={<RegisterScreen />} />
              <Route path='/register/verify' element={<OTPRegisterScreen />} />
              <Route path='/forgot-password' element={<ForgotPasswordScreen />} />
              <Route path='/reset-password' element={<ResetPasswordScreen />} />

              <Route element={<AdminRoutes />}>
                <Route path='/admin' element={<DashboardScreen />} />
                <Route path='/admin/order-list' element={<OrderListScreen />} />
                <Route path='/admin/return-list' element={<ReturnListScreen />} />
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
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </PayPalScriptProvider>
  );
};

export default App;
