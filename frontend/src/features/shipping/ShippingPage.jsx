import { useState } from 'react';
import FormAddress from './FormAddress';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../cart/cartSlice';
import StepCheckout from './StepCheckout';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || '',
  );
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function submitHandler(e) {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  }

  return (
    <div>
      <StepCheckout step2 />

      <FormAddress
        address={address}
        setAddress={setAddress}
        city={city}
        setCity={setCity}
        postalCode={postalCode}
        setPostalCode={setPostalCode}
        country={country}
        setCountry={setCountry}
        submitHandler={submitHandler}
      />
    </div>
  );
};

export default ShippingPage;
