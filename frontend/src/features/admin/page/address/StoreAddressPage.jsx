import React, { useState, useEffect } from 'react';
import {
  useGetAllAddress,
  useCreateAddress,
  useUpdateAddress,
} from '@/features/address/hooks/useAddress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Message } from '@/components/AlertMessage';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building2, MapPin, Phone, CheckCircle2, Store } from 'lucide-react';
import { toast } from 'sonner';

export default function StoreAddressPage() {
  const { allAddress, isPending: pendingGet, error } = useGetAllAddress();
  const { addAddress, isPending: pendingAdd } = useCreateAddress();
  const { replaceAddress, isPending: pendingUpdate } = useUpdateAddress();

  const [existingId, setExistingId] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Vietnam');

  useEffect(() => {
    if (allAddress && allAddress.length > 0) {
      // Find default or first address of admin
      const storeAddr = allAddress.find((a) => a.isDefault) || allAddress[0];
      if (storeAddr) {
        setExistingId(storeAddr._id);
        setName(storeAddr.name || '');
        setPhone(storeAddr.phone || '');
        setAddress(storeAddr.address || '');
        setCity(storeAddr.city || '');
        setPostalCode(storeAddr.postalCode || '');
        setCountry(storeAddr.country || 'Vietnam');
      }
    }
  }, [allAddress]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      isDefault: true,
    };

    if (existingId) {
      replaceAddress(
        { id: existingId, data: payload },
        {
          onSuccess: () => {
            toast.success('Store address updated successfully!');
          },
          onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update address.');
          },
        },
      );
    } else {
      addAddress(payload, {
        onSuccess: (data) => {
          setExistingId(data._id);
          toast.success('Store address registered successfully!');
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || 'Failed to save address.');
        },
      });
    }
  };

  if (pendingGet) {
    return (
      <div className='flex items-center justify-center min-h-[50vh]'>
        <Spinner className='size-8' />
      </div>
    );
  }

  if (error) {
    return <Message>{error.message || 'Failed to load store address'}</Message>;
  }

  const isSaving = pendingAdd || pendingUpdate;

  return (
    <div className='space-y-6 max-w-4xl mx-auto py-2'>
      <div className='flex items-center justify-between border-b pb-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground flex items-center gap-2'>
            <Store className='size-6 text-primary' />
            Store Address Management
          </h1>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Configure your official store & warehouse address. This information will appear on customer purchase receipts & PDF invoices.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Form Column */}
        <div className='lg:col-span-2'>
          <Card className='p-6 shadow-xs border-border'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-1.5'>
                <Label htmlFor='storeName' className='text-xs font-semibold'>
                  Store / Business Name *
                </Label>
                <Input
                  id='storeName'
                  placeholder='e.g., ProShop Official Store / ProShop Vietnam'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='storePhone' className='text-xs font-semibold'>
                    Store Contact Phone *
                  </Label>
                  <Input
                    id='storePhone'
                    placeholder='e.g., 0987654321, 1900-1234'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='storeCity' className='text-xs font-semibold'>
                    City / Province *
                  </Label>
                  <Input
                    id='storeCity'
                    placeholder='e.g., Ho Chi Minh City, Ha Noi'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='storeAddress' className='text-xs font-semibold'>
                  Street Address & Warehouse Location *
                </Label>
                <Input
                  id='storeAddress'
                  placeholder='e.g., 123 Dien Bien Phu, Ward 15, Binh Thanh District'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='storePostalCode' className='text-xs font-semibold'>
                    Postal / Zip Code (Optional)
                  </Label>
                  <Input
                    id='storePostalCode'
                    placeholder='e.g., 700000'
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='storeCountry' className='text-xs font-semibold'>
                    Country
                  </Label>
                  <Input
                    id='storeCountry'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

              <div className='pt-3 flex justify-end'>
                <Button type='submit' disabled={isSaving} className='gap-2 font-medium'>
                  <CheckCircle2 className='size-4' />
                  {isSaving
                    ? 'Saving Address...'
                    : existingId
                    ? 'Update Store Address'
                    : 'Save Store Address'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Live Preview Card */}
        <div className='lg:col-span-1'>
          <Card className='p-5 shadow-xs border-border bg-muted/20'>
            <CardHeader className='p-0 pb-3 border-b border-border/60'>
              <CardTitle className='text-sm font-semibold flex items-center gap-1.5'>
                <Building2 className='size-4 text-primary' />
                Invoice Preview
              </CardTitle>
              <p className='text-[11px] text-muted-foreground'>
                How your store appears in "Sold By (Seller)":
              </p>
            </CardHeader>

            <CardContent className='p-0 pt-4 space-y-2 text-xs'>
              <p className='font-bold text-sm text-foreground'>
                {name || 'ProShop Official Store'}
              </p>

              {address ? (
                <div className='space-y-1 text-muted-foreground'>
                  <p className='flex items-start gap-1'>
                    <MapPin className='size-3.5 mt-0.5 shrink-0 text-muted-foreground' />
                    <span>
                      {address}
                      {city ? `, ${city}` : ''}
                      {postalCode ? ` - ${postalCode}` : ''}
                      {country ? `, ${country}` : ''}
                    </span>
                  </p>
                  {phone && (
                    <p className='flex items-center gap-1'>
                      <Phone className='size-3 shrink-0' />
                      <span>{phone}</span>
                    </p>
                  )}
                </div>
              ) : (
                <p className='text-muted-foreground italic text-xs'>
                  Enter details on the left to preview store information.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
