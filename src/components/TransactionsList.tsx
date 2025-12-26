import { 
  List, 
  Stack, 
  ListItemButton, 
  ListItemText, 
  ListItem, 
  IconButton, 
  Box, 
  useMediaQuery 

} from "@mui/material"
import { useState, useEffect } from "react"
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { 
  accentColorPrimarySelected, 
  darkMode, 
  lightMode 
} from "@/globals/colors"
import { useTheme } from "next-themes"
import { getMonthTotal, getYearTotal } from "@/utils/getTotals"
import { cleanNumber, formattedStringNumber } from "@/utils/helperFunctions"
import { saveTransaction, TransactionData } from "@/utils/transactionStorage"

type TransactionsListProps = {
  type: "income" | "expenses"
  transactions: TransactionData
  refreshTransactions: () => void
  selectedMonth: string
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>
  selectedYear: string
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedId: React.Dispatch<React.SetStateAction<string>>
}

const TransactionsList = ({
  type, 
  transactions, 
  refreshTransactions,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  setOpenEditDialog,
  setSelectedId
}: TransactionsListProps) => {

  const [confirmId, setConfirmId] = useState<string | null>(null)
  const { theme: currentTheme } = useTheme()
  const listItemColor = currentTheme === "light" ?
    lightMode.elevatedBg 
    : darkMode.elevatedBg

  useEffect(() => {
    if (!transactions || Object.keys(transactions).length === 0) return

    if (transactions[selectedYear]) {
      setSelectedYear(selectedYear)

      if (transactions[selectedYear][selectedMonth]) {
        setSelectedMonth(selectedMonth)
      } else {
        setSelectedMonth("")
      }
    } else {
      setSelectedYear("")
      setSelectedMonth("")
    }
  }, [transactions])

  const handleDeleteTransaction = (
    passedYear: string, 
    passedMonth: string, 
    passedId: string
  ) => {
    const updated = structuredClone(transactions)

    if (updated[passedYear] && updated[passedYear][passedMonth]) {
      updated[passedYear][passedMonth] = 
        updated[passedYear][passedMonth].filter(
          (transaction) => transaction.id !== passedId
        )

      // Remove month if empty
      if (updated[passedYear][passedMonth].length === 0) {
        delete updated[passedYear][passedMonth]
      }

      // Remove year if empty
      if (Object.keys(updated[passedYear]).length === 0) {
        delete updated[passedYear]
      }

      // Check if the **entire object is empty**
      if (Object.keys(updated).length === 0) {
        localStorage.removeItem(type) // fully clean
      } else {
        saveTransaction({ key: type, updatedTransactionData: updated })
      }

      refreshTransactions()
    } else {
      console.warn("Year or month not found in records.")
    }
  }

  const EditDeleteButton = (props: {id: string}) => {
    const { id } = props
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton 
          edge="end"
          onClick={
            () => {
              setOpenEditDialog(true)
              setSelectedId(id)
            }
          }
        >
          <EditIcon/>
        </IconButton>

        <IconButton 
          edge="end"
          onClick={
            () => {
              setConfirmId(id)
            }
          }
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    )
  }

  const ConfirmCancel = (props: { id: string }) => {
    const { id } = props
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton 
          edge="end"
          onClick={
            () => {
              setConfirmId(null)
              if (!selectedYear || !selectedMonth) return
              handleDeleteTransaction(selectedYear, selectedMonth, id)
            }
          }
        >
          <DeleteIcon/>
        </IconButton>

        <IconButton 
          edge="end"
          onClick={
            () => {
              setConfirmId(null)
            }
          }
        >
          <CancelIcon/>
        </IconButton>
      </Stack>
    )
  }

  const YearList = () => {
    const isMdUp = useMediaQuery("(min-width: 768px)")

    return (
      <Box className="w-full md:w-[30%] overflow-x-auto md:overflow-x-hidden">
        <List className="flex flex-row gap-2 md:flex-col whitespace-nowrap">
          { transactions &&
            Object.entries(transactions).map(([year, _]) => {
              const yearTotal = getYearTotal(year, transactions)
                
              return (
                <ListItemButton 
                  className="flex flex-col md:flex-row"
                  key={year} 
                  onClick={() => {
                    setSelectedYear(year)
                    setSelectedMonth("")
                  }} 
                  sx={{ 
                    backgroundColor: year === selectedYear ?
                      accentColorPrimarySelected 
                      : listItemColor,
                    borderRadius: "10px",
                    minWidth: "fit-content"
                  }}
                >
                  <ListItemText primary={year} secondary={`$${yearTotal}`}/>

                  {year === selectedYear &&
                    (isMdUp ? (
                      <KeyboardArrowRightIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    ))}
                </ListItemButton>
              )
            })
          }
        </List>
      </Box>
    )
  }

  const MonthList = () => {
    return (
      <Box className="flex-[2]">
        <List className="flex flex-col gap-2">
          { transactions[selectedYear] &&
            Object.entries(transactions[selectedYear]).map(([month, _]) => {
              const monthTotal = getMonthTotal(
                selectedYear, 
                month, 
                transactions
              )

              return (
                <ListItemButton 
                  key={month} 
                  onClick={() => {setSelectedMonth(month)}}
                  sx={{ 
                    backgroundColor: month === selectedMonth ?
                      accentColorPrimarySelected 
                      : listItemColor,
                    borderRadius: "10px",
                    minWidth: "fit-content"
                  }}
                >
                  <ListItemText primary={month} secondary={`$${monthTotal}`}/>

                  {
                    month === selectedMonth ?
                      <KeyboardArrowRightIcon/> 
                      : <></>
                  }
                </ListItemButton>
              )
            })
          }
        </List>
      </Box>
    )
  }

  const DetailsList = () => {
    return (
      <Box className="flex-[3]">
        <List className="flex flex-col gap-2">
          { transactions[selectedYear] 
            && transactions[selectedYear][selectedMonth] 
            && transactions[selectedYear]?.[selectedMonth]?.map((details) => {
              return (
                <ListItem 
                  key={details.id}
                  secondaryAction={
                    confirmId === details.id
                      ? <ConfirmCancel id={details.id}/> 
                      : <EditDeleteButton id={details.id}/>
                  }
                  sx={{
                    backgroundColor: listItemColor,
                    borderRadius: "10px",
                    minWidth: "fit-content"
                  }}
                >
                  <ListItemText 
                    primary={`$${
                      formattedStringNumber(
                        cleanNumber(
                          details.amount
                        )
                      )
                    }`}
                    secondary={details.category}
                  />
                </ListItem>
              )
            })
          }
        </List>
      </Box>
    )
  }

  return (
    <Box
      className="flex flex-col md:flex-row sm:gap-2"
    >
      <YearList/>
      <Box 
        className="flex flex-row gap-2 w-full md:w-[70%]"
      >
        <MonthList/>
        <DetailsList/>        
      </Box>
    </Box>
  )
}

export default TransactionsList