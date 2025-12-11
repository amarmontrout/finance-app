import saveTransaction, { TransactionData } from "@/utils/saveTransaction"
import { Collapse, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import { MONTHS } from "@/globals/globals";

const TransactionsList = (props:{
    type: "income" | "expenses"
    transactions: TransactionData
    refreshTransactions: () => void
  }) => {
  const today = new Date()
  const currentYear = String(today.getFullYear())
  const currentMonth = MONTHS[today.getMonth()]
  const {type, transactions, refreshTransactions} = props
  const [selectedYear, setSelectedYear] = useState("")
  const [expandYear, setExpandYear] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("")
  const [expandMonth, setExpandMonth] = useState(false);

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


  return (
    <List sx={{ width: '90%', margin: "0 auto" }}>
      <Stack  direction={"row"} width={"100%"} height={"100%"}>
        <Stack direction={"column"} height={"fit-content"} width={"30%"}>
          {
            Object.entries(transactions).map(([year, _]) => {
              return (
                <ListItemButton 
                  key={year} 
                  onClick={() => {handleSelectYear(year)}} 
                  sx={{ 
                    border: year === selectedYear ? "2px solid AccentColor" : "none",
                    borderRadius: "10px"
                  }}
                >
                  <ListItemText primary={year} />
                </ListItemButton>
              )
            })
          }
        </Stack>

        <Collapse in={expandYear} timeout="auto" sx={{width: "30%"}} unmountOnExit>
          { selectedYear &&
            Object.entries(transactions[selectedYear]).map(([month, _]) => {
              return (
                <ListItemButton 
                  key={month} 
                  onClick={() => {handleSelectMonth(month)}}
                  sx={{ 
                    border: month === selectedMonth ? "2px solid AccentColor" : "none",
                    borderRadius: "10px"
                  }}
                >
                  <ListItemText primary={month} />
                </ListItemButton>
              )
            })
          }
        </Collapse>

        <Collapse in={expandMonth} timeout="auto" sx={{width: "40%"}} unmountOnExit>
          { selectedYear && selectedMonth &&
            transactions[selectedYear]?.[selectedMonth]?.map((details) => {
              return (
                <ListItem 
                  key={details.id}
                  secondaryAction={
                    <IconButton 
                      edge="end"
                      onClick={
                        () => {
                          handleDeleteTransaction(selectedYear, selectedMonth, details.id)
                        }
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText 
                    primary={details.category} 
                    sx={{
                      width: "50%"
                    }}
                  />
                  <ListItemText 
                    primary={`$ ${details.amount}`} 
                    sx={{
                      width: "50%"
                    }}
                  />
                </ListItem>
              )
            })
          }
        </Collapse>
      </Stack>
    </List>
  )
}

export default TransactionsList