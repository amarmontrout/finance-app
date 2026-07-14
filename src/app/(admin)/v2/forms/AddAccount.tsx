import { AccountTypeValue, V2AccountType } from "@/api/v2/models"
import { saveAccountV2, updateAccountV2 } from "@/api/v2/requests"
import { HookSetter } from "@/types/types"
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

const ACCOUNT_TYPES = [
  { value: "Checking", label: "Checking" },
  { value: "Savings", label: "Savings" },
  { value: "Credit Card", label: "Credit Card" },
]

const AddAccount = ({
  accountToEdit,
  setAccountToEdit,
}: {
  accountToEdit: V2AccountType | undefined
  setAccountToEdit: HookSetter<V2AccountType | undefined>
}) => {
  const [name, setName] = useState("")
  const [type, setType] = useState<AccountTypeValue>("Checking")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (accountToEdit) {
        await updateAccountV2({
          rowId: accountToEdit.account_id,
          body: {
            name: name,
            type: type,
          },
        })
        setAccountToEdit(undefined)
      } else {
        await saveAccountV2({
          body: {
            name: name,
            type: type,
          },
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setName("")
      setType("Checking")
    }
  }

  useEffect(() => {
    if (accountToEdit) {
      setName(accountToEdit.name)
      setType(accountToEdit.type)
    }
  }, [accountToEdit])

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={1}>
        <TextField
          id={"account-name"}
          size={"small"}
          label={"Account Name"}
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            value={type}
            onChange={(e) => setType(e.target.value as AccountTypeValue)}
          >
            {ACCOUNT_TYPES.map((accountType) => (
              <MenuItem key={accountType.value} value={accountType.value}>
                {accountType.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type={"submit"} variant={"contained"} disabled={name === ""}>
          {accountToEdit ? "Update" : "Add"} Account
        </Button>
      </Stack>
    </form>
  )
}

export default AddAccount
