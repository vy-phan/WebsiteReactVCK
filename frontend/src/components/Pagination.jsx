// --- START OF FILE Pagination.jsx ---
import React from 'react';
import { FiChevronsLeft, FiChevronLeft, FiChevronRight, FiChevronsRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null; // Không hiển thị phân trang nếu chỉ có 1 trang hoặc ít hơn
  }

  return (
    <div className="py-4 flex flex-col items-center justify-center gap-4"> {/* Keep flex-col for vertical stacking */}
      <div className="text-center mb-2"> {/* mb-2 for spacing below page info, always centered */}
        <span className="text-sm text-gray-700 dark:text-gray-300 dark:text-gray-100"> {/* Dark mode text color for page info */}
          Trang <span className="font-medium">{currentPage}</span> trên <span className="font-medium">{totalPages}</span>
        </span>
      </div>
      <div className=""> {/* Container for pagination buttons, no flex-1 needed */}
        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-l-md min-w-[32px] justify-center mx-1 ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed hover:bg-white dark:hover:bg-gray-800' : ''} focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-indigo-500`}
          >
            <span className="sr-only">First</span>
            <FiChevronsLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 mx-1 min-w-[32px] justify-center ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed hover:bg-white dark:hover:bg-gray-800' : ''} focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-indigo-500`}
          >
            <span className="sr-only">Previous</span>
            <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              aria-current="page"
              className={`relative inline-flex items-center px-3 py-2 border text-sm font-semibold mx-1 min-w-[32px] justify-center ${currentPage === number ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 hover:bg-indigo-100 font-medium ring-1 ring-indigo-500 dark:bg-indigo-600 dark:border-indigo-500 dark:text-white dark:hover:bg-indigo-500 dark:ring-indigo-500' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'} focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-indigo-500`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 mx-1 min-w-[32px] justify-center ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed hover:bg-white dark:hover:bg-gray-800' : ''} focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-indigo-500`}
          >
            <span className="sr-only">Next</span>
            <FiChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-r-md min-w-[32px] justify-center mx-1 ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed hover:bg-white dark:hover:bg-gray-800' : ''} focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-indigo-500`}
          >
            <span className="sr-only">Last</span>
            <FiChevronsRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
// --- END OF FILE Pagination.jsx ---