import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import useToggle from '@/lib/handleToggle';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const FormInformation = ({
  userInfo,
  name,
  setName,
  email,
  setEmail,
  currentPassword,
  setCurrentPassword,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  submitHandler,
  isPending,
}) => {
  const [isCurrentPassword, handleToggleCurrent] = useToggle(false);
  const [isPassword, handleToggle] = useToggle(false);
  const [isConfirmPassword, handleToggleConfirm] = useToggle(false);

  return (
    <div className='p-4 bg-card border border-border mt-5 shadow-sm rounded-lg'>
      <h2 className='text-lg font-medium text-primary px-5 py-3'>
        Personal information
      </h2>

      <form onSubmit={submitHandler} className='flex flex-col gap-5 px-5'>
        <FieldGroup className='flex flex-row'>
          <Field>
            <FieldLabel htmlFor='name' className='text-md'>
              Name
            </FieldLabel>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
              placeholder='Enter name'
              className='rounded-lg'
            />
          </Field>
          <Field>
            <FieldLabel htmlFor='email' className='text-md'>
              Email address
            </FieldLabel>
            <Input
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='email'
              placeholder='Enter Email'
              className='rounded-lg'
            />
          </Field>
        </FieldGroup>

        <FieldGroup className='flex flex-row'>
          <Field className='w-full'>
            <FieldLabel htmlFor='currentPassword' className='text-md'>
              Current Password
            </FieldLabel>
            <InputGroup className='rounded-lg'>
              <InputGroupInput
                id='currentPassword'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type={isCurrentPassword ? 'text' : 'password'}
                placeholder='Enter current password (required to change password)'
              />
              <InputGroupAddon
                className='cursor-pointer'
                align='inline-end'
                onClick={handleToggleCurrent}
              >
                {!isCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>

        <FieldGroup className='flex flex-row'>
          <Field>
            <FieldLabel htmlFor='password' className='text-md'>
              New Password
            </FieldLabel>
            <InputGroup className='rounded-lg'>
              <InputGroupInput
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={isPassword ? 'text' : 'password'}
                placeholder='Enter new password'
              />
              <InputGroupAddon
                className='cursor-pointer'
                align='inline-end'
                onClick={handleToggle}
              >
                {!isPassword ? <EyeOffIcon /> : <EyeIcon />}
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor='confirmPassword' className='text-md'>
              Confirm New Password
            </FieldLabel>
            <InputGroup className='rounded-lg'>
              <InputGroupInput
                id='confirmPassword'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={isConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm new password'
              />
              <InputGroupAddon
                className='cursor-pointer'
                align='inline-end'
                onClick={handleToggleConfirm}
              >
                {!isConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>

        <Field orientation='horizontal' className='p-2 justify-end'>
          <Button
            size='lg'
            variant='outline'
            onClick={() => {
              setName(userInfo?.name || '');
              setEmail(userInfo?.email || '');
              setCurrentPassword('');
              setPassword('');
              setConfirmPassword('');
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button size='lg' type='submit' disabled={isPending}>
            {isPending ? <Spinner /> : 'Update'}
          </Button>
        </Field>
      </form>
    </div>
  );
};

export default FormInformation;
