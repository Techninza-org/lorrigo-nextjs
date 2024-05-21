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
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import { useRouter, useSearchParams } from "next/navigation"
import { useSellerProvider } from "../providers/SellerProvider"
import { cn } from "@/lib/utils"
import { useModal } from "@/hooks/use-model-store"
import { B2COrderType } from "@/types/types"



export function OrderStatusTable({ data, columns }: { data: any[], columns: ColumnDef<any, any>[] }) {
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
    pageSize: 25, //default page size
  });

  const table = useReactTable({
    data,
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

  const router = useRouter()
  const { onOpen } = useModal();
  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)
  const allNewStageOrders = table.getFilteredSelectedRowModel().rows.filter(row => row.original.bucket === 0)
  const newOrders = allNewStageOrders.map(row => row.original)
  const handleMultiLableDownload = () => {
    onOpen("downloadLabels", { orders: selectedRows })
    router.push('/print/invoices')
  }

  const handleMultiManifestDownload = () => {
    onOpen("downloadManifests", { orders: selectedRows })
    router.push('/print/manifest')
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter by AWB or Order Reference ID"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="max-w-sm"
        />
        <div>
          {
            selectedRows.length > 0 && (
              <DropdownMenu >
                <DropdownMenuTrigger className={cn("mr-3", buttonVariants({
                  variant: "webPageBtn",
                  size: "sm"
                }))}>Bulk Actions</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onOpen("updateShopifyOrders", { orders: (newOrders as unknown as B2COrderType[]) })}>Update shopify orders</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onOpen("BulkPickupUpdate", { orders: selectedRows })}>Change pickup location</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMultiLableDownload}>Download Label</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMultiManifestDownload}>Download Manifest</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onOpen("cancelBulkOrder", { orders: selectedRows })}>Cancel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>)
          }


          {
            seller?.channelPartners[0]?.isOrderSync && <Button variant={'webPageBtn'} onClick={handleOrderSync} size={"sm"}>Sync Order</Button>
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
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
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
