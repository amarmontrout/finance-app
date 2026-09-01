import { V2TransactionType } from "@/api/v2/models"
import { getTransactionsV2 } from "@/api/v2/requests"
import { useDataContext } from "@/contexts/data-context"
import { getDebitExpenseTotal, getIncomeTotal } from "@/global/dataFunctions"
import { currencyFormatter } from "@/global/formattingFunctions"
import { getNextMonthYear, getPreviousMonthYear } from "@/global/infoFunctions"
import NorthIcon from "@mui/icons-material/North"
import SouthIcon from "@mui/icons-material/South"
import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { NOT_DELETED_FILTER } from "../v2/constants"
import { getToday } from "../v2/utils"

const SummaryCard = ({
  children,
  borderColor,
  padding,
  minHeight,
}: {
  children: React.ReactNode
  borderColor: string
  padding: number
  minHeight?: string | undefined
}) => (
  <Box
    bgcolor={"rgba(255,255,255,0.15)"}
    border={`1px solid ${borderColor}`}
    borderRadius={5}
    padding={padding}
    width={"100%"}
    minHeight={minHeight}
  >
    {children}
  </Box>
)

const FinancialSummary = () => {
  // Date strings
  const today = getToday()
  const [yearStr, monthStr] = today.split("-")
  const prevMonthYear = getPreviousMonthYear({ isoString: today })
  const currMonthYear = `${yearStr}-${monthStr}`
  const nextMonthYear = getNextMonthYear({ isoString: today })

  // Account map for transaction payment account
  const { accountMap } = useDataContext()

  // Transactions
  const [currentTransactions, setCurrentTransactions] = useState<
    V2TransactionType[]
  >([])
  const [previousTransactions, setPreviousTransactions] = useState<
    V2TransactionType[]
  >([])

  const current = useMemo(() => {
    const income = getIncomeTotal(currentTransactions)
    const expenses = getDebitExpenseTotal(currentTransactions, accountMap)

    return {
      income,
      expenses,
      netIncome: income - expenses,
    }
  }, [currentTransactions, accountMap])

  const previousNetIncome = useMemo(() => {
    return (
      getIncomeTotal(previousTransactions) -
      getDebitExpenseTotal(previousTransactions, accountMap)
    )
  }, [previousTransactions, accountMap])

  // Get all transactions for current and previous months
  useEffect(() => {
    const load = async () => {
      const [prevTransactions, currTransactions] = await Promise.all([
        getTransactionsV2({
          filters: [
            {
              column: "transaction_date",
              operator: "gte",
              value: `${prevMonthYear}-01`,
            },
            {
              column: "transaction_date",
              operator: "lt",
              value: `${currMonthYear}-01`,
            },
            NOT_DELETED_FILTER,
          ],
        }),

        getTransactionsV2({
          filters: [
            {
              column: "transaction_date",
              operator: "gte",
              value: `${currMonthYear}-01`,
            },
            {
              column: "transaction_date",
              operator: "lt",
              value: `${nextMonthYear}-01`,
            },
            NOT_DELETED_FILTER,
          ],
        }),
      ])

      setPreviousTransactions(prevTransactions ?? [])
      setCurrentTransactions(currTransactions ?? [])
    }

    load().catch(console.error)
  }, [prevMonthYear, currMonthYear])

  return (
    <Stack direction={"column"} spacing={1}>
      <SummaryCard borderColor={"#C9A86A"} padding={2} minHeight={"150px"}>
        <Stack
          direction={"column"}
          height={"100%"}
          justifyContent={"space-between"}
        >
          <Stack direction={"column"}>
            <Typography variant={"caption"}>Net Income</Typography>
            <Typography fontWeight={"bold"} variant={"h4"}>
              {currencyFormatter.format(current.netIncome)}
            </Typography>
          </Stack>

          <Typography
            variant={"body2"}
            fontWeight={"bold"}
            width={"fit-content"}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color:
                current.netIncome >= previousNetIncome ? "#7FB685" : "#B85C5C",
              bgcolor:
                current.netIncome >= previousNetIncome
                  ? "rgba(0, 0, 0, 0.5)"
                  : "rgba(255, 255, 255, 0.5)",
              borderRadius: 2,
              px: 1,
              py: 0.75,
            }}
          >
            {current.netIncome >= previousNetIncome ? (
              <NorthIcon fontSize="small" />
            ) : (
              <SouthIcon fontSize="small" />
            )}
            {currencyFormatter.format(
              Math.abs(current.netIncome - previousNetIncome),
            )}{" "}
            vs last month
          </Typography>
        </Stack>
      </SummaryCard>

      <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
        <SummaryCard borderColor={"#7FB685"} padding={1.5}>
          <Stack direction={"column"}>
            <Typography variant={"caption"}>Income</Typography>
            <Typography fontWeight={"bold"} variant={"h6"}>
              {currencyFormatter.format(current.income)}
            </Typography>
          </Stack>
        </SummaryCard>

        <SummaryCard borderColor={"#B85C5C"} padding={1.5}>
          <Stack direction={"column"}>
            <Typography variant={"caption"}>Expense</Typography>
            <Typography fontWeight={"bold"} variant={"h6"}>
              {currencyFormatter.format(current.expenses)}
            </Typography>
          </Stack>
        </SummaryCard>
      </Stack>
    </Stack>
  )
}

export default FinancialSummary
