import { Spinner } from '@/components/ui/spinner';
import {
  useDashboardSummary,
  useLowStockProducts,
  useTopProductsAnalytics,
} from '../../hook/useAnalytics';
import { Message } from '@/components/AlertMessage';
import { formatCurrency } from '@/lib/utils';
import DashboardSummaryCards from '../../component/DashboardSummaryCards';
import RevenueChart from '../../component/RevenueChart';
import OrderStatusChart from '../../component/OrderStatusChart';
import { ChartNetwork, ShieldAlert } from 'lucide-react';

const DashboardPage = () => {
  const {
    isPending: pendSummary,
    error: errSummary,
    summary,
  } = useDashboardSummary({ days: 30 });
  const { isPending, error, topProducts } = useTopProductsAnalytics();
  const {
    isPending: pendStock,
    error: errStock,
    lowStockProducts,
  } = useLowStockProducts();

  if (isPending || pendStock || pendSummary) return <Spinner />;

  if (error || errStock || errSummary)
    return (
      <Message>
        {(error || errStock || errSummary)?.message || 'Lỗi tải dữ liệu'}
      </Message>
    );

  return (
    <div className='flex flex-col gap-6 p-2'>
      {/* Top KPI Cards */}
      <DashboardSummaryCards summary={summary} />

      {/* Revenue & Order Status Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <RevenueChart />
        </div>
        <div className='lg:col-span-1'>
          <OrderStatusChart />
        </div>
      </div>

      {/* Top & Stock */}
      <div className='flex items-stretch justify-between gap-10'>
        {/* Top */}
        <div className='w-[50%] p-4 border border-border rounded-lg shadow-xs'>
          <h2 className='text-lg flex items-center gap-2 font-semibold mb-5'>
            <ChartNetwork size={18} />
            Top-selling products
          </h2>

          <div className='flex flex-col gap-3'>
            {topProducts.length === 0 ? (
              <div className='text-md text-muted-foreground text-center font-normal'>
                There is no information yet on best-selling products!
              </div>
            ) : (
              topProducts?.map((product, index) => (
                <div
                  key={product._id}
                  className='flex justify-between text-md font-medium text-primary'
                >
                  <div className='flex gap-2'>
                    <p>{index + 1}.</p>
                    <p>{product.name}</p>
                  </div>
                  <div className='flex items-center gap-5'>
                    <p>{product.orders} orders</p>
                    <p>{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Stock */}
        <div className='w-[50%] max-h-60 overflow-y-scroll p-4 border border-border rounded-lg shadow-xs'>
          <h2 className='text-lg flex items-center gap-3 font-semibold mb-5'>
            <ShieldAlert size={18} />
            Low stock
          </h2>
          <div className='flex flex-col gap-3'>
            {lowStockProducts.length === 0 ? (
              <div className='text-md text-muted-foreground text-center font-normal'>
                No products are running low on stock!
              </div>
            ) : (
              lowStockProducts?.map((product, index) => (
                <div
                  key={product.variantId || index}
                  className='flex items-center justify-between gap-3 text-md font-medium text-primary'
                >
                  <div className='flex items-center gap-2.5 min-w-0'>
                    <p className='shrink-0'>{index + 1}.</p>
                    <p className='truncate'>
                      {product.productName} - {product.color}
                    </p>
                  </div>

                  <span className='shrink-0 text-center text-xs font-semibold rounded-full bg-warning/15 text-warning border border-warning/30 w-15'>
                    Still {product.countInStock}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
