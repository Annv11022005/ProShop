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
import { useGetDefaultAddress } from '@/features/address/hooks/useAddress';

const PaymentPage = () => {
  const cart = useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState(cart.paymentMethod || 'Paypal');
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
              <h2 className='text-lg font-semibold'>Select Payment Method</h2>
            </Field>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value)}
            >
              <Field orientation='horizontal' className='items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer'>
                <RadioGroupItem
                  name='paymentMethod'
                  value='COD'
                  id='cod'
                />
                <FieldContent>
                  <FieldLabel htmlFor='cod' className='font-semibold cursor-pointer'>
                    Cash on Delivery (COD)
                  </FieldLabel>
                  <p className='text-xs text-muted-foreground'>
                    Pay with cash directly to the courier when you receive the package.
                  </p>
                </FieldContent>
              </Field>

              <Field orientation='horizontal' className='items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer'>
                <RadioGroupItem
                  name='paymentMethod'
                  value='VNPay'
                  id='VNPay'
                />
                <FieldContent>
                  <FieldLabel htmlFor='VNPay' className='font-semibold cursor-pointer'>
                    VNPay (ATM / QR Pay)
                  </FieldLabel>
                  <p className='text-xs text-muted-foreground'>
                    Pay instantly using domestic bank card or VNPay QR code.
                  </p>
                </FieldContent>
              </Field>

              <Field orientation='horizontal' className='items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer'>
                <RadioGroupItem
                  name='paymentMethod'
                  value='Paypal'
                  id='paypal'
                />
                <FieldContent>
                  <FieldLabel htmlFor='paypal' className='font-semibold cursor-pointer'>
                    PayPal or Credit Card
                  </FieldLabel>
                  <p className='text-xs text-muted-foreground'>
                    Safe payment through PayPal, Visa, Mastercard.
                  </p>
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
