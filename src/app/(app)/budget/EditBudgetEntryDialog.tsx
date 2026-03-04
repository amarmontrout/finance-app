import { updateBudget } from "@/app/api/Transactions/requests"
import { MoneyInputV2 } from "@/components/MoneyInput"
import { useUser } from "@/hooks/useUser"
import {
  AlertToastType,
  BudgetTransactionTypeV2,
  BudgetTypeV2,
  DateType,
  HookSetter,
} from "@/utils/type"
import {
  Dialog,
  DialogTitle,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  DialogContent,
  FormControlLabel,
  Checkbox,
  Stack,
  IconButton,
  Typography,
} from "@mui/material"
import { ChangeEvent, RefObject, useEffect, useState } from "react"
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"

const EditBudgetEntryDialog = ({
  openEditDialog,
  setOpenEditDialog,
  notes,
  budgetCategories,
  selectedEntry,
  refreshBudgetTransactions,
  today,
  setAlertToast,
  inputRef,
}: {
  openEditDialog: boolean
  setOpenEditDialog: HookSetter<boolean>
  notes: string[]
  budgetCategories: BudgetTypeV2[]
  selectedEntry: BudgetTransactionTypeV2 | null
  refreshBudgetTransactions: () => void
  today: DateType
  setAlertToast: HookSetter<AlertToastType | undefined>
  inputRef: RefObject<HTMLInputElement | null>
}) => {
  const user = useUser()

  const BUDGET_ENTRY_INIT: BudgetTransactionTypeV2 = {
    id: 0,
    category: "",
    note: "",
    amount: 0,
    isReturn: false,
    date: today,
  }

  const [updatedBudgetEntry, setUpdatedBudgetEntry] =
    useState<BudgetTransactionTypeV2>(BUDGET_ENTRY_INIT)
  const [noteValue, setNoteValue] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const refreshDialog = () => {
    if (selectedEntry) {
      setUpdatedBudgetEntry(selectedEntry)
    }
    setNoteValue(null)
  }

  useEffect(() => {
    refreshDialog()
  }, [selectedEntry])

  const update = async () => {
    if (!user || !selectedEntry) return
    setIsLoading(true)
    try {
      await updateBudget({
        userId: user.id,
        rowId: selectedEntry.id,
        body: updatedBudgetEntry,
      })
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "success",
        message: "Budget entry updated successfully!",
      })
    } catch (error) {
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined)
        },
        severity: "error",
        message: "Budget entry could not be updated.",
      })
    } finally {
      refreshBudgetTransactions()
      setOpenEditDialog(false)
      setNoteValue(null)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={openEditDialog} fullScreen>
      <DialogTitle>
        <Stack
          width={"100%"}
          height={"100%"}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <IconButton
            onClick={() => {
              setOpenEditDialog(false)
              refreshDialog()
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography>{`Edit Budget Transaction`}</Typography>

          <IconButton
            loading={isLoading}
            disabled={
              !updatedBudgetEntry.note || updatedBudgetEntry.amount <= 0
            }
            onClick={update}
          >
            <SaveIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Box className="flex flex-col gap-5" padding={"10px"}>
          {openEditDialog && (
            <MoneyInputV2
              value={updatedBudgetEntry.amount}
              setValue={setUpdatedBudgetEntry}
              inputRef={inputRef}
              autoFocus={openEditDialog}
            />
          )}

          <Stack direction={"row"} spacing={1}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                className="w-full"
                label="Category"
                value={updatedBudgetEntry.category}
                name={"category"}
                onChange={(e) =>
                  setUpdatedBudgetEntry((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                {budgetCategories.map((budget) => {
                  return (
                    <MenuItem value={budget.category}>
                      {budget.category}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <Autocomplete
                className="w-full"
                freeSolo
                options={notes.map((option) => option)}
                value={noteValue}
                onChange={(event: any, newValue: string | null) => {
                  setNoteValue(newValue)
                }}
                inputValue={updatedBudgetEntry.note}
                onInputChange={(event, newInputValue) => {
                  setUpdatedBudgetEntry((prev) => ({
                    ...prev,
                    note: newInputValue,
                  }))
                }}
                renderInput={(params) => <TextField {...params} label="Note" />}
              />
            </FormControl>
          </Stack>

          <FormControlLabel
            control={
              <Checkbox
                checked={updatedBudgetEntry.isReturn}
                sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setUpdatedBudgetEntry((prev) => ({
                    ...prev,
                    isReturn: e.target.checked,
                  }))
                }}
              />
            }
            label="Is a return?"
          />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default EditBudgetEntryDialog
