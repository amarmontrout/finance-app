import { 
  List, 
  Stack, 
  ListItemButton, 
  ListItemText, 
  ListItem, 
  IconButton, 
  Box,
  Divider, 
} from "@mui/material"
import { useState, useEffect, useMemo } from "react"
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { 
  accentColorPrimarySelected, 
  darkMode, 
  lightMode 
} from "@/globals/colors"
import { useTheme } from "next-themes"
import { getMonthTotalV2, getYearTotalV2 } from "@/utils/getTotals"
import { formattedStringNumber } from "@/utils/helperFunctions"
import { TransactionTypeV2 } from "@/utils/type"
import { deleteExpense, deleteIncome } from "@/app/api/Transactions/requests"
import { useUser } from "@/hooks/useUser"
import { MONTHS } from "@/globals/globals"

const TransactionsList = ({
  type, 
  transactions, 
  refreshTransactions,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  setOpenEditDialog,
  setSelectedId,
  excludedSet
}: {
  type: "income" | "expenses"
  transactions: TransactionTypeV2[]
  refreshTransactions: () => void
  selectedMonth: string
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>
  selectedYear: string
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>
  excludedSet: Set<string>
}) => {
  const { theme: currentTheme } = useTheme()
  const user = useUser()

  const [confirmId, setConfirmId] = useState<number | null>(null)
  
  const listItemColor = currentTheme === "light" ?
    lightMode.elevatedBg 
    : darkMode.elevatedBg

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setSelectedYear("")
      setSelectedMonth("")
      return
    }
    const yearNum = Number(selectedYear)

    const years = Array.from(new Set(transactions.map(t => t.year)))
    const monthsForYear = Array.from(
      new Set(
        transactions
        .filter(t => t.year === yearNum)
        .map(t => t.month)
      )
    ).sort((a, b) => MONTHS.indexOf(a) - MONTHS.indexOf(b))

    if (!years.includes(yearNum)) {
      const newestYear = Math.max(...years)
      setSelectedYear(newestYear.toString())
      setSelectedMonth("")
      return
    }
    const today = new Date()
    const currentMonthName = MONTHS[today.getMonth()]

    if (!monthsForYear.includes(selectedMonth)) {
      if (monthsForYear.includes(currentMonthName)) {
        setSelectedMonth(currentMonthName)
      } else {
        setSelectedMonth(monthsForYear[0] ?? "")
      }
    }
  }, [transactions, selectedYear, selectedMonth])

  const handleDeleteTransaction = async ( 
    id: number
  ) => {
    if (!user) return

    if (type === "income") {
      await deleteIncome({
        userId: user.id,
        rowId: id
      })
    } else if (type === "expenses") {
      await deleteExpense({
        userId: user.id,
        rowId: id
      })
    }
    refreshTransactions()
    setSelectedId(null)
  }

  const EditDeleteButton = ({ id }: {id: number}) => {
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

  const ConfirmCancel = ({ id }: { id: number }) => {
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton 
          edge="end"
          onClick={
            () => {
              setConfirmId(null)
              if (!selectedYear || !selectedMonth) return
              handleDeleteTransaction(id)
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
    const years = useMemo(() => {
      return Array.from(
        new Set(transactions.map(t => t.year))
      ).sort((a, b) => b - a)
    }, [transactions])

    return (
      <Box className="w-full md:w-[30%] overflow-x-auto md:overflow-x-hidden">
        <List className="flex flex-row gap-2 md:flex-col whitespace-nowrap">
          { years.map((year) => {
              const yearTotal = getYearTotalV2(
                year, 
                transactions,
                excludedSet
              )
                
              return (
                <ListItemButton 
                  className="flex flex-col md:flex-row"
                  key={year} 
                  onClick={() => {
                    setSelectedYear(year.toString())
                    setSelectedMonth("")
                  }} 
                  sx={{ 
                    backgroundColor: year.toString() === selectedYear ?
                      accentColorPrimarySelected 
                      : listItemColor,
                    borderRadius: "15px",
                    minWidth: "fit-content"
                  }}
                >
                  <ListItemText primary={year} secondary={`$${yearTotal}`}/>
                </ListItemButton>
              )
            })
          }
        </List>
      </Box>
    )
  }

  const MonthList = () => {
    const months = useMemo(() => {
      if (!selectedYear) return []

      return Array.from(
        new Set(
          transactions
          .filter(t => t.year === Number(selectedYear))
          .map(t => t.month)
        )
      ).sort ((a, b) => MONTHS.indexOf(a) - MONTHS.indexOf(b))
    }, [transactions, selectedYear])

    return (
      <Box className="flex-[2]">
        <List className="flex flex-col gap-2">
          { months.map((month) => {
              const monthTotal = getMonthTotalV2(
                Number(selectedYear), 
                month, 
                transactions,
                excludedSet
              )

              return (
                <ListItemButton 
                  key={month} 
                  onClick={() => {setSelectedMonth(month)}}
                  sx={{ 
                    backgroundColor: month === selectedMonth ?
                      accentColorPrimarySelected 
                      : listItemColor,
                    borderRadius: "15px",
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
          {transactions.map((details) => {
            if (
              String(details.year) !== selectedYear 
              || details.month !== selectedMonth
            ) return

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
                    borderRadius: "15px",
                    minWidth: "fit-content"
                  }}
                >
                  <ListItemText 
                    primary={`$${
                      formattedStringNumber(
                        details.amount
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

      <Divider 
        className="flex md:hidden w-full"
        sx={{ 
          borderColor: currentTheme === "light" ?
            lightMode.borderStrong 
            : darkMode.borderStrong,
          borderWidth: 1
        }}
      />

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