import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useCreateProduct,
  useUploadProductImage,
} from '../product/hooks/useProduct';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Message } from '@/components/AlertMessage';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

const CreateProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    image: '',
    description: '',
    brand: '',
    category: '',
    countInStock: 0,
  });

  const { isPending, error, addProduct } = useCreateProduct();

  const {
    isPending: pendingUpload,
    error: errorUpload,
    uploadImage,
  } = useUploadProductImage();

  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();
    try {
      await addProduct(formData);
      navigate('/admin/product-list');
      toast.success('Product created!', { position: 'top-center' });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message, {
        position: 'top-center',
      });
    }
  }

  if (error) return <Message>{error.message}</Message>;

  async function uploadFileHandler(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image: res.image }));
      toast.success('Image uploaded!', { position: 'top-center' });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message, {
        position: 'top-center',
      });
    }
  }

  return (
    <div>
      <div className='flex w-full justify-center'>
        <Link to='/admin/product-list' className='mr-auto'>
          <Button size='lg'>
            <ChevronLeft />
            Go Back
          </Button>
        </Link>

        <h2 className=' flex-1 text-center font-semibold text-xl'>
          Create Product
        </h2>
      </div>

      <div className='w-150 mx-auto'>
        {isPending ? (
          <Spinner />
        ) : (
          <form onSubmit={submitHandler}>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor='name' className='text-md'>
                    Name Product
                  </FieldLabel>
                  <Input
                    id='name'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    type='text'
                    placeholder='Enter Name Product'
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor='price' className='text-md'>
                    Price Product
                  </FieldLabel>
                  <Input
                    id='price'
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    type='number'
                    placeholder='Enter Price Product'
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor='image' className='text-md'>
                    Image Product
                  </FieldLabel>
                  <div className='flex flex-col items-center gap-3'>
                    <Input
                      id='image'
                      type='file'
                      onChange={uploadFileHandler}
                    />
                    {pendingUpload && <Spinner />}
                    {errorUpload && <Message>{errorUpload.message}</Message>}
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt='preview'
                        className='w-45 rounded-xs'
                      />
                    )}
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor='description' className='text-md'>
                    Description Product
                  </FieldLabel>
                  <Textarea
                    id='description'
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    type='text'
                    placeholder='Enter Description Product'
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor='brand' className='text-md'>
                    Brand Product
                  </FieldLabel>
                  <Input
                    id='brand'
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        brand: e.target.value,
                      }))
                    }
                    type='text'
                    placeholder='Enter Brand Product'
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor='category' className='text-md'>
                    Category Product
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
                    placeholder='Enter Category Product'
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor='countInStock' className='text-md'>
                    Count In Stock
                  </FieldLabel>
                  <Input
                    id='countInStock'
                    value={formData.countInStock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        countInStock: e.target.value,
                      }))
                    }
                    type='text'
                    placeholder='Enter Count In Stock'
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
        )}
      </div>
    </div>
  );
};

export default CreateProductPage;
