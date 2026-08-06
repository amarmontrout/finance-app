import { V2AccountType } from "@/api/v2/models"
import { updateAccountV2 } from "@/api/v2/requests"
import { AlertToastType, HookSetter } from "@/types/types"
import AddIcon from "@mui/icons-material/Add"
import { Box, Button, IconButton, Stack, Typography } from "@mui/material"
import { useState } from "react"
import AddAccount from "../forms/AddAccount"

const AccountSettingsCard = ({
  accounts,
  refreshAccounts,
  setAlertToast,
}: {
  accounts: V2AccountType[]
  refreshAccounts: () => Promise<void>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const [showAccountForm, setShowAccountForm] = useState<boolean>(false)
  const [accountToEdit, setAccountToEdit] = useState<V2AccountType>()

  const softDeleteAccount = async (account: V2AccountType) => {
    await updateAccountV2({
      rowId: account.account_id,
      body: {
        deleted_at: new Date().toISOString(),
      },
    })
    setAlertToast({
      open: true,
      onClose: () => {
        setAlertToast(undefined)
      },
      severity: "success",
      message: "Account deleted successfully!",
    })
    refreshAccounts()
  }

  return (
    <Stack
      direction={"column"}
      spacing={1}
      divider={
        <hr
          style={{
            borderColor: "#102A1B",
          }}
        />
      }
      bgcolor={"rgba(255,255,255,0.15)"}
      borderRadius={5}
      padding={2}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        paddingX={1}
        paddingTop={1}
      >
        <Typography
          variant={"h5"}
          sx={{
            color: "#102A1B",
          }}
        >
          Accounts
        </Typography>

        <IconButton
          size={"small"}
          sx={{
            color: "#102A1B",
          }}
          disableRipple
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

      {(showAccountForm || accounts.length === 0) && (
        <Box paddingX={1}>
          <AddAccount
            accountToEdit={accountToEdit}
            setAccountToEdit={setAccountToEdit}
            refreshAccounts={refreshAccounts}
            setAlertToast={setAlertToast}
          />
        </Box>
      )}

      <Stack direction={"column"} spacing={1} paddingX={1} paddingBottom={1}>
        {accounts.map((account) => {
          return (
            <Stack
              key={account.account_id}
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack direction={"column"}>
                <Typography variant={"body1"}>{account.name}</Typography>
                <Typography variant={"body2"}>{account.type}</Typography>
              </Stack>

              <Stack direction={"row"}>
                <Button
                  size={"small"}
                  sx={{
                    color: "#F5F1E8",
                    bgcolor: "#102A1B",
                  }}
                  onClick={() => {
                    setAccountToEdit(account)
                    setShowAccountForm(true)
                  }}
                >
                  Edit
                </Button>

                {/* <Button
                  size={"small"}
                  sx={{
                    color: "#F5F1E8",
                    bgcolor: "#102A1B",
                  }}
                  onClick={() => {
                    softDeleteAccount(account)
                  }}
                >
                  Delete
                </Button> */}
              </Stack>
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
}

export default AccountSettingsCard
