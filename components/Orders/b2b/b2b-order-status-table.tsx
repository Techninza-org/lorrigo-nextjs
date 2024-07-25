"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useSearchParams } from "next/navigation"
import { useSellerProvider } from "../../providers/SellerProvider"
import { cn, filterData } from "@/lib/utils"
import { useModal } from "@/hooks/use-model-store"

export function B2BOrderStatusTable({ data, columns }: { data: any[], columns: ColumnDef<any, any>[] }) {
  const { handleOrderSync, seller } = useSellerProvider()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [filtering, setFiltering] = React.useState<string>("")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const searchParams = useSearchParams()
  const isShipmentVisible = searchParams.get('status') !== 'new'
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    "Shipment Details": isShipmentVisible,
  });
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 20, //default page size
  });

  const { onOpen } = useModal();

  const [filteredData, setFilteredData] = React.useState<any[]>(data)
  // Memoize filtered data to avoid unnecessary re-renders
  const filteredDataMemo = React.useMemo(() => filterData(data, filtering), [data, filtering]);


  const table = useReactTable({
    data: filteredDataMemo,
    columns,
    // onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // enableSorting: false,
    onPaginationChange: setPagination,
    state: {
      // columnFilters,
      // columnVisibility,
      pagination,
      rowSelection,
      globalFilter: filtering
    },
    onGlobalFilterChange: setFiltering
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)
  console.log(selectedRows, "selectedRows")

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <div>
          <Input
            placeholder="Filter by AWB or Order Reference ID"
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div>
          {
            selectedRows.length > 0 && (
              <DropdownMenu >
                <DropdownMenuTrigger className={cn("mr-3", buttonVariants({
                  variant: "webPageBtn",
                  size: "sm"
                }))}>Bulk Actions</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onOpen("BulkPickupUpdate", { orders: selectedRows })}>Change pickup location</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onOpen("cancelBulkOrder", { orders: selectedRows })}>Cancel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>)
          }
        </div>

      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <Button variant={'outline'}>
            Page{' '}
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </Button>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
