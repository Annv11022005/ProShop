import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Plus, UploadCloud, X } from 'lucide-react';
import VariantTable from '../../component/VariantTable';
import { SelectPlanItem } from '../../component/SelectPlanItem';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from '@/components/reui/frame';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  useProduct,
  useUpdateProduct,
  useUploadProductImage,
} from '@/features/product/hooks/useProduct';
import { Message as AlertMessage } from '@/components/AlertMessage';

const plans = [
  { name: 'Draft', description: 'Hidden until product details are approved.' },
  { name: 'Active', description: 'Available in selected sales chanel.' },
  { name: 'Schedule', description: 'Public when the launch window opens.' },
];

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [status, setStatus] = useState(plans[0]);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const navigate = useNavigate();

  const {
    isPending: pendProduct,
    error: errProduct,
    data: product,
  } = useProduct(productId);
  const { isPending: pendingUpload, uploadImage } = useUploadProductImage();
  const { isPending, updatedProduct } = useUpdateProduct();

  const matchedPlan = plans.find((p) => p.name === product?.status);

  useEffect(() => {
    if (product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(product?.name);
      setSubtitle(product?.subtitle);
      setDescription(product?.description);
      setCategory(product?.category);
      setBrand(product?.brand);
      setStatus(matchedPlan || plans[0]);
      setImages(
        product?.images || (product?.image ? [{ url: product.image }] : []),
      );
      setVariants(
        product?.variants?.map((v, index) => ({
          id: v._id || Date.now() + index,
          color: v.color || 'Default',
          size: v.size || '—',
          sku: v.sku || '—',
          price: v.price || 0,
          originalPrice: v.originalPrice || 0,
          countInStock: v.countInStock || 0,
        })) || [],
      );
    }
  }, [product, matchedPlan]);

  const addVariant = () =>
    setVariants((v) => [
      ...v,
      {
        id: Date.now(),
        color: 'New color',
        size: '—',
        sku: '—',
        price: 0,
        originalPrice: 0,
        countInStock: 0,
      },
    ]);
  const removeVariant = (id) =>
    setVariants((v) => v.filter((x) => x.id !== id));

  const updateVariant = (id, field, value) => {
    setVariants((v) =>
      v.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const uploadedImages = [];
      for (const file of files) {
        const res = await uploadImage(file);
        uploadedImages.push({ url: res.image, fileId: res.fileId });
      }
      setImages((prev) => [...prev, ...uploadedImages]);
      toast.success('Images uploaded successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  function submitHandler(e) {
    const productData = {
      name,
      subtitle,
      description,
      category,
      brand,
      status: status.name,
      image: images,
      variants: variants.map((v) => {
        const isExistingId = String(v.id).length === 24;

        return {
          ...(isExistingId ? { _id: v.id } : {}),
          sku: v.sku,
          size: v.size,
          color: v.color,
          images: v.images || [],
          price: Number(v.price) || 0,
          originalPrice: Number(v.originalPrice) || Number(v.price) || 0,
          countInStock: Number(v.countInStock) || 0,
        };
      }),
    };
    e.preventDefault();
    updatedProduct(
      { id: productId, data: productData },
      {
        onSuccess: () => {
          toast.success('Product updated!', { position: 'top-center' });
          navigate('/admin/product-list');
        },
      },
    );
  }

  if (pendProduct) return <Spinner />;

  if (errProduct) return <AlertMessage>{errProduct.message}</AlertMessage>;

  return (
    <main className='min-h-screen w-full bg-background'>
      <div className='mx-auto w-full max-w-7xl p-4'>
        <div className='flex flex-col gap-4'>
          <header className='flex justify-between'>
            <h1 className='text-lg font-semibold tracking-tight text-foreground '>
              Update Product
            </h1>
            <div className='flex shrink-0 items-center gap-2'>
              <Button
                variant='outline'
                onClick={() => navigate('/admin/product-list')}
              >
                Cancel
              </Button>
              <Button
                variant='default'
                onClick={submitHandler}
                disabled={isPending}
              >
                {isPending && <Spinner className='mr-2 h-4 w-4' />}
                Update product
              </Button>
            </div>
          </header>
          <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]'>
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
                        <FieldLabel htmlFor='product-description'>
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
                      onChange={uploadFileHandler}
                      disabled={pendingUpload}
                    />
                    <span className='pointer-events-none inline-flex h-7 items-center gap-1 rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground'>
                      {pendingUpload ? (
                        <Spinner className='size-3.5' />
                      ) : (
                        <Plus className='size-3.5' />
                      )}
                      Add files
                    </span>
                    <span className='flex items-center gap-1.5 text-sm text-muted-foreground'>
                      <UploadCloud className='size-4' />
                      {pendingUpload
                        ? 'Uploading...'
                        : 'Drop product photos here or click to browse.'}
                    </span>
                  </label>
                  {images.length > 0 && (
                    <div className='mt-4 grid grid-cols-4 gap-4'>
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className='relative group rounded-md overflow-hidden border border-border'
                        >
                          <img
                            src={img.url}
                            alt={`Preview ${index}`}
                            className='w-full aspect-square object-cover'
                          />
                          <button
                            type='button'
                            onClick={() => removeImage(index)}
                            className='absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                          >
                            <X className='size-3.5 text-foreground' />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </FramePanel>
              </Frame>
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
                  <VariantTable
                    variants={variants}
                    onRemove={removeVariant}
                    onUpdate={updateVariant}
                  />
                </FramePanel>
              </Frame>
            </div>
            <div className='flex flex-col gap-4'>
              <Frame dense>
                <FrameHeader>
                  <FrameTitle>Status</FrameTitle>
                </FrameHeader>
                <FramePanel>
                  <Field className='max-w-xs'>
                    <Select
                      items={plans}
                      value={status}
                      onValueChange={setStatus}
                    >
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

export default ProductEditPage;
