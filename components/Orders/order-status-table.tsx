"use client"

import React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useSellerProvider } from "../providers/SellerProvider"
import { filterData } from "@/lib/utils"
import { useModal } from "@/hooks/use-model-store"
import type { DateRange } from "react-day-picker"
import { format, formatDate, parse } from "date-fns"
import { HelpCircle } from "lucide-react"
import { useAuth } from "../providers/AuthProvider"
import { OrderTableFilters } from "./table-component/OrderTableFilters"
import { OrderTableBulkActions } from "./table-component/OrderTableBulkActions"
import { OrderTablePagination } from "./table-component/OrderTablePagination"
import { OrderStatusSkeleton } from "./table-component/OrderStatusSkeleton"
import { useDebounce } from "../ui/MultipleSelector"

const statuses = [
  {
    value: "unassigned",
    label: "Unassigned",
    icon: HelpCircle,
  },
  {
    value: "assigned",
    label: "Assigned",
    icon: HelpCircle,
  },
]

type IFilterStatus = {
  value: string
  label: string
  icon: React.ElementType
}

export function OrderStatusTable({
  data,
  columns,
  paginationInfo,
}: { data: any[]; columns: ColumnDef<any, any>[]; paginationInfo: any }) {
  const { userToken } = useAuth()
  const searchParams = useSearchParams()
  const { handleOrderSync, seller, getAllOrdersByStatus } = useSellerProvider()
  const router = useRouter()
  const pathname = usePathname()

  // Get URL parameters
  const status = searchParams.get("status")
  const fromDate = searchParams.get("from")
  const toDate = searchParams.get("to")
  const urlPageIndex = searchParams.get("page")
  const urlFilter = searchParams.get("filter")
  const urlStatusFilter = searchParams.get("statusFilter")

  const initialPageIndex = urlPageIndex ? Number.parseInt(urlPageIndex) - 1 : 0

  // State for filters and pagination
  const [filtering, setFiltering] = React.useState<string>(urlFilter || "")
  const debouncedFilter = useDebounce(filtering, 500)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [statusFilter, setStatusFilter] = React.useState<IFilterStatus | null>(
    urlStatusFilter ? statuses.find((s) => s.value === urlStatusFilter) || null : null,
  )
  const [rowSelection, setRowSelection] = React.useState({})
  const [currentPage, setCurrentPage] = React.useState<number>(initialPageIndex)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [lastFetchParams, setLastFetchParams] = React.useState<string>("")

  const [pagination, setPagination] = React.useState({
    pageIndex: initialPageIndex,
    pageSize: 20,
  })

  // Set up date range from URL or defaults
  const defaultToDate = toDate ? parse(toDate, "MM/dd/yyyy", new Date()) : new Date()
  const defaultFromDate = fromDate
    ? parse(fromDate, "MM/dd/yyyy", new Date())
    : new Date(new Date().setDate(new Date().getDate() - 7))

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: defaultFromDate,
    to: defaultToDate,
  })

  const table = useReactTable({
    data, // Use tableData instead of data
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      pagination,
      rowSelection,
      globalFilter: debouncedFilter,
    },
    onGlobalFilterChange: setFiltering,
    manualPagination: true,
    pageCount: paginationInfo?.totalPages || 0,
  })

  const { onOpen } = useModal()

  const updateURL = React.useCallback(
    (params: {
      from?: string
      to?: string
      page?: number
      status?: string
      filter?: string
      statusFilter?: string
    }) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          current.set(key, value.toString())
        }
      })

      if (params.page === undefined && current.get("page") === "1") {
        current.delete("page")
      }
      if (current.get("filter") === "") {
        current.delete("filter")
      }

      if (statusFilter?.value == null) {
        current.delete("statusFilter")
      }

      if (current.get("b2c_order_bulk_action") === "false") {
        current.delete("b2c_order_bulk_action")
      }

      const search = current.toString()
      const query = search ? `?${search}` : ""
      router.push(`${pathname}${query}`)
    },
    [router, searchParams, pathname, statusFilter],
  )

  // Get selected rows for bulk actions
  const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
  const allNewStageOrders = table.getFilteredSelectedRowModel().rows.filter((row) => row.original.bucket === 0)
  const newOrders = allNewStageOrders.map((row) => row.original)
  const allPickupStageOrders = table
    .getFilteredSelectedRowModel()
    .rows.filter(
      (row) => row.original.bucket === 1 && (row.original.orderStages.find((x: any) => x.stage === 67) ? false : true),
    )
  const allPickupOrders = allPickupStageOrders.map((row) => row.original)

  const handleMultiLableDownload = () => {
    onOpen("downloadLabels", { orders: selectedRows })
    router.push(`/print/invoices?page=${currentPage + 1}`)
  }

  const handleMultiManifestDownload = () => {
    onOpen("downloadManifests", { orders: selectedRows })
    router.push(`/print/manifest?page=${currentPage + 1}`)
  }

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex)
    setPagination((prev) => ({
      ...prev,
      pageIndex: pageIndex,
    }))
    updateURL({ page: pageIndex + 1 })

    // Refetch data to ensure the table updates
    if (date?.from && date?.to) {
      const fromDateStr = formatDate(date.from.toString(), "MM/dd/yyyy")
      const toDateStr = formatDate(date.to.toString(), "MM/dd/yyyy")
      const currentStatus = status || "all"

      setIsLoading(true)

      getAllOrdersByStatus({
        status: currentStatus,
        fromDate: fromDateStr,
        toDate: toDateStr,
        page: pageIndex + 1,
        onSuccess: () => {
          // if (newData && Array.isArray(newData)) {
          //   setTableData(newData)
          // }
          setIsLoading(false)
        },
      })
    }
  }

  // CSV export data
  const csvColumns = [
    { id: "order_creation_date", displayName: "Order Created At" },
    { id: "order_reference_id", displayName: "Order Reference ID" },
    { id: "awb", displayName: "AWB" },
    { id: "order_invoice_date", displayName: "Order Invoice Date" },
    { id: "channelName", displayName: "Channel Name" },
    { id: "customerName", displayName: "Customer Name" },
    { id: "customerPhone", displayName: "Customer Phone" },
    { id: "customerEmail", displayName: "Customer Email" },
    { id: "packageName", displayName: "Package Name" },
    { id: "packageDimensions", displayName: "Package Dimensions" },
    { id: "packageWeight", displayName: "Package Weight" },
    { id: "status", displayName: "Status" },
  ]

  const csvData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return []
    }

    return data.map((row) => ({
      order_creation_date: row?.createdAt && format(new Date(row?.createdAt), "dd MM yyyy | HH:mm a"),
      order_reference_id: row.order_reference_id,
      awb: row.awb,
      order_invoice_date: row.order_invoice_date && format(new Date(row.order_invoice_date), "dd MM yyyy | HH:mm a"),
      channelName: row.channelName || "Custom",
      customerName: row.customerDetails?.name || "",
      customerEmail: row.customerDetails?.email || "",
      customerPhone: row?.customerDetails?.phone ? row.customerDetails.phone.slice(3, 12) : "",
      packageName: row.productId?.name || "",
      packageDimensions: `${row.orderBoxLength || 0} x ${row.orderBoxWidth || 0} x ${row.orderBoxHeight || 0}`,
      packageWeight: `${row.orderWeight || 0} ${row.orderWeightUnit || "kg"}`,
      status: row.bucket,
    }))
  }, [data])

  // Fetch data when filters or page changes
  React.useEffect(() => {
    if (!date?.from || !date?.to || !userToken) return

    const fromDateStr = formatDate(date.from.toString(), "MM/dd/yyyy")
    const toDateStr = formatDate(date.to.toString(), "MM/dd/yyyy")
    const currentStatus = status || "all"

    const fetchParamsKey = `${fromDateStr}-${toDateStr}-${currentStatus}-${currentPage}-${statusFilter?.value}-${urlFilter}`

    if (fetchParamsKey !== lastFetchParams) {
      setIsLoading(true)

      getAllOrdersByStatus({
        status: currentStatus,
        fromDate: fromDateStr,
        toDate: toDateStr,
        page: currentPage + 1, // Add 1 because API pagination is 1-indexed
        statusFilter: statusFilter?.value,
        filter: urlFilter || "",
        onSuccess: () => {
          // if (newData && Array.isArray(newData)) {
          //   setTableData(newData)
          // }
          setIsLoading(false)
        },
      })

      console.log(statusFilter, fetchParamsKey !== lastFetchParams)
      setLastFetchParams(fetchParamsKey)

      // Update URL with date parameters
      updateURL({
        from: fromDateStr,
        to: toDateStr,
        status: currentStatus,
        page: currentPage + 1,
      })
    }
  }, [userToken, date, status, currentPage, getAllOrdersByStatus, updateURL, lastFetchParams, statusFilter])

  // Update URL when filter changes
  React.useEffect(() => {
    updateURL({ filter: debouncedFilter })
  }, [debouncedFilter, updateURL])

  // Update URL when status filter changes
  React.useEffect(() => {
    const currentStatusFilterValue = statusFilter?.value || undefined
    if (currentStatusFilterValue !== urlStatusFilter) {
      updateURL({ statusFilter: currentStatusFilterValue })
    }
  }, [statusFilter, urlStatusFilter, updateURL])

  // Set pagination from URL on initial load
  React.useEffect(() => {
    if (urlPageIndex) {
      const pageIdx = Number.parseInt(urlPageIndex) - 1
      setPagination((prev) => ({
        ...prev,
        pageIndex: pageIdx,
      }))
      setCurrentPage(pageIdx)
      table.setPageIndex(pageIdx)
    }
  }, [urlPageIndex, table])

  return (
    <div className="w-full">
      <div className="grid sm:flex items-center justify-between">
        <OrderTableFilters
          filtering={filtering}
          setFiltering={setFiltering}
          date={date}
          setDate={setDate}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statuses={statuses}
          csvData={csvData}
          csvColumns={csvColumns}
          handleOrderSync={handleOrderSync}
          showSyncButton={!!seller?.channelPartners[0]?.isOrderSync}
        />

        <OrderTableBulkActions
          table={table}
          selectedRows={selectedRows}
          newOrders={newOrders}
          allPickupOrders={allPickupOrders}
          onMultiLabelDownload={handleMultiLableDownload}
          onMultiManifestDownload={handleMultiManifestDownload}
          onOpen={onOpen}
          updateURL={updateURL}
          pagination={paginationInfo}
          date={date}
        />
      </div>

      {isLoading ? (
        <OrderStatusSkeleton columns={columns.length} />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
      )}

      <OrderTablePagination
        table={table}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pagination={paginationInfo}
      />
    </div>
  )
}

