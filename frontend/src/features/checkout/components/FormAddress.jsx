import { Button } from '@/components/ui/button';
import { FieldGroup, FieldSet, Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const FormAddress = ({
  address,
  setAddress,
  city,
  setCity,
  postalCode,
  setPostalCode,
  country,
  setCountry,
  submitHandler,
}) => {
  return (
    <form onSubmit={submitHandler}>
      <FieldSet className='w-full m-3'>
        <FieldGroup>
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
            <Button size='lg' type='submit'>
              Continue
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default FormAddress;
