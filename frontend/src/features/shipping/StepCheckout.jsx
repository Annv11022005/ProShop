import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';

const StepCheckout = ({ step1, step2, step3, step4 }) => {
  return (
    <div className='w-full flex items-center justify-center py-2'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {step1 ? (
              <BreadcrumbLink render={<Link to='/' />}>Sign In</BreadcrumbLink>
            ) : (
              <BreadcrumbPage className='text-muted-foreground'>
                Sign In
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            {step2 ? (
              <BreadcrumbLink render={<Link to='/shipping' />}>
                Shipping
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className='text-muted-foreground'>
                Shipping
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            {step3 ? (
              <BreadcrumbLink render={<Link to='/payment' />}>
                Payment
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className='text-muted-foreground'>
                Payment
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            {step4 ? (
              <BreadcrumbLink render={<Link to='/place-order' />}>
                Place Order
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className='text-muted-foreground'>
                Place Order
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default StepCheckout;
