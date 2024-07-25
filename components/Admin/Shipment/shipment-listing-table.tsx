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
import { ChevronDown, DownloadIcon } from "lucide-react"
import CsvDownloader from 'react-csv-downloader';

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRange } from "react-day-picker"
import { filterData } from "@/lib/utils"
import { DatePickerWithRange } from "@/components/DatePickerWithRange"
import { formatDate } from "date-fns";

export function ShipmentListingTable({ data, columns }: { data: any[], columns: ColumnDef<any, any>[] }) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const searchParams = useSearchParams();
  const [filtering, setFiltering] = React.useState<string>("");

  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedColumn, setSelectedColumn] = React.useState("order_reference_id");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const defaultToDate = new Date();
  const defaultFromDate = new Date(
    defaultToDate.getFullYear(),
    defaultToDate.getMonth() - 1,
  );
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: defaultFromDate,
    to: defaultToDate,
  });

  const filteredDataMemo = React.useMemo(() => {
    const filteredByGlobal = filterData(data, filtering);
    if ((!date?.from || !date?.to) || (date.from === date.to)) return filteredByGlobal;

    return filteredByGlobal.filter((row: any) => {
      if (date?.from && date?.to) {
        const createdAt = row.createdAt && new Date(row.createdAt)?.toISOString();
        return createdAt > new Date(date.from).toISOString() && createdAt < new Date(date.to).toISOString();
      }
      return false;
    });
  }, [data, filtering, date]);

  const table = useReactTable({
    data: filteredDataMemo,
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
    onGlobalFilterChange: setFiltering,
  });

  function handleFilterChange(value: string) {
    setSelectedColumn(value);
  }


  const cols = [
    {
      id: "clientName",
      displayName: "Client Name",
    },
    {
      id: "shipmentId",
      displayName: "Shipment ID",
    },
    {
      id: "addressId",
      displayName: "Address ID",
    },
    {
      id: "partner",
      displayName: "Carrier Name",
    },
    {
      id: "awb",
      displayName: "AWB",
    },
    {
      id: "paymentMode",
      displayName: "Payment Mode",
    },
    {
      id: "amount",
      displayName: "Amount",
    },
    {
      id: "status",
      displayName: "Status",
    },
    {
      id: "orderCreationDate",
      displayName: "Order Creation Date",
    }

  ]

  const datas = filteredDataMemo.map((row: any) => {
    return {
      clientName: row.sellerDetails?.sellerName || row?.sellerId?.name,
      shipmentId: row?.order_reference_id,
      addressId: row?.pickupAddress?._id,
      partner: row?.carrierName,
      awb: row?.awb,
      paymentMode: row?.payment_mode === 1 ? 'COD' : 'Prepaid',
      amount: row?.productId?.taxable_value || row?.amount,
      status: row?.orderStages?.slice(-1)[0].action + " " + formatDate(`${row?.orderStages?.slice(-1)[0].stageDateTime || new Date()}`, 'dd MM yyyy | HH:mm a'),
      orderCreationDate: row?.createdAt,
    }
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Select onValueChange={handleFilterChange}>
          <SelectTrigger className='w-[180px] mr-4' >
            <SelectValue placeholder='Shipment ID' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'order_reference_id'}>Shipment ID</SelectItem>
            <SelectItem value={'awb'}>AWB</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-3">

          <Input
            placeholder={`Filter by ${selectedColumn === "order_reference_id" ? "Order Ref ID" : "AWB"}`}
            value={(table.getColumn(selectedColumn)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(selectedColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DatePickerWithRange date={date} setDate={setDate} disabledDates={{ after: new Date() }} />
          <CsvDownloader filename="shipment-listing" datas={datas} columns={cols}>
            <Button variant={'webPageBtn'} size={'icon'}><DownloadIcon size={20} /></Button>
          </CsvDownloader>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
