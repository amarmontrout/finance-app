import { V2AccountType } from "@/api/v2/models"
import { updateAccountV2 } from "@/api/v2/requests"
import AddIcon from "@mui/icons-material/Add"
import { Box, Button, IconButton, Stack, Typography } from "@mui/material"
import { useState } from "react"
import AddAccount from "../forms/AddAccount"
import { getToday } from "../utils"

const AccountSettingsCard = ({ accounts }: { accounts: V2AccountType[] }) => {
  const [showAccountForm, setShowAccountForm] = useState<boolean>(false)
  const [accountToEdit, setAccountToEdit] = useState<V2AccountType>()

  const softDeleteAccount = async (account: V2AccountType) => {
    await updateAccountV2({
      rowId: account.account_id,
      body: {
        deleted_at: getToday(),
      },
    })
  }

  return (
    <Stack
      direction={"column"}
      spacing={1}
      divider={<hr />}
      bgcolor={"white"}
      borderRadius={2}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        paddingX={1}
        paddingTop={1}
      >
        <Typography variant={"h5"}>Accounts</Typography>

        <IconButton
          size={"small"}
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
                  onClick={() => {
                    setAccountToEdit(account)
                    setShowAccountForm(true)
                  }}
                >
                  Edit
                </Button>

                {/* <Button
                  size={"small"}
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
