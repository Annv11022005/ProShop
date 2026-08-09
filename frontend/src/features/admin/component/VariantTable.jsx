import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

const VariantTable = ({ variants, onRemove }) => {
  const columns = ['SKU', 'Price', 'Count In Stock', ''];

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
                <TableCell className='px-3 py-2 text-center text-muted-foreground'>
                  {v.sku}
                </TableCell>
                <TableCell className='px-3 py-2 text-center  text-foreground'>
                  {formatCurrency(v.price)}
                </TableCell>
                <TableCell className='px-3 py-2 text-center text-foreground'>
                  {v.countInStock}
                </TableCell>
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
