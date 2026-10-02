import { HookSetter } from "@/app/lib/types"
import AddIcon from "@mui/icons-material/Add"
import { Autocomplete, Stack, TextField, Typography } from "@mui/material"

const AutocompleteInput = <T,>({
  options,
  value,
  onChange,
  getOptionLabel,
  isOptionEqualToValue,
  placeholder,
  openOnFocus,
  onBlur,
  setAddFormOpen,
}: {
  /** A list of options that will be shown in the Autocomplete. Merchants, Accounts, Categories. */
  options: T[]
  /** The value of the autocomplete. Merchant, Account, Category. */
  value: T | null
  /** Callback fired when the value changes. */
  onChange: (value: T | null) => void
  /** Used to determine the string value for a given option. (a) =>  a.name */
  getOptionLabel: (option: T) => string
  /** Used to determine if the option represents the given value. (a, b) => a.name === b.name*/
  isOptionEqualToValue: (option: T, value: T) => boolean
  placeholder: string
  openOnFocus?: boolean
  onBlur: () => void
  setAddFormOpen?: HookSetter<boolean>
}) => {
  return (
    <Autocomplete<T, false, false, false>
      options={options}
      value={value}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      onChange={(_event, newValue) => {
        onChange(newValue)
      }}
      openOnFocus={openOnFocus}
      onBlur={onBlur}
      popupIcon={null}
      freeSolo={false}
      noOptionsText={
        setAddFormOpen ? (
          <Stack
            direction={"row"}
            spacing={1}
            sx={{ justifyContent: "center" }}
          >
            <AddIcon />
            <Typography onClick={() => setAddFormOpen(true)}>
              Add option
            </Typography>
          </Stack>
        ) : (
          "No options"
        )
      }
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
          variant={"standard"}
          placeholder={placeholder}
          autoFocus={openOnFocus}
          sx={{
            fontSize: "16px",
            maxHeight: 36,
            "& .MuiInputBase-root": { fontSize: "16px" },
            "& input": { padding: 0, margin: 0, fontSize: "16px" },
          }}
        />
      )}
    />
  )
}

export default AutocompleteInput
