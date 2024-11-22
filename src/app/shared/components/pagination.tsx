import { enviromnent } from "@/app/enviroment/enviroment";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  onPageChange,
}) => {
  let totalPages = Math.ceil(totalCount / enviromnent.lineLimits);

  totalPages = totalPages < 1 ? 1 : totalPages;

  // Garante que a página inicial nunca seja 0
  const validPage = currentPage < 1 ? 1 : currentPage;

  const handlePrev = () => {
    if (validPage > 1) onPageChange(validPage - 1);
  };

  const handleNext = () => {
    if (validPage < totalPages) onPageChange(validPage + 1);
  };
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        onClick={handlePrev}
        disabled={validPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-lg">
        Página {validPage} de {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={validPage * enviromnent.lineLimits >= totalCount}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;
