"use client"

import * as React from "react"
import CsvDownloader from 'react-csv-downloader';
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
import { Download, DownloadIcon, PackagePlusIcon, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useModal } from "@/hooks/use-model-store"
import { handleFileDownload } from "@/lib/utils"


export function PickupAddressTable({ data, columns }: { data: any[], columns: ColumnDef<any, any>[] }) {
  const { onOpen } = useModal();
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableSorting: false,
    state: {
      columnFilters,
      //   columnVisibility,
      rowSelection,
    },
  })


  const cols = [
    {
      id: "facilityName",
      displayName: "facility Name",
    },
    {
      id: 'contactPersonName',
      displayName: 'Contact Person Name'
    },
    {
      id: 'phone',
      displayName: 'Phone'
    },
    {
      id: 'address',
      displayName: 'Address'
    },
    {
      id: 'address2',
      displayName: 'Address2'
    },
    {
      id: 'city',
      displayName: 'City'
    },
    {
      id: 'state',
      displayName: 'State'
    },
    {
      id: 'pincode',
      displayName: 'Pincode'
    },
    {
      id: 'isPrimary',
      displayName: "Primary"
    },
    {
      id: 'isActive',
      displayName: "Active"
    }

  ]

  const datas = data.map((row) => {
    return {
      facilityName: row.name,
      contactPersonName: row.contactPersonName,
      phone: row.phone,
      address: row.address1?.replaceAll(',', ' '),
      address2: row.address2?.replaceAll(',', ' '),
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      isPrimary: row.isPrimary,
      isActive: row.isActive
    }
  })

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center py-4 gap-4">
  {/* Search Input and Download CSV Button */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto ml-2 sm:ml-0">
    <Input
      placeholder="Search by Facility Name"
      value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn("name")?.setFilterValue(event.target.value)
      }
      className="w-full sm:max-w-sm"
    />
    <CsvDownloader filename="hubs-list" datas={datas} columns={cols}>
      <Button variant="webPageBtn" size="sm" className="flex items-center gap-2">
        <DownloadIcon size={20} />
        Download CSV
      </Button>
    </CsvDownloader>
  </div>

  {/* Action Buttons */}
  <div className="flex gap-3 ml-auto">
    <Button
      variant="webPageBtn"
      size="icon"
      onClick={() => onOpen("BulkHubUpload")}
      className="flex items-center justify-center"
    >
      <Upload size={18} />
    </Button>
    <Button
      variant="webPageBtn"
      size="icon"
      onClick={() => handleFileDownload("pickup_bulk_sample.csv")}
      className="flex items-center justify-center"
    >
      <Download size={18} />
    </Button>
    <Button
      onClick={() => onOpen("addPickupLocation")}
      variant="themeButton"
      className="text-xs flex items-center gap-2"
    >
      <PackagePlusIcon size={14} />
      Add Address
    </Button>
  </div>
</div>


      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected()}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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

      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex gap-2">
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
