import mongoose from 'mongoose';

const returnRequestSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['RETURN_REFUND', 'EXCHANGE'],
      required: true,
      default: 'RETURN_REFUND',
    },
    reason: {
      type: String,
      enum: [
        'DAMAGED_DEFECTIVE', // Hàng bể vỡ, lỗi kỹ thuật
        'WRONG_ITEM',        // Giao sai sản phẩm / màu sắc / kích thước
        'NOT_AS_DESCRIBED',  // Không giống mô tả / hình ảnh
        'CHANGE_OF_MIND',    // Khách đổi ý
        'OTHER',             // Lý do khác
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      validate: [
        (val) => val && val.length > 0,
        'At least one proof image is required',
      ],
    },
    refundAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    bankInfo: {
      bankName: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      accountHolder: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: [
        'PENDING_APPROVAL', // Chờ Admin xét duyệt
        'APPROVED',         // Admin duyệt, hướng dẫn khách gửi hàng
        'REJECTED',         // Admin từ chối yêu cầu
        'RETURNING',        // Khách đã gửi bưu cục, đang trên đường về kho
        'RECEIVED',         // Kho đã nhận kiện hàng
        'COMPLETED',        // Đã hoàn tiền / đổi hàng xong
        'CANCELLED',        // Khách tự hủy yêu cầu
      ],
      default: 'PENDING_APPROVAL',
      index: true,
    },
    returnTracking: {
      carrier: { type: String, trim: true },       // Đơn vị vận chuyển (GHTK, Viettel Post, v.v.)
      trackingCode: { type: String, trim: true },  // Mã vận đơn gửi trả
      shippedAt: { type: Date },
      note: { type: String, trim: true },
    },
    adminReview: {
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reviewedAt: { type: Date },
      rejectReason: { type: String, trim: true },
      warehouseAddress: { type: String, trim: true },
      instructions: { type: String, trim: true },
    },
    restock: {
      type: Boolean,
      default: true,
    },
    completedAt: {
      type: Date,
    },
    timeline: [
      {
        status: { type: String, required: true },
        note: { type: String },
        updatedAt: { type: Date, default: Date.now },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

returnRequestSchema.index({ order: 1, status: 1 });
returnRequestSchema.index({ user: 1, createdAt: -1 });

const ReturnRequest = mongoose.model('ReturnRequest', returnRequestSchema);

export default ReturnRequest;
