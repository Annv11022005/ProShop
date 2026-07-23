import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import store from './store';

import AppLayout from '@/components/AppLayout';
import HomeScreen from '@/screens/HomeScreen';
import ProductScreen from '@/screens/ProductScreen';
import CartScreen from '@/screens/CartScreen';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import ShippingScreen from '@/screens/ShippingScreen';
import PrivateRoutes from '@/components/PrivateRoutes';
import PaymentScreen from '@/screens/PaymentScreen';
import PlaceOrderScreen from '@/screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';

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
                <Route path='/product/:id' element={<ProductScreen />} />
                <Route path='/login' element={<LoginScreen />} />
                <Route path='/register' element={<RegisterScreen />} />

                <Route element={<PrivateRoutes />}>
                  <Route path='/cart' element={<CartScreen />} />
                  <Route path='/shipping' element={<ShippingScreen />} />
                  <Route path='/payment' element={<PaymentScreen />} />
                  <Route path='/place-order' element={<PlaceOrderScreen />} />
                  <Route path='/order/:id' element={<OrderScreen />} />
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
