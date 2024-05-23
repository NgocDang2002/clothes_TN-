  // Import các thư viện cần thiết
  const mongoose = require('mongoose');
  const slug = require('mongoose-slug-updater');
  const Schema = mongoose.Schema;
  const AutoIncrement = require('mongoose-sequence')(mongoose);

  // Kích hoạt plugin slug
  mongoose.plugin(slug);


  // Định nghĩa schema cho collection OrderListUser
  const OrderListUserSchema = new Schema(
    {
      // Thông tin của người đặt hàng
      userid: { type: String, required: true },
      username: { type: String, required: true },
      useraddress: { type: String, required: true },
      phoneuser: { type: String, required: true },
      emailuser: { type: String, required: true },
      // Danh sách các sản phẩm trong đơn hàng
      productsid: [
        {
          productId: { type: String, required: true },
          quantity: { type: Number, required: true },
          size: { type: String, required: true },
          color: { type: String, required: true }
        }
      ],
      totalorder: { type: Number, required: true }, // Tổng giá trị đơn hàng
      note: { type: String, trim: true }, // Ghi chú của người đặt hàng
      slug: { type: String, slug: ["userid", "username"], unique: true } // Slug dùng cho đường dẫn tới đơn hàng
    },
    {
      timestamps: true // Thêm các trường thời gian tự động (createdAt, updatedAt)
    }
  );



  // Xuất model OrderListUser dựa trên schema đã định nghĩa
  module.exports = mongoose.model('OrderListUser', OrderListUserSchema);
