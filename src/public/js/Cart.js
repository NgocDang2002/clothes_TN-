document.addEventListener('DOMContentLoaded', function() {
    var UpdateForm = document.getElementById('Update-CartProducts-from');

    document.querySelectorAll('.increase-qty').forEach(button => {
        button.addEventListener('click', function() {
            let cartId = this.getAttribute('data-cart-id');
            if (!cartId) return; // Kiểm tra xem cartId có tồn tại không
            let quantityElement = this.parentNode.querySelector('.quantity');
            let currentQuantity = parseInt(quantityElement.textContent);
            let newQuantity = currentQuantity + 1;

            let cartElement = this.closest('tr');
            if (cartElement) {
                let unitPriceElement = cartElement.querySelector('.unit-price');
                if (unitPriceElement) {
                    let unitPriceText = unitPriceElement.textContent;
                    let unitPrice = parseFloat(unitPriceText);
                    let newTotalMoney = newQuantity * unitPrice;

                    let sizeElement = cartElement.querySelector('.size');
                    let colorElement = cartElement.querySelector('.color');

                    // Lấy giá trị size và color từ các phần tử HTML
                    let size = sizeElement ? sizeElement.textContent.trim().replace('Size: ', '') : ''; 
                    let color = colorElement ? colorElement.textContent.trim().replace('Color: ', '') : '';

                    document.getElementById('newTotalMoneyInput').value = newTotalMoney;
                    document.getElementById('newQuantityInput').value = newQuantity;
                    document.getElementById('productSizeInput').value = size;
                    document.getElementById('productColorInput').value = color;

                    UpdateForm.action = 'carts/' + cartId + '?_method=PATCH';
                    UpdateForm.submit();
                }
            }
        });
    });

    document.querySelectorAll('.decrease-qty').forEach(button => {
        button.addEventListener('click', function() {
            let cartId = this.getAttribute('data-cart-id');
            if (!cartId) return; // Kiểm tra xem cartId có tồn tại không
            let quantityElement = this.parentNode.querySelector('.quantity');
            let currentQuantity = parseInt(quantityElement.textContent);
            let newQuantity = currentQuantity - 1;
            if (newQuantity < 0) return;

            let cartElement = this.closest('tr');
            if (cartElement) {
                let unitPriceElement = cartElement.querySelector('.unit-price');
                if (unitPriceElement) {
                    let unitPriceText = unitPriceElement.textContent;
                    let unitPrice = parseFloat(unitPriceText);
                    let newTotalMoney = newQuantity * unitPrice;

                    let sizeElement = cartElement.querySelector('.size');
                    let colorElement = cartElement.querySelector('.color');

                    // Lấy giá trị size và color từ các phần tử HTML
                    let size = sizeElement ? sizeElement.textContent.trim().replace('Size: ', '') : ''; 
                    let color = colorElement ? colorElement.textContent.trim().replace('Color: ', '') : '';

                    document.getElementById('newTotalMoneyInput').value = newTotalMoney;
                    document.getElementById('newQuantityInput').value = newQuantity;
                    document.getElementById('productSizeInput').value = size;
                    document.getElementById('productColorInput').value = color;

                    UpdateForm.action = 'carts/' + cartId + '?_method=PATCH';
                    UpdateForm.submit();
                }
            }
        });
    });
});











// document.addEventListener('DOMContentLoaded', function() {
//     var cartId;
//     document.querySelectorAll('.increase-qty').forEach(button => {
//         button.addEventListener('click', function() {
//             // Lấy phần tử chứa số lượng hiện tại
//             let quantityElement = this.parentNode.querySelector('.quantity');
//             // Lấy số lượng hiện tại, chuyển đổi nó sang số nguyên.
//             let currentQuantity = parseInt(quantityElement.textContent);
//             // Tăng số lượng hiện tại lên 1 và cập nhật lại nội dung text của phần tử đó.
//             let newQuantity = currentQuantity + 1;

//             // Lấy phần tử cha chứa thông tin cart
//             let cartElement = this.closest('tr');
//             if (cartElement) {
//                 // Lấy giá trị của thuộc tính data-id
//                 cartId = cartElement.getAttribute('data-id');

//                 // Lấy phần tử hiển thị giá sản phẩm
//                 let unitPriceElement = cartElement.querySelector('.unit-price');
//                 if (unitPriceElement) {
//                     // Lấy giá sản phẩm từ nội dung văn bản của phần tử
//                     let unitPriceText = unitPriceElement.textContent;
//                     // Chuyển đổi giá sản phẩm từ chuỗi sang số
//                     let unitPrice = parseFloat(unitPriceText);
//                     let newTotalMoney = newQuantity * unitPrice;

//                     // Lấy Size và Color từ thuộc tính value
//                     let sizeElement = cartElement.querySelector('.size');
//                     let colorElement = cartElement.querySelector('.color');
//                     let size = sizeElement ? sizeElement.getAttribute('value').trim() : '';
//                     let color = colorElement ? colorElement.getAttribute('value').trim() : '';
                    
//                     // Cập nhật giá trị của các trường ẩn trong form
//                     document.getElementById('newTotalMoneyInput').value = newTotalMoney;
//                     document.getElementById('newQuantityInput').value = newQuantity;
//                     document.getElementById('productSizeInput').value = size;
//                     document.getElementById('productColorInput').value = color;

