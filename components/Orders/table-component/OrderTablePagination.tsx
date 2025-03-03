"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";

interface OrderTablePaginationProps<TData> {
  table: Table<TData>;
  currentPage: number;
  onPageChange: (page: number) => void;
  pagination: any;
}

export function OrderTablePagination<TData>({ 
  table, 
  currentPage,
  onPageChange,
  pagination
}: OrderTablePaginationProps<TData>) {
  const totalPages = pagination?.pages || 1;
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are fewer than maxVisiblePages
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(0);
      
      // Calculate range around current page
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages - 2, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage < 2) {
        endPage = 3;
      }
      
      // Adjust if we're near the end
      if (currentPage > totalPages - 3) {
        startPage = totalPages - 4;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 1) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 2) {
        pageNumbers.push(-2); // -2 represents ellipsis
      }
      
      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages - 1);
      }
    }
    
    return pageNumbers;
  };

  const handlePageChange = (pageIndex: number) => {
    // Call the parent component's onPageChange handler
    onPageChange(pageIndex);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const prevPage = Math.max(0, currentPage - 1);
            handlePageChange(prevPage);
          }}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        
        <div className="flex space-x-1">
          {getPageNumbers().map((pageIndex, i) => {
            if (pageIndex < 0) {
              // Render ellipsis
              return <Button key={`ellipsis-${i}`} variant="ghost" size="sm" disabled>...</Button>;
            }
            
            return (
              <Button
                key={pageIndex}
                variant={pageIndex === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageIndex)}
              >
                {pageIndex + 1}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const nextPage = Math.min(totalPages - 1, currentPage + 1);
            handlePageChange(nextPage);
          }}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}