import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/ui/AppLayout';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path='/' element={<HomeScreen />} />
          <Route path='/product/:id' element={<ProductScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
