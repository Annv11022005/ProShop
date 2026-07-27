import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import store from './store';

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
import UserEditScreen from '@/screens/admin/UserEditScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path='/' element={<HomeScreen />} />
                <Route path='/product/:slug' element={<ProductScreen />} />
                <Route path='/login' element={<LoginScreen />} />
                <Route path='/register' element={<RegisterScreen />} />
                <Route path='/profile' element={<ProfileScreen />} />

                <Route element={<PrivateRoutes />}>
                  <Route path='/cart' element={<CartScreen />} />
                  <Route path='/shipping' element={<ShippingScreen />} />
                  <Route path='/payment' element={<PaymentScreen />} />
                  <Route path='/place-order' element={<PlaceOrderScreen />} />
                  <Route path='/order/:id' element={<OrderScreen />} />
                </Route>

                <Route element={<AdminRoutes />}>
                  <Route
                    path='/admin/order-list'
                    element={<OrderListScreen />}
                  />
                  <Route
                    path='/admin/product-list'
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
                  <Route path='/admin/user/:id' element={<UserEditScreen />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </PayPalScriptProvider>
    </Provider>
  );
};

export default App;
