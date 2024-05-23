document.addEventListener("DOMContentLoaded", function() {
  // Lấy tất cả các thẻ td có class là datetimeCell
  const datetimeCells = document.querySelectorAll('.datetimeCell');

  datetimeCells.forEach(cell => {
      const datetimeInput = cell.innerText;

      try {
          // Chuyển đổi định dạng DateTime
          const date = new Date(datetimeInput);

          // Kiểm tra xem input có hợp lệ hay không
          if (isNaN(date)) {
              throw new Error('Invalid DateTime format');
          }

          // Lấy ngày, tháng, năm từ đối tượng Date
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
          const year = date.getFullYear();

          // Định dạng lại theo ngày-tháng-năm
          const formattedDate = `${day}-${month}-${year}`;

          // Hiển thị kết quả trong thẻ td
          cell.innerText = formattedDate;
      } catch (error) {
          // Hiển thị lỗi nếu định dạng không hợp lệ
          cell.innerText = error.message;
      }
  });
});
