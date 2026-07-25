import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
  uploadProductImage,
} from '../api/apiProducts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useProduct(productId) {
  const {
    isPending,
    error,
    data: product,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
    retry: false,
  });

  return { isPending, error, data: product };
}

export function useCreateProduct() {
  const {
    isPending,
    error,
    mutateAsync: addProduct,
  } = useMutation({
    mutationFn: (data) => createProduct(data),
  });

  return { isPending, error, addProduct };
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  const {
    isPending,
    error,
    mutateAsync: updatedProduct,
  } = useMutation({
    mutationFn: ({ id, data }) => updateProduct({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // nếu có list page
    },
  });

  return { isPending, error, updatedProduct };
}

export function useUploadProductImage() {
  const {
    isPending,
    error,
    mutateAsync: uploadImage,
  } = useMutation({
    mutationFn: (data) => uploadProductImage(data),
  });

  return { isPending, error, uploadImage };
}

export function useDeleteProduct() {
  const {
    isPending,
    error,
    mutateAsync: deletedProduct,
  } = useMutation({
    mutationFn: (id) => deleteProduct(id),
  });

  return { isPending, error, deletedProduct };
}
