import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Trash2, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const EditableCell = ({
  value,
  onSave,
  className,
  isCurrency,
  type = 'text',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVal(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (val !== value) {
      onSave(type === 'number' ? Number(val) : val);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      inputRef.current.blur();
    }
    if (e.key === 'Escape') {
      setVal(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <TableCell className='px-1 py-1'>
        <Input
          ref={inputRef}
          type={type}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className='h-8 text-center text-sm w-full min-w-15'
        />
      </TableCell>
    );
  }

  return (
    <TableCell
      onDoubleClick={() => setIsEditing(true)}
      className={`px-3 py-2 cursor-pointer hover:bg-muted/50 ${className}`}
      title='Double click to edit'
    >
      {isCurrency ? formatCurrency(value) : value}
    </TableCell>
  );
};

const VariantTable = ({
  variants,
  onRemove,
  onUpdate,
  uploadImagesVariants,
  pendingUpload,
  removeVariantImage,
}) => {
  const columns = [
    'size',
    'color',
    'image',
    'SKU',
    'Price',
    'originalPrice',
    'Inventory',
    '',
  ];

  return (
    <div className='w-full rounded-lg border border-border'>
      <Table className='min-w-160 table-fixed'>
        <TableHeader>
          <TableRow className='bg-muted/40 hover:bg-muted/40'>
            {columns.map((col, i) => (
              <TableHead
                key={col + i}
                className='h-10 px-3 whitespace-normal text-center text-[0.8125rem] font-normal text-secondary-foreground/80'
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.length === 0 ? (
            <TableRow className='hover:bg-transparent'>
              <TableCell
                colSpan={columns.length}
                className='py-6 text-center text-sm whitespace-normal text-muted-foreground'
              >
                No variants yet. Add one to get started.
              </TableCell>
            </TableRow>
          ) : (
            variants.map((v) => (
              <TableRow key={v.id}>
                <EditableCell
                  value={v.size}
                  onSave={(val) => onUpdate(v.id, 'size', val)}
                  className='text-center text-muted-foreground'
                />

                <EditableCell
                  value={v.color}
                  onSave={(val) => onUpdate(v.id, 'color', val)}
                  className='text-center text-muted-foreground'
                />

                <TableCell>
                  <input
                    id={`variant-media-${v.id}`}
                    type='file'
                    accept='image/*'
                    className='sr-only'
                    onChange={(e) => uploadImagesVariants(v.id, e)}
                    disabled={pendingUpload}
                  />
                  <label
                    htmlFor={`variant-media-${v.id}`}
                    className='cursor-pointer flex items-center justify-center'
                  >
                    {v.images?.[0] ? (
                      <>
                        <div className='relative group rounded-md overflow-hidden border border-border'>
                          <img
                            src={v.images[0].url}
                            alt={'Preview'}
                            className='size-16 aspect-square object-cover'
                          />
                          <button
                            type='button'
                            onClick={() => removeVariantImage(v._id)}
                            className='absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                          >
                            <X className='size-3.5 text-foreground' />
                          </button>
                        </div>
                      </>
                    ) : (
                      <span className='text-xs text-muted-foreground underline'>
                        Thêm ảnh
                      </span>
                    )}
                  </label>
                </TableCell>

                <EditableCell
                  value={v.sku}
                  onSave={(val) => onUpdate(v.id, 'sku', val)}
                  className='text-center text-muted-foreground'
                />
                <EditableCell
                  type='number'
                  value={v.price}
                  onSave={(val) => onUpdate(v.id, 'price', val)}
                  isCurrency
                  className='text-center text-foreground'
                />
                <EditableCell
                  type='number'
                  value={v.originalPrice}
                  onSave={(val) => onUpdate(v.id, 'originalPrice', val)}
                  isCurrency
                  className='text-center text-foreground'
                />
                <EditableCell
                  type='number'
                  value={v.countInStock}
                  onSave={(val) => onUpdate(v.id, 'countInStock', val)}
                  className='text-center text-foreground'
                />
                <TableCell className='px-3 py-2 text-right last:pr-4'>
                  <Button
                    variant='ghost'
                    size='icon-sm'
                    onClick={() => onRemove(v.id)}
                    aria-label='Remove variant'
                  >
                    <Trash2 className='size-3.5 text-muted-foreground' />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VariantTable;
