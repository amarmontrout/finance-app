import { V2CreateTransactionType } from "@/api/v2/models"
import MoneyInput from "@/global/components/MoneyInput"
import { HookSetter } from "@/types/types"
import { Box, Stack, TextField, Typography } from "@mui/material"
import { RefObject } from "react"
import { formatDate } from "../utils"
import { ActiveFieldType } from "./AddTransaction"

const Row = ({
  active,
  label,
  display,
  edit,
  onClick,
}: {
  active?: boolean
  label: string
  display: React.ReactNode
  edit?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}) => {
  return (
    <Stack
      direction={"row"}
      sx={{
        minHeight: "36px",
        justifyContent: "space-between",
        alignItems: "stretch",
      }}
    >
      <Typography
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "center",
        }}
      >
        {label}
      </Typography>
      <Box
        onClick={onClick}
        sx={{
          minWidth: 0,
          flex: 1.5,
          textAlign: "right",
          alignContent: "Center",
        }}
      >
        {active ? edit : display}
      </Box>
    </Stack>
  )
}

const AddReturn = ({
  returnTransaction,
  setReturnTransaction,
  activeReturnField,
  setActiveReturnField,
  creatingReturn,
  inputRef,
}: {
  returnTransaction: V2CreateTransactionType
  setReturnTransaction: HookSetter<V2CreateTransactionType>
  activeReturnField: ActiveFieldType
  setActiveReturnField: HookSetter<ActiveFieldType>
  creatingReturn: boolean
  inputRef: RefObject<HTMLInputElement | null>
}) => {
  return (
    <Stack direction={"column"}>
      <MoneyInput
        value={returnTransaction.amount}
        setValue={setReturnTransaction}
        inputRef={inputRef}
        autoFocus={creatingReturn}
      />

      <Stack direction={"column"} spacing={0.5} divider={<hr />}>
        {/* DATE */}
        <Row
          active={activeReturnField === "date"}
          label={"Date"}
          display={
            <Typography>
              {formatDate(returnTransaction.transaction_date)}
            </Typography>
          }
          edit={
            <TextField
              id={"date"}
              fullWidth
              autoFocus={activeReturnField === "date"}
              type={"date"}
              label={"Transaction Date"}
              size={"small"}
              value={returnTransaction.transaction_date}
              onChange={(e) =>
                setReturnTransaction((prev) => ({
                  ...prev,
                  transaction_date: e.target.value,
                }))
              }
            />
          }
          onClick={
            activeReturnField !== "date"
              ? () => {
                  setActiveReturnField("date")
                }
              : undefined
          }
        />

        {/* DESCRIPTION */}
        <Row
          active={activeReturnField === "description"}
          label={"Description"}
          display={
            <Typography>
              {returnTransaction.description !== ""
                ? returnTransaction.description
                : "Add a Description"}
            </Typography>
          }
          edit={
            <TextField
              id={"description"}
              variant={"standard"}
              size={"small"}
              value={returnTransaction.description}
              autoFocus={activeReturnField === "description"}
              onChange={(e) =>
                setReturnTransaction((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              multiline
              minRows={1}
              sx={{
                width: "100%",
                "& .MuiInputBase-root": {
                  minHeight: 36,
                },
                "& textarea": {
                  fontSize: "16px",
                },
              }}
              placeholder="Enter Description"
            />
          }
          onClick={
            activeReturnField !== "description"
              ? () => setActiveReturnField("description")
              : undefined
          }
        />
      </Stack>
    </Stack>
  )
}

export default AddReturn
