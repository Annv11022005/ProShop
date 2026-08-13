import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from '@/components/reui/frame';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { useCreateCoupon } from '@/features/coupon/hooks/useCoupon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <main className='min-h-screen w-full bg-background'>
      <div className='mx-auto w-full max-w-7xl p-4'>
        <div className='flex flex-col gap-4'>
          <header className='flex justify-between'>
            <h1 className='text-lg font-semibold tracking-tight text-foreground '>
              New coupon
            </h1>
            <div className='flex shrink-0 items-center gap-2'>
              <Button
                variant='outline'
                onClick={() => navigate('/admin/coupon-list')}
              >
                Cancel
              </Button>
              <Button
                variant='default'
                onClick={submitHandler}
                disabled={isPending}
              >
                {isPending && <Spinner className='mr-2 h-4 w-4' />}
                Create Coupon
              </Button>
            </div>
          </header>

          <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]'>
            {/* Left */}
            <div className='flex min-w-0 flex-col gap-4'>
              <Frame dense>
                <FrameHeader>
                  <FrameTitle>General</FrameTitle>
                </FrameHeader>

                <FramePanel>
                  <FieldGroup>
                    <Field orientation='responsive'>
                      <FieldContent>
                        <FieldLabel htmlFor='category' className='text-md'>
                          Category
                        </FieldLabel>
                        <FieldDescription>
                          Storefront display name.
                        </FieldDescription>
                      </FieldContent>
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
                        className='h-8 flex-2 rounded-lg text-sm'
                      />
                    </Field>
                    <FieldSeparator />

                    <Field orientation='responsive'>
                      <FieldContent>
                        <FieldLabel htmlFor='title' className='text-md'>
                          Title
                        </FieldLabel>
                        <FieldDescription>
                          A short tagline under the title.
                        </FieldDescription>
                      </FieldContent>
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
                        className='h-8 flex-2 rounded-lg text-sm'
                      />
                    </Field>
                    <FieldSeparator />

                    <Field orientation='responsive'>
                      <FieldContent>
                        <FieldLabel htmlFor='subtitle' className='text-md'>
                          Subtitle
                        </FieldLabel>
                        <FieldDescription>
                          Storefront display name.
                        </FieldDescription>
                      </FieldContent>
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
                        className='h-8 flex-2 rounded-lg text-sm'
                      />
                    </Field>
                    <FieldSeparator />

                    <Field orientation='responsive'>
                      <FieldContent>
                        <FieldLabel htmlFor='description' className='text-md'>
                          Description
                        </FieldLabel>
                        <FieldDescription>
                          Sales copy for the product page.
                        </FieldDescription>
                      </FieldContent>

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
                        className='h-8 flex-2 rounded-lg text-sm'
                      />
                    </Field>
                  </FieldGroup>
                </FramePanel>
              </Frame>

              <Frame dense>
                <FrameHeader>
                  <FrameTitle>Information</FrameTitle>
                </FrameHeader>

                <FramePanel>
                  <FieldGroup>
                    <Field orientation='responsive'>
                      <FieldContent>
                        <FieldLabel htmlFor='badge' className='text-md'>
                          Badge
                        </FieldLabel>
                        <FieldDescription>
                          Sales copy for the product page.
                        </FieldDescription>
                      </FieldContent>
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
                        className='h-8 flex-2 rounded-lg text-sm'
                      />
                    </Field>
                    <FieldSeparator />

                    <Field orientation='responsive'>
                      <FieldContent>
                        <FieldLabel htmlFor='minSpend' className='text-md'>
                          Min Spend
                        </FieldLabel>
                        <FieldDescription>
                          Sales copy for the product page.
                        </FieldDescription>
                      </FieldContent>
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
                        className='h-8 flex-2 rounded-lg text-sm'
                      />
                    </Field>
                    <FieldSeparator />

                    <Field orientation='responsive'>
                      <FieldContent>
                        <FieldLabel htmlFor='expiry' className='text-md'>
                          expiry
                        </FieldLabel>
                        <FieldDescription>
                          Sales copy for the product page.
                        </FieldDescription>
                      </FieldContent>
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
                        className='h-8 flex-2 rounded-lg text-sm'
                      />
                    </Field>
                    <FieldSeparator />
                  </FieldGroup>
                </FramePanel>
              </Frame>
            </div>

            {/* Right */}
            <div className='flex flex-col gap-4'>
              <Frame dense>
                <FrameHeader>
                  <FrameTitle>Value</FrameTitle>
                </FrameHeader>
                <FramePanel>
                  <FieldGroup>
                    <Field className='max-w-xs'>
                      <FieldContent>
                        <FieldLabel htmlFor='code' className='text-md'>
                          code
                        </FieldLabel>
                        <FieldDescription>
                          Everything must be written in uppercase letters with
                          no spaces.
                        </FieldDescription>
                      </FieldContent>
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
                        className='h-8 rounded-lg text-sm'
                      />
                    </Field>
                    <FieldSeparator />

                    <Field className='max-w-xs'>
                      <FieldContent>
                        <FieldLabel htmlFor='discount-type' className='text-md'>
                          Discount Type
                        </FieldLabel>
                        <FieldDescription>
                          Select one of the two types of values.
                        </FieldDescription>
                      </FieldContent>

                      <RadioGroup
                        value={formData.discountType}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            discountType: value,
                          }))
                        }
                        className='flex flex-row'
                      >
                        <Field orientation='horizontal'>
                          <RadioGroupItem
                            name='discountType'
                            value='percentage'
                            id='percentage'
                          />
                          <FieldContent>
                            <FieldLabel htmlFor='percentage'>
                              Percentage (%)
                            </FieldLabel>
                          </FieldContent>
                        </Field>

                        <Field orientation='horizontal'>
                          <RadioGroupItem
                            name='discountType'
                            value='fixed'
                            id='fixed'
                          />
                          <FieldContent>
                            <FieldLabel htmlFor='fixed'>Fixed</FieldLabel>
                          </FieldContent>
                        </Field>
                      </RadioGroup>
                    </Field>
                    <FieldSeparator />

                    <Field className='max-w-xs'>
                      <FieldContent>
                        <FieldLabel htmlFor='discountValue' className='text-md'>
                          Discount Value
                        </FieldLabel>
                        <FieldDescription>
                          Fill in % if discountType is percentage, fill in the
                          price if discountType is fixed.
                        </FieldDescription>
                      </FieldContent>
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
                        className='h-8 rounded-lg text-sm'
                      />
                    </Field>
                  </FieldGroup>
                </FramePanel>
              </Frame>

              <Frame dense>
                <FrameHeader>
                  <FrameTitle>Coupon Limit</FrameTitle>
                </FrameHeader>
                <FramePanel>
                  <FieldGroup>
                    <Field className='max-w-xs'>
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
                        className='h-8 rounded-lg text-sm'
                      />
                    </Field>
                    <FieldSeparator />

                    <Field className='max-w-xs'>
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
                        className='h-8 rounded-lg text-sm'
                      />
                    </Field>
                  </FieldGroup>
                </FramePanel>
              </Frame>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateCouponPage;
