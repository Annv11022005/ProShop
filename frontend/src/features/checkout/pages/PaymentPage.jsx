import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../../cart/cartSlice';

import {
  FieldGroup,
  FieldSet,
  Field,
  FieldContent,
  FieldLabel,
} from '@/components/ui/field';
import StepCheckout from '../components/StepCheckout';
import { Button } from '@/components/ui/button';
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  function submitHandler(e) {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/place-order');
  }

  return (
    <div>
      <StepCheckout step1 step2 step3 />

      <form onSubmit={submitHandler}>
        <FieldSet className='w-full m-3'>
          <FieldGroup>
            <Field>
              <h2 className='text-lg font-semibold'>Select Method</h2>
            </Field>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value)}
            >
              <Field orientation='horizontal'>
                <RadioGroupItem
                  name='paymentMethod'
                  value='Paypal'
                  id='paypal'
                />
                <FieldContent>
                  <FieldLabel htmlFor='paypal'>
                    Paypal or Credit Card
                  </FieldLabel>
                </FieldContent>
              </Field>
            </RadioGroup>

            <Field orientation='horizontal'>
              <Button size='lg' type='submit'>
                Continue
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
};

export default PaymentPage;
