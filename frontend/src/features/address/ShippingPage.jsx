import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCreateAddress, useUpdateAddress } from './hooks/useAddress';

import FormAddress from './FormAddress';
import { Message } from '@/components/ui/Message';
import { toast } from 'sonner';

const ShippingPage = () => {
  const [action, setAction] = useState('');
  const location = useLocation();

  const {
    isPending: pendingAdd,
    error: errAdd,
    addAddress,
  } = useCreateAddress();

  const {
    isPending: pendingUp,
    error: errUp,
    replaceAddress,
  } = useUpdateAddress();

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const st = location.state;
    if (!st) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAction(st.action);
    if (st.action === 'update' && st.address) {
      const a = st.address;
      setEditingId(a._id);
      setName(a.name);
      setPhone(a.phone);
      setAddress(a.address);
      setCity(a.city);
      setPostalCode(a.postalCode);
      setCountry(a.country);
      setIsDefault(a.isDefault);
    }
  }, [location.state]);

  function submitHandler(e) {
    e.preventDefault();

    if (action === 'create') {
      addAddress(
        { name, phone, address, city, postalCode, country },
        {
          onSuccess: () => {
            setAction('');
            navigate('/profile');
          },
          onError: (err) => {
            toast(err.response?.data?.message, { position: 'top-center' });
          },
        },
      );
    } else if (action === 'update') {
      replaceAddress(
        {
          id: editingId,
          data: { name, phone, address, city, postalCode, country, isDefault },
        },
        {
          onSuccess: () => {
            setAction('');
            setEditingId(null);
            navigate('/profile');
            toast.success('Address updated successfully', {
              position: 'top-center',
            });
          },
          onError: (err) => {
            toast(err.response?.data?.message, { position: 'top-center' });
          },
        },
      );
    }
  }

  if (errAdd || errUp) {
    return <Message>{errAdd?.message || errUp?.message}</Message>;
  }

  return (
    <div className='flex flex-col justify-center'>
      {(action === 'create' || action === 'update') && (
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
          isDefault={isDefault}
          setIsDefault={setIsDefault}
          submitHandler={submitHandler}
          action={action}
          isSubmitting={pendingAdd || pendingUp}
        />
      )}
    </div>
  );
};

export default ShippingPage;
