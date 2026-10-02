import { AccountType } from "@/app/(api)/accounts/models"
import { softDeleteAccount } from "@/app/(api)/accounts/requests"
import { TEXT_COLOR } from "@/app/data/colors"
import { HookSetter } from "@/app/lib/types"
import AddIcon from "@mui/icons-material/Add"
import { Button, IconButton, Stack, Typography } from "@mui/material"
import { useState } from "react"
import AccountForm from "../forms/AccountForm"
import { AlertToastType } from "./AlertToast"

const AccountsCard = ({
  accounts,
  refreshAccounts,
  setAlertToast,
}: {
  accounts: AccountType[]
  refreshAccounts: () => Promise<void>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const [showAccountForm, setShowAccountForm] = useState<boolean>(false)
  const [accountToEdit, setAccountToEdit] = useState<AccountType>()

  const deleteAccount = async (account: AccountType) => {
    await softDeleteAccount({ accountId: account.account_id })
    setAlertToast({
      open: true,
      onClose: () => setAlertToast(undefined),
      severity: "success",
      message: "Account deleted successfully!",
    })
    await refreshAccounts()
  }

  return (
    <Stack direction={"column"} spacing={2}>
      <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
        <Typography variant={"h5"}>Accounts</Typography>

        <IconButton
          size={"small"}
          disableRipple
          hidden={!accounts.length}
          onClick={() => {
            setShowAccountForm(!showAccountForm)
            setAccountToEdit(undefined)
          }}
        >
          <AddIcon
            fontSize={"small"}
            sx={{
              transform: showAccountForm ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </IconButton>
      </Stack>

      {(showAccountForm || !accounts.length) && (
        <AccountForm
          accountToEdit={accountToEdit}
          setAccountToEdit={setAccountToEdit}
          refreshAccounts={refreshAccounts}
          setAlertToast={setAlertToast}
        />
      )}

      <Stack direction={"column"} spacing={1}>
        {accounts.map((account) => {
          return (
            <Stack
              key={account.account_id}
              direction={"row"}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stack direction={"column"}>
                <Typography variant={"body1"}>{account.name}</Typography>
                <Typography variant={"body2"}>{account.type}</Typography>
              </Stack>

              <Stack direction={"row"}>
                <Button
                  size={"small"}
                  sx={{ color: TEXT_COLOR }}
                  onClick={() => {
                    setAccountToEdit(account)
                    setShowAccountForm(true)
                  }}
                >
                  Edit
                </Button>

                <Button
                  size={"small"}
                  sx={{ color: TEXT_COLOR }}
                  onClick={() => deleteAccount(account)}
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
}

export default AccountsCard
