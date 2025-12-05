interface PaginationProps {
  currentPage: number;
  hasMore: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function Pagination({ currentPage, hasMore, onNext, onPrev }: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-4 py-6">
      
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className={`
          px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700
          hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        ◀ {currentPage > 1 ? currentPage - 1 : "Précédent"}
      </button>

      <span className="px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow-md">
        {currentPage}
      </span>

      <button
        onClick={onNext}
        disabled={!hasMore}
        className={`
          px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700
          hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {hasMore ? currentPage + 1 : "Suivant"} ▶
      </button>
    </div>
  );
}
