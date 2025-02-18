export default function paginateArray(array, pageSize = 20) {
    if (!Array.isArray(array)) {
      return []; 
    }
    if (pageSize <= 0) {
      return [array]; 
    }
  
    const numberOfPages = Math.ceil(array.length / pageSize);
    const pages = [];
  
    for (let i = 0; i < numberOfPages; i++) {
      const startIndex = i * pageSize;
      const endIndex = startIndex + pageSize;
      const page = array.slice(startIndex, endIndex);
      pages.push(page);
    }
  
    return pages;
  }
  
  // Hàm tiện ích phân trang - paginateArray
  
  /**
   * Phân trang một mảng thành nhiều trang với kích thước trang nhất định.
   *
   * @param {Array} array Mảng cần phân trang.
   * @param {number} [pageSize=20] Số lượng phần tử trên mỗi trang. Mặc định là 20.
   * @returns {Array<Array>} Mảng chứa các trang, mỗi trang là một mảng con của mảng ban đầu.
   */
  // Ví dụ sử dụng:
  const mangDuLieu = Array.from({ length: 35 }, (_, index) => `Phần tử thứ ${index + 1}`);
  
  const trangDaPhanTrang = paginateArray(mangDuLieu, 20);
  
  // console.log("Mảng gốc:", mangDuLieu);
  // console.log("Các trang đã phân trang:", trangDaPhanTrang);
  // console.log("Trang 1:", trangDaPhanTrang[0]); // Trang đầu tiên (index 0)
  // console.log("Trang 2:", trangDaPhanTrang[1]); // Trang thứ hai (index 1)
  // console.log("Số lượng trang:", trangDaPhanTrang.length); // Output: 2
  // console.log("Số phần tử trang 1:", trangDaPhanTrang[0].length); // Output: 20
  // console.log("Số phần tử trang 2:", trangDaPhanTrang[1].length); // Output: 15