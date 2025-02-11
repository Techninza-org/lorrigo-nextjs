"use client"

import * as React from "react"
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function DisputeBillingTable({
  data,
  columns,
  resetPagination = false, // New prop to trigger pagination reset
}: {
  data: any[]
  columns: ColumnDef<any, any>[]
  resetPagination?: boolean
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [filtering, setFiltering] = React.useState<string>("")
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 40,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater: any) => {
      const newPagination = updater(table.getState().pagination)
      setPagination(newPagination)
      const params = new URLSearchParams(searchParams)
      params.set("page", String(newPagination.pageIndex + 1))
      router.push(`?${params.toString()}`, { scroll: false })
    },
    state: {
      pagination,
      rowSelection,
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (resetPagination) {
      table.setPageIndex(0)
      const params = new URLSearchParams(searchParams)
      params.set("page", "1")
      router.push(`?${params.toString()}`, { scroll: false })
    } else {
      const page = searchParams.get("page")
      if (page) {
        const pageIndex = Number.parseInt(page, 10) - 1
        table.setPageIndex(pageIndex)
      }
    }
  }, [searchParams, table, resetPagination, router])

  const cols = [
    {
      id: "date",
      displayName: "Date",
    },
    {
      id: "orderRefId",
      displayName: "Order ID",
    },
    {
      id: "awb",
      displayName: "AWB number",
    },
    {
      id: "rtoAwb",
      displayName: "RTO AWB",
    },
    {
      id: "shipmentType",
      displayName: "Shipment Type",
    },
    {
      id: "recipientName",
      displayName: "Recipient Name",
    },
    {
      id: "toCity",
      displayName: "Origin City",
    },
    {
      id: "fromCity",
      displayName: "Destination City",
    },
    {
      id: "chargedWeight",
      displayName: "Charged Weight",
    },
    {
      id: "billingAmount",
      displayName: "Charged Amount",
    },
    {
      id: "zone",
      displayName: "Zone",
    },
    {
      id: "isForwardApplicable",
      displayName: "Forward Applicable",
    },
    {
      id: "isRTOApplicable",
      displayName: "RTO Applicable",
    },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter by AWB or Order ID"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="w-full border rounded-md">
        <div className="relative w-full overflow-auto">
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          <Table className="min-w-[1200px]">
            {" "}
            {/* Adjust this value based on your needs */}
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className={`whitespace-nowrap ${index === 0 ? "sticky left-0 z-20 bg-white" : ""}`}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={`whitespace-nowrap ${index === 0 ? "sticky left-0 z-20 bg-white" : ""}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {/* <Button variant={'outline'}>
                        Page{' '}
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </Button> */}
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
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}