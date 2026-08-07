import productRoutes from './productRoutes.js';
import userRoutes from './userRoutes.js';
import orderRoutes from './orderRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import addressRoutes from './addressRoute.js';
import couponRoutes from './couponRoute.js';
import messageRoutes from './messageRoute.js';

const mountRoutes = (app) => {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/orders', orderRoutes);
  app.use('/api/v1/address', addressRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/v1/coupons', couponRoutes);
  app.use('/api/v1/messages', messageRoutes);

  app.get('/api/config/paypal', (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
  });
};

export default mountRoutes;
