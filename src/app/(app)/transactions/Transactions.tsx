"use client"

import { FlexColWrapper } from "@/components/Wrappers"
import TransactionFeed from "./TransactionFeed"
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Tabs, 
  Tab, 
  Button,
  Stack, 
  Typography, 
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@mui/material"
import { useCategoryContext } from "@/contexts/categories-context"
import { useMemo, useState } from "react"
import { 
  formattedStringNumber, 
  getCurrentDateInfo 
} from "@/utils/helperFunctions"
import AddIcon from '@mui/icons-material/Add';
import { 
  accentColorPrimarySelected, 
  darkMode, 
  lightMode 
} from "@/globals/colors"
import { useTheme } from "next-themes"
import { MONTHS } from "@/globals/globals"
import ShowCaseCard from "@/components/ShowCaseCard"
import { useTransactionContext } from "@/contexts/transactions-context"
import { getYearTotalV2 } from "@/utils/getTotals"
import { deleteIncome, deleteExpense } from "@/app/api/Transactions/requests"
import DeleteIcon from '@mui/icons-material/Delete'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import AddIncomeDialog from "../income/AddIncomeDialog"
import AddExpenseDialog from "../expenses/AddExpenseDialog"
import 
  EditTransactionDetailDialog 
from "@/components/EditTransactionDetailDialog"
import { useUser } from "@/hooks/useUser"
import { SelectedTransactionType } from "@/utils/type"

