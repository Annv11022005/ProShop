import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { useGetDefaultAddress } from '@/features/address/hooks/useAddress';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const { currentAddress, isPending } = useGetDefaultAddress();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPending) return;
    if (!currentAddress) {
      navigate('/shipping', { state: { action: 'create' } });
    }
  }, [navigate, currentAddress, isPending]);

  function submitHandler(e) {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/place-order');
  }

  return (
    <div>
      <StepCheckout step1 step2 />

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

              <Field orientation='horizontal'>
                <RadioGroupItem name='paymentMethod' value='VNPay' id='VNPay' />
                <FieldContent>
                  <FieldLabel htmlFor='VNPay'>VNPay</FieldLabel>
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
