"use client"

import { FlexColWrapper } from "@/components/Wrappers"
import { useMemo, useState } from "react"
import RemainingBudget from "./RemainingBudget"
import BudgetEntries from "./BudgetEntries"
import { getCurrentDateInfo, getWeekBounds } from "@/utils/helperFunctions"
import EditBudgetEntryDialog from "./EditBudgetEntryDialog"
import { useTheme } from "next-themes"
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@mui/material"
import { useTransactionContext } from "@/contexts/transactions-context"
import { useCategoryContext } from "@/contexts/categories-context"
import { BudgetTransactionTypeV2, BudgetTypeV2, DateType } from "@/utils/type"
import AddBudgetEntryButton from "./AddBudgetEntryButton"

import { useUser } from "@/hooks/useUser"
import AddBudgetEntryDialog from "./AddBudgetEntryDialog"

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
    <div hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

const Budget = () => {
  const { budgetTransactionsV2, refreshBudgetTransactionsV2 } =
    useTransactionContext()
  const { budgetCategoriesV2 } = useCategoryContext()
  const { theme: currentTheme } = useTheme()
  const user = useUser()
  const { currentYear, currentDay, currentMonth } = getCurrentDateInfo()
  const TODAY: DateType = {
    month: currentMonth,
    day: currentDay,
    year: currentYear,
  }
  const { start, end, prevStart, prevEnd } = useMemo(() => {
    return getWeekBounds({
      month: currentMonth,
      day: currentDay,
      year: currentYear,
    })
  }, [])

  const prevWeek = {
    start: `${prevStart.month} ${prevStart.day}, ${prevStart.year}`,
    end: `${prevEnd.month} ${prevEnd.day}, ${prevEnd.year}`,
  }

  const currentWeek = {
    start: `${start.month} ${start.day}, ${start.year}`,
    end: `${end.month} ${end.day}, ${end.year}`,
  }

  const [week, setWeek] = useState<"prev" | "current">("current")
  const [selectedEntry, setSelectedEntry] =
    useState<BudgetTransactionTypeV2 | null>(null)
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)
  const [openAddBudgetEntryDialog, setOpenAddBudgetEntryDialog] =
    useState<boolean>(false)
  const [value, setValue] = useState(0)

  const notes = useMemo(() => {
    return [...new Set(budgetTransactionsV2.map((e) => e.note))]
  }, [budgetTransactionsV2])

  const weeklyTransactions = useMemo(() => {
    const toDate = (date: DateType) => {
      const monthIndex = new Date(`${date.month} 1, ${date.year}`).getMonth()
      return new Date(date.year, monthIndex, date.day)
    }

    const weekStart = toDate(week === "prev" ? prevStart : start)
    const weekEnd = toDate(week === "prev" ? prevEnd : end)

    return budgetTransactionsV2.filter((entry) => {
      if (!entry.date?.day) return false

      const entryDate = toDate(entry.date)

      return entryDate >= weekStart && entryDate <= weekEnd
    })
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
        amount: budget - total,
      })
    })

    return remaining
  }, [budgetCategoriesV2, weeklyTransactions])

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <FlexColWrapper gap={2}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Remaining Budget" />
          <Tab label="Entries" />
        </Tabs>
      </Box>

      <Box
        className="flex flex-col sm:flex-row gap-3 h-full"
        paddingTop={"10px"}
      >
        <FormControl>
          <InputLabel>Week</InputLabel>
          <Select
            className="w-full sm:w-[175px]"
            label="Week"
            value={week}
            name={"week"}
            onChange={(e) => setWeek(e.target.value)}
          >
            <MenuItem key={"prev"} value={"prev"}>
              {`${prevWeek.start} - ${prevWeek.end}`}
            </MenuItem>

            <MenuItem key={"current"} value={"current"}>
              {`${currentWeek.start} - ${currentWeek.end}`}
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      <hr style={{ width: "100%" }} />

      <AddBudgetEntryButton
        setOpenAddBudgetEntryDialog={setOpenAddBudgetEntryDialog}
      />

      <TabPanel value={value} index={0}>
        <RemainingBudget
          budgetCategories={remainingBudgetCategories}
          currentTheme={currentTheme}
        />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <BudgetEntries
          budgetTransactions={weeklyTransactions}
          refreshBudgetTransactions={refreshBudgetTransactionsV2}
          setOpenEditDialog={setOpenEditDialog}
          setSelectedEntry={setSelectedEntry}
          currentTheme={currentTheme}
        />
      </TabPanel>

      <AddBudgetEntryDialog
        openAddBudgetEntryDialog={openAddBudgetEntryDialog}
        setOpenAddBudgetEntryDialog={setOpenAddBudgetEntryDialog}
        budgetCategories={budgetCategoriesV2}
        today={TODAY}
        user={user}
        refreshBudgetTransactions={refreshBudgetTransactionsV2}
        notes={notes}
        currentTheme={currentTheme}
      />

      <EditBudgetEntryDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        notes={notes}
        budgetCategories={budgetCategoriesV2}
        selectedEntry={selectedEntry}
        refreshBudgetTransactions={refreshBudgetTransactionsV2}
        today={TODAY}
      />
    </FlexColWrapper>
  )
}

export default Budget
