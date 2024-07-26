import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { DateRange } from 'react-day-picker';
import { formatDate } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDisplayName = (
  firstName: string | undefined,
  lastName: string | undefined,
  email: string
) => {
  if (!firstName) return email;
  return firstName + (lastName ? ` ${lastName}` : "") + ` (${email})`;
};

export const getFormattedDateRange = (fromDate: Date, toDate: Date, formatStr: string = "PPP") => {
  return `${formatDate(fromDate, formatStr)} - ${formatDate(toDate, formatStr)}`
}