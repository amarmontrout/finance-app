import { updateBudget } from "@/app/api/Transactions/requests"
import { MoneyInputV2 } from "@/components/MoneyInput"
import { lightMode, darkMode } from "@/globals/colors"
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
  DialogActions,
  Button,
  DialogContent,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import { useTheme } from "next-themes"
import { ChangeEvent, useEffect, useState } from "react"

const EditBudgetEntryDialog = ({
  openEditDialog,
  setOpenEditDialog,
  notes,
  budgetCategories,
  selectedEntry,
  refreshBudgetTransactions,
  today,
  setAlertToast,
}: {
  openEditDialog: boolean
  setOpenEditDialog: HookSetter<boolean>
  notes: string[]
  budgetCategories: BudgetTypeV2[]
  selectedEntry: BudgetTransactionTypeV2 | null
  refreshBudgetTransactions: () => void
  today: DateType
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const { theme: currentTheme } = useTheme()
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
    }
  }

  return (
    <Dialog open={openEditDialog}>
      <DialogTitle>{`Edit Budget Transaction`}</DialogTitle>

      <DialogContent>
        <Box className="flex flex-col gap-5" padding={"10px"}>
          <FormControl>
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
                  <MenuItem value={budget.category}>{budget.category}</MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <FormControl>
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

          <MoneyInputV2
            value={updatedBudgetEntry.amount}
            setValue={setUpdatedBudgetEntry}
          />

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

      <DialogActions>
        <Button
          variant={"contained"}
          onClick={update}
          sx={{
            backgroundColor:
              currentTheme === "light"
                ? [lightMode.success]
                : [darkMode.success],
          }}
        >
          {"Update"}
        </Button>

        <Button
          variant={"contained"}
          onClick={() => {
            setOpenEditDialog(false)
            refreshDialog()
          }}
          sx={{
            backgroundColor:
              currentTheme === "light" ? [lightMode.error] : [darkMode.error],
          }}
        >
          {"Cancel"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditBudgetEntryDialog
