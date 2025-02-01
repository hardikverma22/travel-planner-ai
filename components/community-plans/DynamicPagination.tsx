import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

const DynamicPagination = ({
  totalPages,
  currentPage,
  maxDisplayedPages = 5,
}: {
  totalPages: number;
  currentPage: number;
  maxDisplayedPages: number;
}) => {
  const searchParams = useSearchParams();
  const getPageNumbers = () => {
    let pages = [];

    // Always show first page
    pages.push(1);

    let startPage = Math.max(
      2,
      currentPage - Math.floor(maxDisplayedPages / 2)
    );
    let endPage = Math.min(totalPages - 1, startPage + maxDisplayedPages - 3);

    // Adjust start if we're near the end
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - maxDisplayedPages + 3);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("ellipsis1");
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("ellipsis2");
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const createUrlWithParams = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageNumber", page.toString());
    return `/community-plans?${params.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createUrlWithParams(currentPage - 1) : "#"}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {getPageNumbers().map((pageNumber, index) => (
          <PaginationItem key={`${pageNumber}-${index}`}>
            {pageNumber === "ellipsis1" || pageNumber === "ellipsis2" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createUrlWithParams(pageNumber as number)}
                isActive={pageNumber === currentPage}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={
              currentPage < totalPages
                ? createUrlWithParams(currentPage + 1)
                : "#"
            }
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DynamicPagination;
