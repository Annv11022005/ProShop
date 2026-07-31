import Filter from '@/components/ui/Filter';
import SortBy from '@/components/ui/SortBy';

const ProductFilter = () => {
  return (
    <div className='flex items-center justify-center gap-4'>
      <Filter
        filterField='stock'
        options={[
          { value: 'all', label: 'All' },
          { value: 'countInStock', label: 'In Stock' },
          { value: 'countOfStock', label: 'Out Of Stock' },
        ]}
      />

      <SortBy
        options={[
          { value: 'price-asc', label: 'Sort by price (low first)' },
          { value: 'price-desc', label: 'Sort by price (high first)' },
          { value: 'rating-asc', label: 'Sort by rating (low first)' },
          { value: 'rating-desc', label: 'Sort by rating (high first)' },
        ]}
      />
    </div>
  );
};

export default ProductFilter;
