"use client"

import ShowCaseCard from "@/components/ShowCaseCard"
import { BudgetType, useBudgetContext } from "@/contexts/budget-context"
import { accentColorSecondary, darkMode, lightMode } from "@/globals/colors"
import { BUDGET_KEY } from "@/globals/globals"
import { saveBudget } from "@/utils/budgetStorage"
import { 
  Box, 
  Button, 
  FormControl, 
  InputAdornment, 
  InputLabel, 
  List, 
  ListItem, 
  ListItemText, 
  OutlinedInput 
} from "@mui/material"
import { useTheme } from "next-themes"
import { ChangeEvent, useEffect, useState } from "react"

const BUDGET_INIT: BudgetType = {
  category: "",
  amount: ""
}

const AddBudget = () => {
  const {budgetInfo, refreshBudgetInfo} = useBudgetContext()

  useEffect(() => {
    refreshBudgetInfo()
  }, [])

  const [budgetCategory, setBudgetCategory] = useState<BudgetType>(BUDGET_INIT)

  const { theme: currentTheme } = useTheme()
  const listItemColor = currentTheme === "light" ?
    lightMode.elevatedBg 
    : darkMode.elevatedBg

  const handleCategory = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBudgetCategory(prev => ({
      ...prev,
      category: e.target.value,
    }));
  }

  const handleAmount = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let digits = e.target.value.replace(/\D/g, "");
    const cents = digits.slice(-2);
    let dollars = digits.slice(0, -2);
    dollars = dollars.replace(/^0+/, "");
    const formatted = `${dollars}.${cents}`;

    if (formatted.length <= 7) {
      setBudgetCategory(prev => ({
        ...prev,
        amount: dollars || cents ? formatted : "",
      }));
    }
  }

  const resetFormData = () => {
    setBudgetCategory(BUDGET_INIT)
  }

  const save = () => {
    saveBudget({key: BUDGET_KEY, budget: budgetCategory})
    refreshBudgetInfo()
    resetFormData()
  }

  return (
    <ShowCaseCard title={"Add Budget"}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        overflow={"hidden"}
        paddingTop={"5px"}
      >
        <Box className="flex flex-row gap-2 pb-[12px]">
          <FormControl>
            <InputLabel>Category</InputLabel>
            <OutlinedInput
              className="w-full sm:w-[175px]"
              label={"Category"}
              value={budgetCategory.category}
              name={"category"}
              onChange={e => handleCategory(e)}
              />
          </FormControl>

          <FormControl>
            <InputLabel>Amount</InputLabel>
            <OutlinedInput
              className="w-full sm:w-[175px]"
              label={"Amount"}
              value={budgetCategory.amount}
              name={"amount"}
              onChange={e => handleAmount(e)}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              />
          </FormControl> 

          <Button
            variant={"contained"} 
            disabled={
              budgetCategory.category === ""
              || budgetCategory.amount === ""
            }
            onClick={save}
            sx={{
              backgroundColor: accentColorSecondary
            }}
          >
            {"Add Budget"}
          </Button>
        </Box>

        <hr style={{ width: "100%" }} />

        <Box
          flex={1}
          overflow={"auto"}
        >
          <List className="flex flex-col gap-2">
            { budgetInfo &&
              (budgetInfo).map((buget) => {                 
                return (
                  <ListItem
                    key={buget.category} 
                    // secondaryAction={
                    //   confirmSelection === item.name
                    //   ? <ConfirmCancel/> 
                    //   : <EditDeleteButton selection={item}/>
                    // }
                    sx={{ 
                      backgroundColor: listItemColor,
                      borderRadius: "10px"
                    }}
                  >
                    <ListItemText 
                      primary={buget.category} 
                      secondary={`$${buget.amount}`}
                    />
                  </ListItem>
                )
              })
            }
          </List>
        </Box>
      </Box>
    </ShowCaseCard>
  )
}

export default AddBudget