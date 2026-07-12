import { AccountTypeValue } from "@/api/v2/models"
import { saveAccountV2 } from "@/api/v2/requests"
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material"
import { useState } from "react"

const ACCOUNT_TYPES = [
  { value: "Checking", label: "Checking" },
  { value: "Savings", label: "Savings" },
  { value: "Credit Card", label: "Credit Card" },
]

const AddAccount = () => {
  const [name, setName] = useState("")
  const [type, setType] = useState<AccountTypeValue>("Checking")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    await saveAccountV2({
      body: {
        name: name,
        type: type,
      },
    })

    setName("")
    setType("Checking")
  }

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
          Add Account
        </Button>
      </Stack>
    </form>
  )
}

export default AddAccount
