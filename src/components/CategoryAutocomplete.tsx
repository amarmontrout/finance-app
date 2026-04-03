import { TransactionType, HookSetter, ChoiceType } from "@/utils/type"
import { Autocomplete, TextField } from "@mui/material"

const CategoryAutocomplete = ({
  transaction,
  setTransaction,
  categories,
  handleClose,
}: {
  transaction: TransactionType
  setTransaction: HookSetter<TransactionType>
  categories: ChoiceType[]
  handleClose?: () => void
}) => {
  return (
    <Autocomplete
      options={categories.map((c) => c.name)}
      value={transaction.category || ""}
      onChange={(_, newValue) => {
        if (newValue !== null) {
          setTransaction((prev) => ({ ...prev, category: newValue }))
        }
      }}
      onClose={handleClose}
      openOnFocus
      popupIcon={null}
      freeSolo={false}
      slotProps={{
        listbox: {
          style: {
            maxHeight: 5 * 39,
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          autoFocus
          placeholder="Select Category"
          sx={{
            fontSize: "16px",
            maxHeight: 24,
            "& .MuiInputBase-root": { fontSize: "16px" },
            "& input": { padding: 0, margin: 0, fontSize: "16px" },
          }}
        />
      )}
    />
  )
}

export default CategoryAutocomplete
