import { useMemo } from 'react';

const FilterTabs = ({ categories, active, onChange }) => {
  const allCategories = useMemo(() => ['All', ...categories], [categories]);

  return (
    <div
      role='group'
      aria-label='Filter offers by category'
      className='mt-6 flex flex-wrap gap-1.5'
    >
      {allCategories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            type='button'
            aria-pressed={isActive}
            onClick={() => onChange(cat)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:text-primary'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
