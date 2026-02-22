"use client"

import { FlexColWrapper } from "@/components/Wrappers"
import { useEffect, useMemo, useState } from "react"
import RemainingBudget from "./RemainingBudget"
import BudgetEntries from "./BudgetEntries"
import { getWeekBounds } from "@/utils/helperFunctions"
import EditBudgetEntryDialog from "./EditBudgetEntryDialog"
import { useTheme } from "next-themes"
import { 
  Box, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  Tab, 
  Tabs 
} from "@mui/material"
import { useTransactionContext } from "@/contexts/transactions-context"
import { useCategoryContext } from "@/contexts/categories-context"
import { BudgetTransactionTypeV2, BudgetTypeV2 } from "@/utils/type"

const Budget = () => {
  const {
    budgetTransactionsV2,
    refreshBudgetTransactionsV2
  } = useTransactionContext()
  const { budgetCategoriesV2 } = useCategoryContext()
  const { start, end, prevStart, prevEnd } = getWeekBounds()
  const { theme: currentTheme } = useTheme()

  const [week, setWeek] = useState<"prev" | "current">("current")
  const [notes, setNotes] = useState<string[]>([])
  const [selectedEntry, setSelectedEntry] = 
    useState<BudgetTransactionTypeV2 | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [value, setValue] = useState(0)

  useEffect(() => {
    let notes: string[] = []
    budgetTransactionsV2.map((entry) => {
      if (!notes.includes(entry.note)) {
        notes.push(entry.note)
      }
    })
    setNotes(notes)
  }, [budgetTransactionsV2])

  const weeklyTransactions = useMemo(() => {
    return budgetTransactionsV2
  }, [budgetTransactionsV2, start, end, prevStart, prevEnd, week])

  const remainingBudgetCategories = useMemo(() => {
    let remaining: BudgetTypeV2[] = []

    budgetCategoriesV2.map((category) => {
      let budget = category.amount
      let total = 0

      weeklyTransactions.map((entry) => {
        if (entry.category === category.category) {
          if (entry.isReturn) {
            total -= entry.amount
          } else {
            total += entry.amount
          }
        }
      })

      remaining.push({
        id: category.id,
        category: category.category, 
        amount: budget-total
      })
    })

    return remaining
  }, [budgetCategoriesV2, weeklyTransactions])

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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

  return (
    <FlexColWrapper gap={2}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Remaining Budget"/>
          <Tab label="Budget Entires"/>
        </Tabs>
      </Box>

      <Box
        className="flex flex-col sm:flex-row gap-3 h-full"
        paddingTop={"10px"}
      >
        <FormControl>
          <InputLabel>View</InputLabel>
          <Select
            className="w-full sm:w-[175px]"
            label="View"
            value={week}
            name={"view"}
            onChange={e => setWeek(e.target.value)}
          >
            <MenuItem key={"prev"} value={"prev"}>Previous Week</MenuItem>
            <MenuItem key={"current"} value={"current"}>Current Week</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <hr style={{width: "100%"}}/>

      <TabPanel value={value} index={0}>
        <RemainingBudget
          budgetCategories={remainingBudgetCategories}
          currentTheme={currentTheme}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <BudgetEntries
          budgetCategories={budgetCategoriesV2}
          budgetTransactions={weeklyTransactions}
          refreshBudgetTransactions={refreshBudgetTransactionsV2}
          notes={notes}
          setOpenEditDialog={setOpenEditDialog}
          setSelectedEntry={setSelectedEntry}
          currentTheme={currentTheme}
          week={week}
        />
      </TabPanel>

      <EditBudgetEntryDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        notes={notes}
        budgetCategories={budgetCategoriesV2}
        selectedEntry={selectedEntry}
        refreshBudgetTransactions={refreshBudgetTransactionsV2}
      />
    </FlexColWrapper>
  )
}

export default Budget