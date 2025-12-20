import saveTransaction, { TransactionData } from "@/utils/saveTransaction"
import { List, Stack, ListItemButton, ListItemText, ListItem, IconButton, Box } from "@mui/material"
import { useState, useEffect } from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { accentColorPrimarySelected, darkMode, lightMode } from "@/globals/colors";
import { useTheme } from "next-themes";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { getMonthTotal, getYearTotal } from "@/utils/getTotals";
import { useTransactionContext } from "@/contexts/transactions-context";
import { cleanNumber, formattedStringNumber } from "@/utils/helperFunctions";

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

type Details = {
  id: string,
  category: string,
  amount: string
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

  const { currentYear, currentMonth, isMockData } = useTransactionContext()
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const theme = useTheme()
  const currentTheme = theme.theme
  const listItemColor = currentTheme === "light"? lightMode.elevatedBg : darkMode.elevatedBg

  useEffect(() => {
    if (!transactions || Object.keys(transactions).length === 0) return

    if (transactions[currentYear]) {
      setSelectedYear(currentYear)

      if (transactions[currentYear][currentMonth]) {
        setSelectedMonth(currentMonth)
      } else {
        setSelectedMonth("")
      }
    } else {
      setSelectedYear("")
      setSelectedMonth("")
    }
  }, [transactions])

  const handleDeleteTransaction = (passedYear: string, passedMonth: string, passedId: string) => {
    const updated = structuredClone(transactions)
    
    if (updated[passedYear] && updated[passedYear][passedMonth]) {
      updated[passedYear][passedMonth] = updated[passedYear][passedMonth].filter(
        (transaction) => transaction.id !== passedId
      )

      if (updated[passedYear][passedMonth].length === 0) {
        delete updated[passedYear][passedMonth];
      }

      if (Object.keys(updated[passedYear]).length === 0) {
        delete updated[passedYear];
      }

      console.log("Updated:", updated);
      saveTransaction({key: type, updatedTransactionData: updated})
      refreshTransactions()
    } else {
      console.warn("Year or month not found in records.");
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
          disabled={isMockData}
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
          disabled={isMockData}
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
    return (
      <Box width={"25%"}>
        <List className="flex flex-col gap-2">
          { transactions &&
            Object.entries(transactions).map(([year, _]) => {
              const yearTotal = getYearTotal(year, transactions)
                
              return (
                <ListItemButton 
                  key={year} 
                  onClick={() => {
                    setSelectedYear(year)
                    setSelectedMonth("")
                  }} 
                  sx={{ 
                    backgroundColor: year === selectedYear ? accentColorPrimarySelected : listItemColor,
                    borderRadius: "10px"
                  }}
                >
                  <ListItemText primary={year} secondary={`$${yearTotal}`}/>

                  {year === selectedYear ? <ArrowForwardIosIcon/> : <></>}
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
      <Box width={"25%"}>
        <List className="flex flex-col gap-2">
          { transactions[selectedYear] &&
            Object.entries(transactions[selectedYear]).map(([month, _]) => {
              const monthTotal = getMonthTotal(selectedYear, month, transactions)

              return (
                <ListItemButton 
                  key={month} 
                  onClick={() => {setSelectedMonth(month)}}
                  sx={{ 
                    backgroundColor: month === selectedMonth ? accentColorPrimarySelected : listItemColor,
                    borderRadius: "10px"
                  }}
                >
                  <ListItemText primary={month} secondary={`$${monthTotal}`}/>

                  {month === selectedMonth ? <ArrowForwardIosIcon/> : <></>}
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
      <Box width={"50%"}>
        <List className="flex flex-col gap-2">
          { transactions[selectedYear] && transactions[selectedYear][selectedMonth] &&
            transactions[selectedYear]?.[selectedMonth]?.map((details) => {
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
                    borderRadius: "10px"
                  }}
                >
                  <ListItemText 
                    primary={`$${formattedStringNumber(cleanNumber(details.amount))}`}
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
    <Stack  direction={"row"} width={"100%"} gap={.5}>
      <YearList/>
      <MonthList/>
      <DetailsList/>
    </Stack>
  )
}

export default TransactionsList