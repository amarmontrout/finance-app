import { MONTHS } from "@/globals/globals"
import saveTransaction, { TransactionData } from "@/utils/saveTransaction"
import { List, Stack, ListItemButton, ListItemText, Collapse, ListItem, IconButton } from "@mui/material"
import { useState, useEffect } from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { accentColorPrimarySelected, darkMode, lightMode } from "@/globals/colors";
import { useTheme } from "next-themes";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { getMonthTotal, getYearTotal } from "@/utils/getTotals";

type TransactionsListProps = {
  type: "income" | "expenses"
  transactions: TransactionData
  refreshTransactions: () => void
  selectedMonth: string
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>
  selectedYear: string
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>
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
    setSelectedYear
  }: TransactionsListProps) => {
    const [expandYear, setExpandYear] = useState(false)
    const [expandMonth, setExpandMonth] = useState(false)
    const [confirmId, setConfirmId] = useState<string | null>(null)

    const today = new Date()
    const currentYear = String(today.getFullYear())
    const currentMonth = MONTHS[today.getMonth()]

    const theme = useTheme()
    const currentTheme = theme.theme
    const listItemColor = currentTheme === "light"? lightMode.elevatedBg : darkMode.elevatedBg

  const handleSelectYear = (year: string) => {
    if (selectedYear === year) {
      setExpandYear(!expandYear)
      setSelectedYear("")
    } else {
      setSelectedYear(year)
      setExpandYear(true)
    }

    setSelectedMonth("")
    setExpandMonth(false)
  }

  const handleSelectMonth = (month: string) => {
    if (selectedMonth === month) {
      setExpandMonth(!expandMonth)
      setSelectedMonth("")
    } else {
      setSelectedMonth(month)
      setExpandMonth(true)
    }
  }

  const handleDeleteTransaction = (passedYear: string, passedMonth: string, passedId: string) => {
    const updated = {...transactions}
    
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
              alert("TODO: Add edit feature")
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

  const ConfirmCancel = (props: { details: Details }) => {
    const { details } = props
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton 
          edge="end"
          onClick={
            () => {
              setConfirmId(null)
              handleDeleteTransaction(selectedYear, selectedMonth, details.id)
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

  useEffect(() => {
    // If current year exists in data
    if (transactions[currentYear]) {
      // Set year if not already selected
      if (selectedYear !== currentYear) {
        setSelectedYear(currentYear)
        setExpandYear(true)
      }

      // And if current month also exists, select it
      if (transactions[currentYear][currentMonth]) {
        setSelectedMonth(currentMonth)
        setExpandMonth(true)
      }
    }

    // If selected year got deleted
    if (selectedYear && !transactions[selectedYear]) {
      setSelectedYear("")
      setExpandYear(false)
      setSelectedMonth("")
      setExpandMonth(false)
      return
    }

    // If selected month got deleted
    if (selectedMonth && selectedYear && !transactions[selectedYear][selectedMonth]) {
      setSelectedMonth("")
      setExpandMonth(false)
    }
  }, [transactions])

  const YearList = () => {
    return (
      <Collapse in={true} timeout="auto" sx={{maxWidth: "25%", flex: 1, minHeight: 0, overflowY: "auto"}} unmountOnExit>
        <List className="flex flex-col gap-2">
          { transactions &&
            Object.entries(transactions).map(([year, _]) => {
              const yearTotal = getYearTotal(year, transactions)
                
              return (
                <ListItemButton 
                  key={year} 
                  onClick={() => {handleSelectYear(year)}} 
                  sx={{ 
                    backgroundColor: year === selectedYear ? accentColorPrimarySelected : listItemColor,
                    borderRadius: "10px"
                  }}
                >
                  <ListItemText primary={year} secondary={yearTotal}/>

                  {year === selectedYear ? <ArrowForwardIosIcon/> : <></>}
                </ListItemButton>
              )
            })
          }
        </List>
      </Collapse>
    )
  }

  const MonthList = () => {
    return (
      <Collapse in={expandYear} timeout="auto" sx={{maxWidth: "25%", flex: 1, minHeight: 0, overflowY: "auto"}} unmountOnExit>
        <List className="flex flex-col gap-2">
          { transactions[selectedYear] &&
            Object.entries(transactions[selectedYear]).map(([month, _]) => {
              const monthTotal = getMonthTotal(selectedYear, month, transactions)

              return (
                <ListItemButton 
                  key={month} 
                  onClick={() => {handleSelectMonth(month)}}
                  sx={{ 
                    backgroundColor: month === selectedMonth ? accentColorPrimarySelected : listItemColor,
                    borderRadius: "10px"
                  }}
                >
                  <ListItemText primary={month} secondary={monthTotal}/>

                  {month === selectedMonth ? <ArrowForwardIosIcon/> : <></>}
                </ListItemButton>
              )
            })
          }
        </List>
      </Collapse>
    )
  }

  const DetailsList = () => {
    return (
      <Collapse in={expandMonth} timeout="auto" sx={{maxWidth: "50%", flex: 1, minHeight: 0, overflowY: "auto"}} unmountOnExit>
        <List className="flex flex-col gap-2">
          { transactions[selectedYear] && transactions[selectedYear][selectedMonth] &&
            transactions[selectedYear]?.[selectedMonth]?.map((details) => {
              return (
                <ListItem 
                  key={details.id}
                  secondaryAction={
                    confirmId === details.id
                      ? <ConfirmCancel details={details}/> 
                      : <EditDeleteButton id={details.id}/>
                  }
                  sx={{
                    backgroundColor: listItemColor,
                    borderRadius: "10px"
                  }}
                >
                  <ListItemText 
                    primary={`$ ${details.amount}`}
                    secondary={details.category}
                  />
                </ListItem>
              )
            })
          }
        </List>
      </Collapse>
    )
  }

  return (
      <Stack  direction={"row"} width={"100%"} minHeight={0} flex={1} overflow={"hidden"} gap={.5}>
        <YearList/>
        <MonthList/>
        <DetailsList/>
      </Stack>

  )
}

export default TransactionsList