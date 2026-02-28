"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { List, Stack, Typography, Box } from "@mui/material"
import { BudgetTransactionTypeV2, HookSetter } from "@/utils/type"
import { deleteBudget } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import { FlexColWrapper } from "@/components/Wrappers"
import { useMemo } from "react"
import { formattedStringNumber } from "@/utils/helperFunctions"
import BudgetEntryRow from "./BudgetEntryRow"

const BudgetEntries = ({
  budgetTransactions,
  refreshBudgetTransactions,
  setOpenEditDialog,
  setSelectedEntry,
  currentTheme,
}: {
  budgetTransactions: BudgetTransactionTypeV2[]
  refreshBudgetTransactions: () => void
  setOpenEditDialog: HookSetter<boolean>
  setSelectedEntry: HookSetter<BudgetTransactionTypeV2 | null>
  currentTheme: string | undefined
}) => {
  const user = useUser()

  const handleDeleteEntry = async (id: number) => {
    if (!user) return
    await deleteBudget({
      userId: user?.id,
      rowId: id,
    })
    refreshBudgetTransactions()
  }

  const groupedTransactions = useMemo(() => {
    return budgetTransactions.reduce(
      (acc, transaction) => {
        const category = transaction.category

        if (!acc[category]) {
          acc[category] = []
        }

        acc[category].push(transaction)

        return acc
      },
      {} as Record<string, BudgetTransactionTypeV2[]>,
    )
  }, [budgetTransactions])

  return (
    <FlexColWrapper gap={2}>
      <ShowCaseCard title={""}>
        <List className="flex flex-col gap-2" disablePadding={true}>
          {budgetTransactions.length === 0 ? (
            <Typography>The are no budget entries yet</Typography>
          ) : (
            Object.entries(groupedTransactions)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([category, entries]) => {
                const total = entries.reduce((sum, entry) => {
                  return entry.isReturn
                    ? sum - entry.amount
                    : sum + entry.amount
                }, 0)

                return (
                  <Box key={category}>
                    <Stack direction={"row"} justifyContent={"space-around"}>
                      <Typography variant="h6">{category}</Typography>
                      <Typography variant="h6">
                        {`$${formattedStringNumber(total)}`}
                      </Typography>
                    </Stack>

                    <Stack direction={"column"} spacing={1}>
                      {entries.map((entry) => (
                        <BudgetEntryRow
                          key={entry.id}
                          entry={entry}
                          handleDeleteEntry={handleDeleteEntry}
                          setOpenEditDialog={setOpenEditDialog}
                          setSelectedEntry={setSelectedEntry}
                          currentTheme={currentTheme}
                        />
                      ))}
                    </Stack>
                  </Box>
                )
              })
          )}
        </List>
      </ShowCaseCard>
    </FlexColWrapper>
  )
}

export default BudgetEntries
