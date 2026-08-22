import cron from 'node-cron';
import Order from '../model/orderModel.js';
import { cancelOrderPayment } from '../controller/orderController.js';

export function startReservationCleanupJob() {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const expiredOrders = await Order.find({
        isPaid: false,
        isCancelled: { $ne: true },
        reservationExpiresAt: { $lt: new Date() },
      });

      for (const order of expiredOrders) {
        try {
          await cancelOrderPayment(order._id);
        } catch (err) {
          console.error(`Failed to release order ${order._id}:`, err);
        }
      }
    } catch (err) {
      console.error('Failed to run reservation cleanup job:', err);
    }
  });
}

