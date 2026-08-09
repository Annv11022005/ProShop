import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCreateCoupon } from '@/features/coupon/hooks/useCoupon';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CreateCouponPage = () => {
  const navigate = useNavigate();
  const { isPending, createdCoupon } = useCreateCoupon();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    subtitle: '',
    description: '',
    badge: '',
    minSpend: '',
    expiry: '',
    code: '',
    discountType: '',
    discountValue: '',
    useCount: '',
    usageLimit: '',
    isHidden: false,
  });

  function submitHandler(e) {
    e.preventDefault();

    createdCoupon(formData, {
      onSuccess: () => {
        navigate('/admin/coupon-list');
        toast.success('Coupon created!', { position: 'top-center' });
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || err.message, {
          position: 'top-center',
        });
      },
    });
  }

  return (
    <div>
      <div className='flex w-full justify-center'>
        <Link to='/admin/coupon-list' className='mr-auto'>
          <Button size='lg'>
            <ChevronLeft />
            Go Back
          </Button>
        </Link>

        <h2 className=' flex-1 text-center font-semibold text-xl'>
          Create Coupon
        </h2>
      </div>

      <div className='w-150 mx-auto'>
        <form onSubmit={submitHandler}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='category' className='text-md'>
                  Category
                </FieldLabel>
                <Input
                  id='category'
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  type='text'
                  placeholder='Enter Category'
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='title' className='text-md'>
                  Title
                </FieldLabel>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  type='text'
                  placeholder='Enter title'
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='subtitle' className='text-md'>
                  Subtitle
                </FieldLabel>
                <Input
                  id='subtitle'
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  type='text'
                  placeholder='Enter subtitle'
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='description' className='text-md'>
                  Description
                </FieldLabel>
                <Input
                  id='description'
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  type='text'
                  placeholder='Enter description'
                />
              </Field>
              <Field>
                <FieldLabel htmlFor='badge' className='text-md'>
                  Badge
                </FieldLabel>
                <Input
                  id='badge'
                  value={formData.badge}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      badge: e.target.value,
                    }))
                  }
                  type='text'
                  placeholder='Enter badge'
                />
              </Field>
              <Field>
                <FieldLabel htmlFor='minSpend' className='text-md'>
                  Min Spend
                </FieldLabel>
                <Input
                  id='minSpend'
                  value={formData.minSpend}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minSpend: e.target.value,
                    }))
                  }
                  type='text'
                  placeholder='Enter minSpend'
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='expiry' className='text-md'>
                  expiry
                </FieldLabel>
                <Input
                  id='expiry'
                  value={formData.expiry}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expiry: e.target.value,
                    }))
                  }
                  type='text'
                  placeholder='Enter expiry'
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='code' className='text-md'>
                  code
                </FieldLabel>
                <Input
                  id='code'
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value,
                    }))
                  }
                  type='text'
                  placeholder='Enter code'
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='discountType' className='text-md'>
                  Discount Type
                </FieldLabel>
                <Input
                  id='discountType'
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      discountType: e.target.value,
                    }))
                  }
                  type='text'
                  placeholder='Enter Discount Type'
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='discountValue' className='text-md'>
                  Discount Value
                </FieldLabel>
                <Input
                  id='discountValue'
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      discountValue: e.target.value,
                    }))
                  }
                  type='number'
                  placeholder='Enter Discount Value'
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='useCount' className='text-md'>
                  Use Count
                </FieldLabel>
                <Input
                  id='useCount'
                  value={formData.useCount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      useCount: e.target.value,
                    }))
                  }
                  type='number'
                  placeholder='Enter Use Count'
                />
              </Field>

              <Field>
                <FieldLabel htmlFor='usageLimit' className='text-md'>
                  Usage Limit
                </FieldLabel>
                <Input
                  id='usageLimit'
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      usageLimit: e.target.value,
                    }))
                  }
                  type='number'
                  placeholder='Enter Usage limit'
                />
              </Field>

              <Field orientation='horizontal'>
                <Button size='lg' disabled={isPending} type='submit'>
                  Create
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </div>
    </div>
  );
};

export default CreateCouponPage;
