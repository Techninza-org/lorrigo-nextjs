"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { DownloadIcon } from "lucide-react"

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
import { useRouter } from "next/navigation"
import { useSellerProvider } from "../providers/SellerProvider"
import { cn } from "@/lib/utils"
import { useModal } from "@/hooks/use-model-store"
import { B2COrderType } from "@/types/types"
import { DatePickerWithRange } from "../DatePickerWithRange"
import { DateRange } from "react-day-picker"
import CsvDownloader from 'react-csv-downloader';
import { getBucketStatus } from "./order-action-button"
import { format } from "date-fns"

export function OrderStatusTable({ data, columns }: { data: any[], columns: ColumnDef<any, any>[] }) {
  const { handleOrderSync, seller } = useSellerProvider()
  const [filtering, setFiltering] = React.useState<string>("")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const defaultToDate = new Date();
  const defaultFromDate = new Date(
    defaultToDate.getFullYear(),
    defaultToDate.getMonth()-1,
  );
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: defaultFromDate,
    to: defaultToDate,
  })

  const [filteredData, setFilteredData] = React.useState<any[]>(data)

  const table = useReactTable({
    data: filteredData,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,

    state: {
      columnFilters,
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

  React.useEffect(() => {
    if ((!date?.from || !date?.to) || (date.from === date.to)) return
    const a = data.filter((row) => {
      if (date?.from && date?.to) {
        return row.order_invoice_date > new Date(date.from).toISOString() && row.order_invoice_date < new Date(date.to).toISOString()
      }
      return false;
    });
    setFilteredData(a);
  }, [data, date]);

  React.useEffect(() => {
    setFilteredData(data)
  }, [data])

  const cols = [
    {
      id: "order_reference_id",
      displayName: "Order Reference ID"
    },
    {
      id: "awb",
      displayName: "AWB"
    },
    {
      id: "order_invoice_date",
      displayName: "Order Invoice Date"
    },
    {
      id: "channelName",
      displayName: "Channel Name"
    },
    {
      id: "customerName",
      displayName: "Customer Name"
    },
    {
      id: "customerPhone",
      displayName: "Customer Phone"
    },
    {
      id: "customerEmail",
      displayName: "Customer Email"
    },
    {
      id: "packageName",
      displayName: "Package Name"
    },
    {
      id: "packageDimensions",
      displayName: "Package Dimensions"
    },
    {
      id: "packageWeight",
      displayName: "Package Weight"
    },
    {
      id: "status",
      displayName: "Status"
    },
  ]

  const datas = filteredData.map((row) => {
    return {
      order_reference_id: row.order_reference_id,
      awb: row.awb,
      order_invoice_date: format(row.order_invoice_date, 'dd MM yyyy | HH:mm a'),
      channelName: row.channelName || "Custom",
      customerName: row.customerDetails.name,
      customerEmail: row.customerDetails.email || "",
      customerPhone: row?.customerDetails?.phone?.slice(3, 12),
      packageName: row.productId.name,
      packageDimensions: `${row.orderBoxLength} x ${row.orderBoxWidth} x ${row.orderBoxHeight}`,
      packageWeight: `${row.orderWeight} ${row.orderWeightUnit}`,
      status: getBucketStatus(row.bucket),
    }
  })


  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <div className="flex gap-3">
          <Input
            placeholder="Filter by AWB or Order Reference ID"
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            className="w-64"
          />
          <DatePickerWithRange date={date} setDate={setDate} disabledDates={{ after: new Date() }} />
          <CsvDownloader filename="view-shipment" datas={datas} columns={cols}>
            <Button variant={'webPageBtn'} size={'icon'}><DownloadIcon size={20} /></Button>
          </CsvDownloader>
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
