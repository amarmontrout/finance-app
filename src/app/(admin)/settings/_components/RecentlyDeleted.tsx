import { TransactionType } from "@/api/transactions/models"
import {
  deleteTransaction,
  undoSoftDeleteTransaction,
} from "@/api/transactions/requests"
import { darkMode, lightMode, neutralColor } from "@/global/colors"
import {
  dateTypeToTimestamp,
  numberToString,
  timestampToDateString,
} from "@/global/formattingFunctions"
import { useUser } from "@/hooks/use-user"
import { AlertToastType, HookSetter } from "@/types/types"
import CancelIcon from "@mui/icons-material/Cancel"
import DeleteIcon from "@mui/icons-material/Delete"
import ReplayIcon from "@mui/icons-material/Replay"
import { Box, Divider, IconButton, Stack, Typography } from "@mui/material"
import { useTheme } from "next-themes"
import { useMemo, useState } from "react"

const EditDeleteButton = ({
  onEdit,
  onSetDelete,
}: {
  onEdit: () => void
  onSetDelete: () => void
}) => {
  return (
    <Stack direction={"row"} spacing={1}>
      <IconButton
        className="text-dark-4 dark:text-dark-6"
        edge={"end"}
        onClick={onEdit}
      >
        <ReplayIcon />
      </IconButton>

      <IconButton
        className="text-dark-4 dark:text-dark-6"
        edge={"end"}
        onClick={onSetDelete}
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  )
}

const ConfirmCancelButton = ({
  onDelete,
  onCancelDelete,
}: {
  onDelete: () => void
  onCancelDelete: () => void
}) => {
  return (
    <Stack direction={"row"} spacing={1}>
      <IconButton
        className="text-dark-4 dark:text-dark-6"
        edge={"end"}
        onClick={onDelete}
      >
        <DeleteIcon />
      </IconButton>

      <IconButton
        className="text-dark-4 dark:text-dark-6"
        edge={"end"}
        onClick={onCancelDelete}
      >
        <CancelIcon />
      </IconButton>
    </Stack>
  )
}

const RecentlyDeleted = ({
  deletedTransactions,
  refreshDeletedTransactions,
  refreshTransactions,
  setAlertToast,
}: {
  deletedTransactions: TransactionType[]
  refreshDeletedTransactions: () => Promise<void>
  refreshTransactions: () => Promise<void>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const { theme: currentTheme } = useTheme()
  const user = useUser()

  const [readyToDelete, setReadyToDelete] = useState<TransactionType>()

  const showToast = (severity: "success" | "error", message: string) =>
    setAlertToast({
      open: true,
      severity,
      message,
      onClose: () => setAlertToast(undefined),
    })

  const handleDeleteTransaction = async (transaction: TransactionType) => {
    if (!user || !transaction) return

    try {
      await deleteTransaction({
        userId: user.id,
        rowId: transaction.id,
      })
      showToast("success", "Transaction permanently deleted successfully!")
    } catch {
      showToast("error", "Transaction could not be permanently deleted.")
    } finally {
      refreshDeletedTransactions()
      refreshTransactions()
    }
  }

  const handleUndoDeleteTransaction = async (transaction: TransactionType) => {
    if (!user || !transaction) return

    try {
      await undoSoftDeleteTransaction({
        userId: user.id,
        transactionId: transaction.id,
      })
      showToast("success", "Transaction added successfully!")
    } catch {
      showToast("error", "Transaction could not be added.")
    } finally {
      refreshDeletedTransactions()
      refreshTransactions()
    }
  }

  const sortedDeletedTransactions = useMemo(() => {
    return [...deletedTransactions].sort((a, b) => {
      return (
        new Date(b.deleted_at!).getTime() - new Date(a.deleted_at!).getTime()
      )
    })
  }, [deletedTransactions])

  return (
    <Stack direction={"column"} spacing={1}>
      <Typography variant={"h6"} sx={{ width: "100%", textAlign: "Center" }}>
        Recently Deleted Transactions
      </Typography>

      <Stack
        divider={
          <Divider
            orientation={"horizontal"}
            sx={{ borderColor: neutralColor.bg }}
          />
        }
      >
        {sortedDeletedTransactions.length === 0 ? (
          <Typography variant={"caption"} textAlign={"center"}>
            There are currently no deleted transactions
          </Typography>
        ) : (
          deletedTransactions.map((transaction) => {
            const mainTitle =
              transaction.note === "" ? transaction.category : transaction.note
            const transactionAmount = `$${numberToString(transaction.amount)}`

            return (
              <Stack
                key={transaction.id}
                className="bg-gray-2 dark:bg-[#020D1A]"
                direction={"row"}
                sx={{
                  position: "relative",
                  zIndex: 1,
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 1.5,
                  py: 0.5,
                }}
              >
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ width: "100%", alignItems: "center" }}
                >
                  <Stack direction={"column"}>
                    <Typography
                      sx={{
                        fontSize: ".9rem",
                        lineHeight: "20px",
                        color:
                          currentTheme === "light"
                            ? lightMode.primaryText
                            : darkMode.primaryText,
                      }}
                    >
                      {mainTitle} - {transaction.type}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        lineHeight: "16px",
                        color:
                          currentTheme === "light"
                            ? lightMode.secondaryText
                            : darkMode.secondaryText,
                      }}
                    >
                      {timestampToDateString(
                        dateTypeToTimestamp(transaction.date),
                      )}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack
                  direction={"row"}
                  spacing={2}
                  sx={{ minWidth: "fit-content" }}
                >
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      lineHeight: "36px",
                      alignContent: "center",
                    }}
                  >
                    {transactionAmount}
                  </Typography>

                  <Box>
                    {readyToDelete?.id === transaction.id ? (
                      <ConfirmCancelButton
                        onDelete={async () => {
                          await handleDeleteTransaction(transaction)
                        }}
                        onCancelDelete={() => {
                          setReadyToDelete(undefined)
                        }}
                      />
                    ) : (
                      <EditDeleteButton
                        onEdit={async () => {
                          await handleUndoDeleteTransaction(transaction)
                        }}
                        onSetDelete={() => {
                          setReadyToDelete(transaction)
                        }}
                      />
                    )}
                  </Box>
                </Stack>
              </Stack>
            )
          })
        )}
      </Stack>
    </Stack>
  )
}

export default RecentlyDeleted
