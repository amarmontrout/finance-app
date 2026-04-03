import { TransactionType, HookSetter } from "@/utils/type"
import { Autocomplete, TextField } from "@mui/material"

const NoteAutocomplete = ({
  transaction,
  setTransaction,
  sortedNotes,
  handleClose,
}: {
  transaction: TransactionType
  setTransaction: HookSetter<TransactionType>
  sortedNotes: string[]
  handleClose?: () => void
}) => {
  return (
    <Autocomplete
      freeSolo
      options={sortedNotes}
      inputValue={transaction.note}
      onInputChange={(_, newValue) => {
        setTransaction((prev) => ({ ...prev, note: newValue }))
      }}
      onClose={handleClose}
      openOnFocus
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
          placeholder="Add Note"
          sx={{
            fontSize: "16px",
            maxHeight: 24,
            "& .MuiInputBase-root": { fontSize: "16px" },
            "& input": {
              padding: 0,
              margin: 0,
              fontSize: "16px",
            },
          }}
        />
      )}
    />
  )
}

export default NoteAutocomplete
