import { AccountTypeValue } from "@/api/v2/models"
import { saveAccountV2 } from "@/api/v2/requests"
import { Stack } from "@mui/material"
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
      <Stack gap={1} border={"1px solid red"}>
        <Stack direction={"row"} gap={1}>
          <label htmlFor="account-name">Account Name</label>
          <input
            id="account-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chase Checking"
          />
        </Stack>

        <Stack direction={"row"} gap={1}>
          <label htmlFor="account-type">Account Type</label>
          <select
            id="account-type"
            value={type}
            onChange={(e) => setType(e.target.value as AccountTypeValue)}
          >
            {ACCOUNT_TYPES.map((accountType) => (
              <option key={accountType.value} value={accountType.value}>
                {accountType.label}
              </option>
            ))}
          </select>
        </Stack>

        <button type="submit">Add Account</button>
      </Stack>
    </form>
  )
}

export default AddAccount