//                     // Gửi form lên server
//                     UpdateForm.action = 'carts/' + cartId + '?_method=PATCH';
//                     UpdateForm.submit();
//                 }
//             }
//         });
//     });
//     document.querySelectorAll('.decrease-qty').forEach(button => {
//         button.addEventListener('click', function() {
//             // Lấy phần tử chứa số lượng hiện tại
//             let quantityElement = this.parentNode.querySelector('.quantity');
//             // Lấy số lượng hiện tại, chuyển đổi nó sang số nguyên.
//             let currentQuantity = parseInt(quantityElement.textContent);
//             // Tăng số lượng hiện tại lên 1 và cập nhật lại nội dung text của phần tử đó.
//             let newQuantity = currentQuantity - 1;

//             // Lấy phần tử cha chứa thông tin cart
//             let cartElement = this.closest('tr');
//             if (cartElement) {
//                 // Lấy giá trị của thuộc tính data-id
//                 cartId = cartElement.getAttribute('data-id');

//                 // Lấy phần tử hiển thị giá sản phẩm
//                 let unitPriceElement = cartElement.querySelector('.unit-price');
//                 if (unitPriceElement) {
//                     // Lấy giá sản phẩm từ nội dung văn bản của phần tử
//                     let unitPriceText = unitPriceElement.textContent;
//                     // Chuyển đổi giá sản phẩm từ chuỗi sang số
//                     let unitPrice = parseFloat(unitPriceText);
//                     let newTotalMoney = newQuantity * unitPrice;

//                     // Lấy Size và Color từ thuộc tính value
//                     let sizeElement = cartElement.querySelector('.size');
//                     let colorElement = cartElement.querySelector('.color');
//                     let size = sizeElement ? sizeElement.getAttribute('value').trim() : '';
//                     let color = colorElement ? colorElement.getAttribute('value').trim() : '';

//                     // Cập nhật giá trị của các trường ẩn trong form
//                     document.getElementById('newTotalMoneyInput').value = newTotalMoney;
//                     document.getElementById('newQuantityInput').value = newQuantity;
//                     document.getElementById('productSizeInput').value = size;
//                     document.getElementById('productColorInput').value = color;

//                     // Gửi form lên server
//                     UpdateForm.action = 'carts/' + cartId + '?_method=PATCH';
//                     UpdateForm.submit();
//                 }
//             }
//         });
//     });

// });



// khi chọn sản phẩm số tiền hiện thanh toán tăng lên
document.addEventListener("DOMContentLoaded", function() {
    const checkboxes = document.querySelectorAll('.product-checkbox');
    const totalPaymentCell = document.querySelector('#total-payment');

    // Tạo một biến để lưu tổng số tiền
    let totalPayment = 0;

    // Lặp qua mỗi checkbox
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            // Lấy dòng của sản phẩm tương ứng
            const row = this.closest('tr');
            
            // Lấy giá tiền của sản phẩm và số lượng
            const unitPrice = parseFloat(row.querySelector('.unit-price').innerText);
            const quantity = parseInt(row.querySelector('.quantity').innerText);

            // Nếu checkbox được chọn, thêm giá tiền của sản phẩm vào tổng số tiền
            if (this.checked) {
                totalPayment += unitPrice * quantity;
            } else { // Nếu checkbox không được chọn, trừ giá tiền của sản phẩm khỏi tổng số tiền
                totalPayment -= unitPrice * quantity;
            }

            // Hiển thị tổng số tiền đã cập nhật
            totalPaymentCell.innerText = totalPayment.toLocaleString() + ' VND';
        });
    });
});

// chuyển giữ liệu từ cart lên qua bên thanh toán
document.addEventListener("DOMContentLoaded", function() {
    const checkboxes = document.querySelectorAll('.product-checkbox');
    const totalAmountElement = document.getElementById('totalAmount');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            let totalAmount = 0;

            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    const row = checkbox.closest('tr');
                    const totalPrice = parseFloat(row.querySelector('.total-price').innerText);
                    totalAmount += totalPrice;
                }
            });

            totalAmountElement.innerText = `${totalAmount} VND`;
        });
    });
});


//     // Thực hiện tính toán và cập nhật phí thu hộ
//     function calculateShippingFee() {
//         // Lấy tất cả các ô chứa số tiền từ các sản phẩm trong giỏ hàng
//         const totalMoneyCells = document.querySelectorAll('tbody td:nth-child(4)');

//         // Tính tổng số tiền từ các sản phẩm trong giỏ hàng
//         let totalMoney = 0;
//         totalMoneyCells.forEach(cell => {
//             totalMoney += parseFloat(cell.textContent);
//         });

//         // Hiển thị tổng số tiền trong ô chứa phí thu hộ
//         const shippingFeeCell = document.getElementById('shipping-fee');
//         shippingFeeCell.textContent = `Phí thu hộ: ₫${totalMoney} VNĐ. Ưu đãi về phí vận chuyển (nếu có) áp dụng cả với phí thu hộ.`;
//     }

// // Gọi hàm tính toán phí thu hộ khi trang được tải hoàn toàn
// document.addEventListener('DOMContentLoaded', calculateShippingFee);

// // Đảm bảo rằng giá trị của totalMoney được cập nhật trước khi submit form
// document.querySelector('form[name="cartpayproduct-form"]').addEventListener('submit', function() {
//     calculateShippingFee();
// });

