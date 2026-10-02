import { MONTH_INDEX_V2 } from "@/app/data/constants"

export function formatDate(date: string): string {
  const [year, month, day] = date.split("-")
  return `${MONTH_INDEX_V2[month]} ${day}, ${year}`
}

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
