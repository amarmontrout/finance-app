import { TransactionType } from "@/api/transactions/models"
import { numberToString } from "@/global/formattingFunctions"
import { Divider, Stack, Typography } from "@mui/material"

const TransactionList = ({
  expenses,
  category,
}: {
  expenses: TransactionType[]
  category: string
}) => {
  return (
    <Stack
      direction={"column"}
      divider={<Divider className="border-dark-4 dark:border-dark-6" />}
    >
      {expenses.map((t) => {
        if (t.category !== category) return
        return (
          <Stack
            key={t.id}
            direction={"row"}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography
              sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, width: "60%" }}
            >
              {t.note}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1.5rem", md: "2rem" },
                width: "40%",
                textAlign: "right",
              }}
            >
              {t.is_return ? "+" : "-"}${numberToString(t.amount)}
            </Typography>
          </Stack>
        )
      })}
    </Stack>
  )
}

export default TransactionList
