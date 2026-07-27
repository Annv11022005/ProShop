import { useState } from 'react';
import FormAddress from './FormAddress';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../cart/cartSlice';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
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
    navigate('/profile');
  }

  return (
    <div className='flex flex-col justify-center'>
      <Card className='rounded-none m-3'>
        <CardHeader>
          <CardTitle className='font-semibold'>
            Shipping Address Default
          </CardTitle>
          <CardDescription>
            Nhà riêng, 0915468302, 117 Chu Văn An, Xã Nam Phước, TP Đà Nẵng
          </CardDescription>
          <CardAction className='my-auto'>
            <Button variant='link' onClick={() => setOpen(true)}>
              Change Address
            </Button>
          </CardAction>
        </CardHeader>
      </Card>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className='sm:max-w-160 p-3'
      >
        <Command>
          <CommandList>
            <CommandGroup heading='Shipping Address'>
              <div className='flex flex-row gap-3'>
                <CommandItem className='p-2 mb-2 text-sm font-medium w-125'>
                  Nhà riêng, 0915468302, 117 Chu Văn An, Xã Nam Phước, TP Đà
                  Nẵng
                </CommandItem>
                <Button variant='outline'>Sửa</Button>
                <Button>Xoá</Button>
              </div>

              <div className='flex flex-row gap-3'>
                <CommandItem className='p-2 mb-2 text-sm font-medium w-125'>
                  Công ty, 0915468302, 117 Chu Văn An, Xã Nam Phước, TP Đà Nẵng
                </CommandItem>
                <Button variant='outline'>Sửa</Button>
                <Button>Xoá</Button>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      <FormAddress
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
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
