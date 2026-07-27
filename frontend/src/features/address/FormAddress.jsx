import { Button } from '@/components/ui/button';
import { FieldGroup, FieldSet, Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const FormAddress = ({
  action = 'create',
  name,
  setName,
  phone,
  setPhone,
  address,
  setAddress,
  city,
  setCity,
  postalCode,
  setPostalCode,
  country,
  setCountry,
  submitHandler,
  isSubmitting,
}) => {
  return (
    <form onSubmit={submitHandler}>
      <FieldSet className='w-full m-3'>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='name' className='text-md'>
              Name
            </FieldLabel>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
              placeholder='VD: nhà riêng, công ty, ...'
            />
          </Field>

          <Field>
            <FieldLabel htmlFor='phone' className='text-md'>
              Phone
            </FieldLabel>
            <Input
              id='phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type='text'
              placeholder='0915 xxx xxx'
            />
          </Field>

          <Field>
            <FieldLabel htmlFor='address' className='text-md'>
              Address
            </FieldLabel>
            <Input
              id='address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type='text'
              placeholder='Enter address'
            />
          </Field>

          <Field>
            <FieldLabel htmlFor='city' className='text-md'>
              City
            </FieldLabel>
            <Input
              id='city'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              type='text'
              placeholder='Enter city'
            />
          </Field>

          <Field>
            <FieldLabel htmlFor='postalCode' className='text-md'>
              Postal Code
            </FieldLabel>
            <Input
              id='postalCode'
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              type='text'
              placeholder='Enter Postal Code'
            />
          </Field>

          <Field>
            <FieldLabel htmlFor='country' className='text-md'>
              Country
            </FieldLabel>
            <Input
              id='country'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              type='text'
              placeholder='Enter country'
            />
          </Field>

          <Field orientation='horizontal'>
            <Button size='lg' disabled={isSubmitting} type='submit'>
              {action === 'create'
                ? 'Create Shipping Address'
                : 'Save Shipping Address'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default FormAddress;
