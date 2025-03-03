import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DownloadIcon, LucideIcon,  } from "lucide-react";
import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import { DateRange } from "react-day-picker";
import CsvDownloader from 'react-csv-downloader';
import { OrderStatusFilter } from '../order-status-filter';

interface IFilterStatus {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface OrderTableFiltersProps {
  filtering: string;
  setFiltering: (value: string) => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  statusFilter: any;
  setStatusFilter: (status: IFilterStatus | null) => void;
  statuses: IFilterStatus[];
  csvData: any[];
  csvColumns: any[];
  handleOrderSync?: () => void;
  showSyncButton?: boolean;
}

export function OrderTableFilters({
  filtering,
  setFiltering,
  date,
  setDate,
  statusFilter,
  setStatusFilter,
  statuses,
  csvData,
  csvColumns,
  handleOrderSync,
  showSyncButton = false
}: OrderTableFiltersProps) {
  return (
    <div className="grid sm:flex items-center py-4 gap-3">
      <Input
        placeholder="Filter by AWB or Order Reference ID"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
        className="w-64"
      />
      <DatePickerWithRange 
        date={date} 
        setDate={setDate} 
        disabledDates={{ after: new Date() }} 
      />
      <CsvDownloader filename="view-shipment" datas={csvData} columns={csvColumns}>
        <Button variant="webPageBtn" size="icon">
          <DownloadIcon size={18} />
        </Button>
      </CsvDownloader>
      <div className="grid grid-cols-2 gap-3">
        <OrderStatusFilter 
          value={statusFilter} 
          onChange={setStatusFilter} 
          statuses={statuses} 
        />
        {showSyncButton && handleOrderSync && (
          <Button variant="webPageBtn" onClick={handleOrderSync} size="sm">
            Sync Order
          </Button>
        )}
      </div>
    </div>
  );
}