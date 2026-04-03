import { neutralColor } from "@/globals/colors"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { Stack, Typography } from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import { HookSetter, TransactionType } from "@/utils/type"

const CategoryHeader = ({
  entries,
  sortedEntries,
  setExpandedCategories,
  category,
  isExpanded,
}: {
  entries: TransactionType[]
  sortedEntries: TransactionType[]
  setExpandedCategories: HookSetter<Record<string, boolean>>
  category: string
  isExpanded: boolean
}) => {
  const categoryTotal = entries.reduce((sum, entry) => {
    return entry.is_return ? sum - entry.amount : sum + entry.amount
  }, 0)
  const totalCount = sortedEntries.length
  const toggleExpandCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      marginTop={1}
      paddingX={1}
      paddingY={0.5}
      borderBottom={2}
      borderColor={neutralColor}
      sx={{
        cursor: "pointer",
      }}
    >
      <Stack
        direction={"row"}
        spacing={0.5}
        alignItems={"center"}
        onClick={() => toggleExpandCategory(category)}
      >
        <Typography fontSize={17}>{category}</Typography>

        <Typography fontSize={12} sx={{ opacity: 0.8 }}>
          ({totalCount})
        </Typography>

        {sortedEntries.length > 2 &&
          (isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />)}
      </Stack>

      <Typography>${formattedStringNumber(categoryTotal)}</Typography>
    </Stack>
  )
}

export default CategoryHeader