const Transactions = () => {
  const { 
    incomeTransactionsV2,
    refreshIncomeTransactionsV2,
    expenseTransactionsV2,
    refreshExpenseTransactionsV2
  } = useTransactionContext()
  const { 
    yearsV2, 
    incomeCategoriesV2, 
    expenseCategoriesV2, 
    excludedSet 
  } = useCategoryContext()
  const { currentYear, currentMonth } = getCurrentDateInfo()
  const { theme: currentTheme } = useTheme()
  const user = useUser()

  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [openAddIncomeDialog, setOpenAddIncomeDialog] = useState<boolean>(false)
  const [openAddExpenseDialog, setOpenAddExpenseDialog] = 
      useState<boolean>(false)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [tab, setTab] = useState(0)
  const [selectedTransaction, setSelectedTransaction] = 
    useState<SelectedTransactionType | null>(null)

  const yearIncomeTotal = useMemo(() => {
    return getYearTotalV2(
        selectedYear, 
        incomeTransactionsV2,
        excludedSet
      )
  }, [selectedYear, incomeTransactionsV2, excludedSet])

  const yearExpenseTotal = useMemo(() => {
     return getYearTotalV2(
        selectedYear, 
        expenseTransactionsV2,
        excludedSet
      )
  }, [selectedYear, expenseTransactionsV2, excludedSet])

  const listItemColor = currentTheme === "light" ?
    lightMode.elevatedBg 
    : darkMode.elevatedBg

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  }
  
  const TabPanel = ({ 
    children, 
    value, 
    index, 
    ...other 
  }: {
    children?: React.ReactNode
    index: number
    value: number
  }) => {
    return (
      <div hidden={value !== index} {...other} >
        {
          value === index 
            && <Box>{children}</Box>
        }
      </div>
    )
  }

  const handleDeleteTransaction = async (id: number) => {
    if (!user || !selectedTransaction) return

    if (selectedTransaction.type === "income") {
      await deleteIncome({
        userId: user.id,
        rowId: id
      })
      refreshIncomeTransactionsV2()
    } else {
      await deleteExpense({
        userId: user.id,
        rowId: id
      })
      refreshExpenseTransactionsV2()
    }

    setSelectedTransaction(null)
  }

  const EditDeleteButton = ({ id, transactionType }: {id: number, transactionType: "income" | "expenses"}) => {
    return (
      <Stack direction={"row"} gap={2}>
        <IconButton 
          edge="end"
          onClick={
            () => {
              setOpenEditDialog(true)
              setSelectedTransaction({id: id, type: transactionType})
            }
          }
        >
          <EditIcon/>
        </IconButton>

        <IconButton 
          edge="end"
          onClick={
            () => {
              setSelectedTransaction({id: id, type: transactionType})
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
          onClick={() => {
            if (!selectedYear || !selectedMonth) return
            handleDeleteTransaction(id)
          }}
        >
          <DeleteIcon/>
        </IconButton>

        <IconButton 
          edge="end"
          onClick={
            () => {
              setSelectedTransaction(null)
            }
          }
        >
          <CancelIcon/>
        </IconButton>
      </Stack>
    )
  }

  return (
    <FlexColWrapper gap={3}>
      <Stack direction={"row"} justifyContent={"space-evenly"}>
        <Button
          onClick={() => {setOpenAddIncomeDialog(true)}}
          size="large"
          sx={{
            backgroundColor: accentColorPrimarySelected,
            color: currentTheme === "light" 
              ? lightMode.primaryText
              : darkMode.primaryText
          }}
        >
          <AddIcon/>
          Add Income
        </Button>

        <Button
          onClick={() => {setOpenAddExpenseDialog(true)}}
          size="large"
          sx={{
            backgroundColor: accentColorPrimarySelected,
            color: currentTheme === "light" 
              ? lightMode.primaryText
              : darkMode.primaryText
          }}
        >
          <AddIcon/>
          Add Expense
        </Button>
      </Stack>

      <FormControl fullWidth>
        <InputLabel>Year</InputLabel>
        <Select
          className="w-full sm:w-[175px]"
          label="Year"
          value={selectedYear}
          name={"year"}
          onChange={e => setSelectedYear(Number(e.target.value))}
        >
          {
            yearsV2.map((year) => {
              return (
                <MenuItem key={year.name} value={year.name}>
                  {year.name}
                </MenuItem>
              )
            })
          }
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Month</InputLabel>
        <Select
          className="w-full sm:w-[175px]"
          label="Month"
          value={selectedMonth}
          name={"month"}
          onChange={e => setSelectedMonth(e.target.value)}
          disabled={tab === 0}
        >
          {
            MONTHS.map((month) => {
              return (
                <MenuItem key={month} value={month} >
                  {month}
                </MenuItem>
              )
            })
          }
        </Select>
      </FormControl>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={handleChangeTab}>
          <Tab label="Totals"/>
          <Tab label="Transactions"/>
          <Tab label="Modify"/>
        </Tabs>
      </Box>

      <TabPanel value={tab} index={0}>
        <ShowCaseCard 
          title={`Totals for ${selectedYear}`}
        >
          <Stack direction={"row"} width={"100%"}>
            <Stack direction={"column"} width={"34%"}>
              <Typography>{selectedYear}</Typography>

              {
                MONTHS.map((month) => {
                  return (
                    <Typography key={month}>{month}</Typography>
                  )
                })
              }
            </Stack>

            <Stack direction={"column"} width={"33%"}>
              <Typography>{`+ $${yearIncomeTotal}`}</Typography>

              {
                MONTHS.map((month) => {
                  const total = incomeTransactionsV2.reduce((acc, income) => {
                    if (
                      income.month === month &&
                      income.year === selectedYear &&
                      !excludedSet.has(income.category)
                    ) {
                      return acc + income.amount
                    }
                    return acc
                  }, 0)

                  return (
                    <Typography key={`${month}-${total}`} color={"success"}>
                      {`+  $${formattedStringNumber(total)}`}
                    </Typography>
                  )
                })
              }
            </Stack>

            <Stack direction={"column"} width={"33%"}>
              <Typography>{`- $${yearExpenseTotal}`}</Typography>

              {
                MONTHS.map((month) => {
                  const total = expenseTransactionsV2.reduce((acc, expense) => {
                    if (
                      expense.month === month &&
                      expense.year === selectedYear &&
                      !excludedSet.has(expense.category)
                    ) {
                      return acc + expense.amount
                    }
                    return acc
                  }, 0)

                  return (
                    <Typography key={`${month}-${total}`} color={"error"}>
                      {`-  $${formattedStringNumber(total)}`}
                    </Typography>
                  )
                })
              }
            </Stack>
          </Stack>
        </ShowCaseCard>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <TransactionFeed
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <ShowCaseCard title={"Modify Transactions"}>
          <Stack direction={"column"} spacing={2}>
            <Box>
              {
                <List className="flex flex-col gap-2">
                  {incomeTransactionsV2.map((details) => {
                    if (
                      details.year !== selectedYear 
                      || details.month !== selectedMonth
                    ) return

                      return (
                        <ListItem
                          key={details.id}
                          secondaryAction={
                            selectedTransaction?.id === details.id
                              ? <ConfirmCancel id={details.id}/> 
                              : <EditDeleteButton id={details.id} transactionType={"income"}/>
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
              }
            </Box>

            <Box>
              {
                <List className="flex flex-col gap-2">
                  {expenseTransactionsV2.map((details) => {
                    if (
                      details.year !== selectedYear 
                      || details.month !== selectedMonth
                    ) return

                      return (
                        <ListItem
                          key={details.id}
                          secondaryAction={
                            selectedTransaction?.id === details.id
                              ? <ConfirmCancel id={details.id}/> 
                              : <EditDeleteButton id={details.id} transactionType={"expenses"}/>
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
              }
            </Box>
          </Stack>
        </ShowCaseCard>
      </TabPanel>

      <AddIncomeDialog
        incomeCategories={incomeCategoriesV2}
        income={"income"}
        refreshIncomeTransactions={refreshIncomeTransactionsV2}
        years={yearsV2}
        openAddIncomeDialog={openAddIncomeDialog}
        setOpenAddIncomeDialog={setOpenAddIncomeDialog}
      />

      <AddExpenseDialog
        expenseCategories={expenseCategoriesV2}
        expenses={"expenses"}
        refreshExpenseTransactions={refreshExpenseTransactionsV2}
        years={yearsV2}
        openAddExpenseDialog={openAddExpenseDialog}
        setOpenAddExpenseDialog={setOpenAddExpenseDialog}
      />

      <EditTransactionDetailDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={setSelectedTransaction}
        transactions={
          selectedTransaction?.type === "income"
            ? incomeTransactionsV2
            : expenseTransactionsV2
        }
        categories={
          selectedTransaction?.type === "income"
            ? incomeCategoriesV2
            : expenseCategoriesV2
        }
        currentTheme={currentTheme}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        refreshIncomeTransactions={refreshIncomeTransactionsV2}
        refreshExpenseTransactions={refreshExpenseTransactionsV2}
      />
    </FlexColWrapper>
  )
}

export default Transactions