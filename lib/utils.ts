import { toast } from "@/components/ui/use-toast";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrencyForIndia(amount: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  return formatter.format(amount);
}

export const dateFormatter = (date: string) => {
  let splittedDate = date.split("-");
  const temp = splittedDate[0];
  splittedDate[0] = splittedDate[2];
  splittedDate[2] = temp;
  return splittedDate.join("-");
};

export const getFormattedUpcomingDate = (numberOfDaysToAdd: number) => {
  const currentDate = new Date();
  const upcomingDate = new Date(currentDate);
  upcomingDate.setDate(upcomingDate.getDate() + numberOfDaysToAdd);

  const day = upcomingDate.getDate();
  const month = upcomingDate.toLocaleString('default', { month: 'long' });
  const year = upcomingDate.getFullYear().toString().slice(-2);

  const formattedDate = `${day} ${month}, ${year}`;

  return formattedDate;
}

export const handleCopyText = (text: string) => {
  navigator.clipboard.writeText(text);
  toast({
    title: "Copied to clipboard",
    description: text,
  });
}

const calculateFinancialYear = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-indexed, January is 0
  const currentYear = currentDate.getFullYear();
  let financialYearStart;
  let financialYearEnd;
  
  if (currentMonth >= 3) {
      // Financial year starts from April
      financialYearStart = currentYear;
      financialYearEnd = currentYear + 1;
  } else {
      // Financial year starts from April of the previous year
      financialYearStart = currentYear - 1;
      financialYearEnd = currentYear;
  }
  
  // Format financial year as 'YYYY-YY' (e.g., '2023-24')
  const financialYear = `${financialYearStart}-${String(financialYearEnd).slice(2)}`;
  
  return financialYear;
};

const generateOrderID = (platformName: string, financialYear: string, hubName: string, orderID: number): string => {
  const paddedOrderID: string = orderID.toString().padStart(5, '0');
  
  const uniqueOrderID: string = `${platformName}${financialYear}-${hubName}${paddedOrderID}`;
  
  return uniqueOrderID;
};
