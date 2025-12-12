import { MONTHS } from "@/globals/globals"
import saveTransaction, { TransactionData } from "@/utils/saveTransaction"
import { List, Stack, ListItemButton, ListItemText, Collapse, ListItem, IconButton } from "@mui/material"
import { useState, useEffect } from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import { accentColorPrimarySelected, darkMode, lightMode } from "@/globals/colors";
import { useTheme } from "next-themes";

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

  const DeleteButton = (props: {id: string}) => {
    const { id } = props
    return (
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

  useEffect(() => {
    console.log(theme)
  }, [theme])

  return (

      <Stack  direction={"row"} width={"100%"} minHeight={0} flex={1} overflow={"hidden"} gap={1}>
        <List sx={{maxWidth: "25%", flex: 1, minHeight: 0, overflowY: "auto"}}>
          {
            Object.entries(transactions).map(([year, _]) => {
              return (
                <ListItemButton 
                  key={year} 
                  onClick={() => {handleSelectYear(year)}} 
                  sx={{ 
                    backgroundColor: year === selectedYear ? accentColorPrimarySelected : "none",
                    borderRadius: "10px"
                  }}
                >
                  <ListItemText primary={year}/>
                </ListItemButton>
              )
            })
          }
        </List>

        <Collapse in={expandYear} timeout="auto" sx={{maxWidth: "25%", flex: 1, minHeight: 0, overflowY: "auto"}} unmountOnExit>
        <List>
            { transactions[selectedYear] &&
              Object.entries(transactions[selectedYear]).map(([month, _]) => {
                return (
                  <ListItemButton 
                    key={month} 
                    onClick={() => {handleSelectMonth(month)}}
                    sx={{ 
                      backgroundColor: month === selectedMonth ? accentColorPrimarySelected : "none",
                      borderRadius: "10px"
                    }}
                  >
                    <ListItemText primary={month} />
                  </ListItemButton>
                )
              })
            }
        </List>
        </Collapse>

        <Collapse in={expandMonth} timeout="auto" sx={{maxWidth: "50%", flex: 1, minHeight: 0, overflowY: "auto"}} unmountOnExit>
          <List>
            { selectedYear && selectedMonth &&
              transactions[selectedYear]?.[selectedMonth]?.map((details) => {
                return (
                  <ListItem 
                    key={details.id}
                    secondaryAction={
                      confirmId === details.id
                        ? <ConfirmCancel details={details}/> 
                        : <DeleteButton id={details.id}/>
                    }
                    sx={{
                      margin: "2px auto",
                      backgroundColor: currentTheme === "light"? lightMode.elevatedBg : darkMode.elevatedBg,
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
      </Stack>

  )
}

export default TransactionsList