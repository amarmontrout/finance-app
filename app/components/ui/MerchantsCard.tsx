import { CategoryType } from "@/app/(api)/categories/models"
import { MerchantType } from "@/app/(api)/merchants/models"
import { softDeleteMerchant } from "@/app/(api)/merchants/requests"
import { TEXT_COLOR } from "@/app/data/colors"
import { HookSetter } from "@/app/lib/types"
import AddIcon from "@mui/icons-material/Add"
import { Button, IconButton, Stack, Typography } from "@mui/material"
import { useState } from "react"
import MerchantForm from "../forms/MerchantForm"
import { AlertToastType } from "./AlertToast"

const MerchantsCard = ({
  merchants,
  categories,
  refreshMerchants,
  setAlertToast,
}: {
  merchants: MerchantType[]
  categories: CategoryType[]
  refreshMerchants: () => Promise<void>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const [showMerchantForm, setShowMerchantForm] = useState<boolean>(false)
  const [merchantToEdit, setMerchantToEdit] = useState<MerchantType>()

  const deleteMerchant = async (merchant: MerchantType) => {
    await softDeleteMerchant({ merchantId: merchant.merchant_id })
    setAlertToast({
      open: true,
      onClose: () => setAlertToast(undefined),
      severity: "success",
      message: "Merchant deleted successfully!",
    })
    await refreshMerchants()
  }

  return (
    <Stack direction={"column"} spacing={2}>
      <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
        <Typography variant={"h5"}>Merchants</Typography>

        <IconButton
          size={"small"}
          disableRipple
          hidden={!merchants.length}
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

      {(showMerchantForm || !merchants.length) && (
        <MerchantForm
          categories={categories}
          merchantToEdit={merchantToEdit}
          setMerchantToEdit={setMerchantToEdit}
          refreshMerchants={refreshMerchants}
          setAlertToast={setAlertToast}
        />
      )}

      <Stack direction={"column"} spacing={1}>
        {merchants.map((merchant) => {
          return (
            <Stack
              key={merchant.merchant_id}
              direction={"row"}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant={"body1"}>{merchant.name}</Typography>

              <Stack direction={"row"}>
                <Button
                  size={"small"}
                  sx={{ color: TEXT_COLOR }}
                  onClick={() => {
                    setMerchantToEdit(merchant)
                    setShowMerchantForm(true)
                  }}
                >
                  Edit
                </Button>

                <Button
                  size={"small"}
                  sx={{ color: TEXT_COLOR }}
                  onClick={() => deleteMerchant(merchant)}
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

export default MerchantsCard
