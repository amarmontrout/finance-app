import {
  AccountType,
  AccountTypeValue,
  CreateAccountType,
} from "@/app/(api)/accounts/models"
import { createAccount, updateAccount } from "@/app/(api)/accounts/requests"
import { TEXT_COLOR } from "@/app/data/colors"
import { DEFAULT_ACCOUNT_TYPES } from "@/app/data/constants"
import { HookSetter } from "@/app/lib/types"
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material"
import { useEffect, useState } from "react"
import { AlertToastType } from "../ui/AlertToast"

const createInitialAccount = (): CreateAccountType => ({
  name: "",
  type: "Checking",
})

const AccountForm = ({
  accountToEdit,
  setAccountToEdit,
  refreshAccounts,
  setAlertToast,
}: {
  accountToEdit?: AccountType | undefined
  setAccountToEdit?: HookSetter<AccountType | undefined>
  refreshAccounts: () => Promise<void>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const [newAccount, setNewAccount] = useState<CreateAccountType>(
    createInitialAccount(),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (accountToEdit) {
        await updateAccount({
          accountId: accountToEdit.account_id,
          body: newAccount,
        })
        setAlertToast({
          open: true,
          onClose: () => setAlertToast(undefined),
          severity: "success",
          message: "Account updated successfully!",
        })
        setAccountToEdit && setAccountToEdit(undefined)
      } else {
        await createAccount({ body: newAccount })
      }
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "success",
        message: "Account saved successfully!",
      })
      setNewAccount(createInitialAccount())
      await refreshAccounts()
    } catch (error) {
      console.log(error)
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: "Failed to save/update account!",
      })
    }
  }

  useEffect(() => {
    if (accountToEdit) {
      setNewAccount({ ...accountToEdit })
    }
  }, [accountToEdit])

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={1}>
        <TextField
          id={"account-name"}
          size={"small"}
          label={"Account Name"}
          value={newAccount.name}
          onChange={(e) =>
            setNewAccount((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder={"e.g. Chase Checking"}
          required
        />

        <FormControl size={"small"}>
          <InputLabel id={"account-type-label"}>Account Type</InputLabel>

          <Select
            id={"account-type"}
            labelId={"account-type-label"}
            size={"small"}
            label={"Account Type"}
            value={newAccount.type}
            onChange={(e) =>
              setNewAccount((prev) => ({
                ...prev,
                type: e.target.value as AccountTypeValue,
              }))
            }
          >
            {DEFAULT_ACCOUNT_TYPES.map((accountType) => (
              <MenuItem key={accountType.value} value={accountType.value}>
                {accountType.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type={"submit"}
          sx={{ color: TEXT_COLOR }}
          disabled={newAccount.name === ""}
        >
          {accountToEdit ? "Update" : "Add"} Account
        </Button>
      </Stack>
    </form>
  )
}

export default AccountForm
