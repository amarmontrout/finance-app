import { V2CategoryType, V2MerchantType } from "@/api/v2/models"
import { updateMerchantV2 } from "@/api/v2/requests"
import AddIcon from "@mui/icons-material/Add"
import { Box, Button, IconButton, Stack, Typography } from "@mui/material"
import { useState } from "react"
import AddMerchant from "../forms/AddMerchant"
import { getToday } from "../utils"

const MerchantSettingsCard = ({
  merchants,
  categories,
}: {
  merchants: V2MerchantType[]
  categories: V2CategoryType[]
}) => {
  const [showMerchantForm, setShowMerchantForm] = useState<boolean>(false)
  const [merchantToEdit, setMerchantToEdit] = useState<V2MerchantType>()

  const softDeleteMerchant = async (merchant: V2MerchantType) => {
    await updateMerchantV2({
      rowId: merchant.merchant_id,
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
        <Typography variant={"h5"}>Merchants</Typography>

        <IconButton
          size={"small"}
          disableRipple
          onClick={() => {
            setShowMerchantForm(!showMerchantForm)
            setMerchantToEdit(undefined)
          }}
        >
          <AddIcon
            fontSize={"small"}
            sx={{
              transform: showMerchantForm ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </IconButton>
      </Stack>

      {(showMerchantForm || merchants.length === 0) && (
        <Box paddingX={1}>
          <AddMerchant
            categories={categories}
            merchantToEdit={merchantToEdit}
            setMerchantToEdit={setMerchantToEdit}
          />
        </Box>
      )}

      <Stack direction={"column"} spacing={1} paddingX={1} paddingBottom={1}>
        {merchants.map((merchant) => {
          return (
            <Stack
              key={merchant.merchant_id}
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant={"body1"}>{merchant.name}</Typography>

              <Stack direction={"row"}>
                <Button
                  size={"small"}
                  onClick={() => {
                    setMerchantToEdit(merchant)
                    setShowMerchantForm(true)
                  }}
                >
                  Edit
                </Button>

                {/* <Button
                  size={"small"}
                  onClick={() => {
                    softDeleteMerchant(merchant)
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

export default MerchantSettingsCard
