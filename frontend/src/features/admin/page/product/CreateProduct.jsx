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
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { SelectPlanItem } from '../../component/SelectPlanItem';
import VariantTable from '../../component/VariantTable';

const plans = [
  {
    name: 'Draft',
    description: 'Hidden until product details are approved.',
  },
  {
    name: 'Active',
    description: 'Available in selected sales chanel.',
  },
  {
    name: 'Schedule',
    description: 'Public when the launch window opens.',
  },
];

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [variants, setVariants] = useState([
    {
      id: 1,
      sku: 'AFR-CHR-M',
      price: '100000',
      countInStock: 42,
    },
    {
      id: 2,
      sku: 'AFR-CHR-L',
      price: '100000',
      countInStock: 17,
    },
  ]);

  const addVariant = () =>
    setVariants((v) => [
      ...v,
      {
        id: Date.now(),
        color: 'New color',
        size: '—',
        sku: '—',
        price: '$0.00',
        inventory: 0,
      },
    ]);

  const removeVariant = (id) =>
    setVariants((v) => v.filter((x) => x.id !== id));

  return (
    <main className='min-h-screen w-full bg-background'>
      <div className='mx-auto w-full max-w-7xl p-4'>
        <div className='flex flex-col gap-4'>
          {/* Header */}
          <header className='flex justify-between'>
            <h1 className='text-lg font-semibold tracking-tight text-foreground '>
              New product
            </h1>
            <div className='flex shrink-0 items-center gap-2'>
              <Button variant='outline'>Cancel</Button>
              <Button variant='default'>Create product</Button>
            </div>
          </header>

          {/* Content */}
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
                        <FieldLabel htmlFor='product-title'>
                          Name Product
                        </FieldLabel>
                        <FieldDescription>
                          Storefront display name.
                        </FieldDescription>
                      </FieldContent>
                      <Input
                        id='product-title'
                        placeholder='e.g. AeroFlex Runner'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='h-8 flex-2 rounded-lg text-sm'
                        required
                      />
                    </Field>

                    <FieldSeparator />
                    <Field orientation='responsive'>
                      <FieldContent>
                        <FieldLabel htmlFor='product-subtitle'>
                          Subtitle
                        </FieldLabel>
                        <FieldDescription>
                          A short tagline under the title.
                        </FieldDescription>
                      </FieldContent>
                      <Input
                        id='product-subtitle'
                        placeholder='Optional'
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className='h-8 flex-2 rounded-lg text-sm'
                        required
                      />
                    </Field>

                    <FieldSeparator />
                    <Field orientation='responsive'>
                      <FieldContent>
                        <FieldLabel htmlFor='product-subtitle'>
                          Description
                        </FieldLabel>
                        <FieldDescription>
                          Sales copy for the product page.
                        </FieldDescription>
                      </FieldContent>
                      <Textarea
                        id='product-description'
                        placeholder='Responsive knit running shoe with a cushioned midsole...'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='h-8 flex-2 rounded-lg text-sm'
                        required
                      />
                    </Field>
                  </FieldGroup>
                </FramePanel>
              </Frame>

              {/* Media */}
              <Frame dense>
                <FrameHeader>
                  <FrameTitle>Media</FrameTitle>
                </FrameHeader>
                <FramePanel>
                  <label
                    htmlFor='product-media'
                    className='flex min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-muted-foreground/25 p-4 transition-colors hover:border-muted-foreground/50'
                  >
                    <input
                      id='product-media'
                      type='file'
                      accept='image/*'
                      multiple
                      className='sr-only'
                    />
                    <span className='pointer-events-none inline-flex h-7 items-center gap-1 rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground'>
                      <Plus className='size-3.5' />
                      Add files
                    </span>
                    <span className='flex items-center gap-1.5 text-sm text-muted-foreground'>
                      <UploadCloud className='size-4' />
                      Drop product photos here or click to browse.
                    </span>
                  </label>
                </FramePanel>
              </Frame>

              {/* Variants */}
              <Frame dense>
                <FrameHeader>
                  <FrameTitle>Variants</FrameTitle>
                </FrameHeader>
                <FramePanel className='flex flex-col gap-3'>
                  <div className='flex items-center justify-end gap-3'>
                    <Button variant='outline' onClick={addVariant}>
                      <Plus className='size-4' />
                      Add variant
                    </Button>
                  </div>
                  <VariantTable variants={variants} onRemove={removeVariant} />
                </FramePanel>
              </Frame>
            </div>

            {/* Right  */}
            <div className='flex flex-col gap-4'>
              {/* Status */}
              <Frame dense>
                <FrameHeader>
                  <FrameTitle>Status</FrameTitle>
                </FrameHeader>
                <FramePanel>
                  <Field className='max-w-xs'>
                    <Select items={plans}>
                      <SelectTrigger className='h-auto! w-full'>
                        <SelectValue>
                          {(value) => <SelectPlanItem plan={value} />}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        <SelectGroup>
                          {plans.map((plan) => (
                            <SelectItem key={plan.name} value={plan}>
                              <SelectPlanItem plan={plan} />
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </FramePanel>
              </Frame>

              {/* Organization */}
              <Frame dense>
                <FrameHeader>
                  <FrameTitle>Organization</FrameTitle>
                </FrameHeader>
                <FramePanel>
                  <FieldGroup className='gap-4'>
                    <Field>
                      <FieldLabel htmlFor='product-category'>
                        Category
                      </FieldLabel>
                      <Input
                        id='product-category'
                        placeholder='Category'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className='h-8 rounded-lg text-sm'
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor='product-brand'>Brand</FieldLabel>
                      <Input
                        id='product-brand'
                        placeholder='Brand'
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
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

export default CreateProduct;
