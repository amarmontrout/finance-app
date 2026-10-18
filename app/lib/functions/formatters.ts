import { MONTH_INDEX } from "@/app/data/constants"

export function formatDate(date: string): string {
  const [year, month, day] = date.split("-")
  return `${MONTH_INDEX[month]} ${day}, ${year}`
}

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
