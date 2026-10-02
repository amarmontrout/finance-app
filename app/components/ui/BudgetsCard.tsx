import { BudgetType } from "@/app/(api)/budgets/models"
import { hardDeleteBudget } from "@/app/(api)/budgets/requests"
import { CategoryType } from "@/app/(api)/categories/models"
import { TEXT_COLOR } from "@/app/data/colors"
import { currencyFormatter } from "@/app/lib/functions/formatters"
import { HookSetter } from "@/app/lib/types"
import AddIcon from "@mui/icons-material/Add"
import { Button, IconButton, Stack, Typography } from "@mui/material"
import { useState } from "react"
import BudgetForm from "../forms/BudgetForm"
import { AlertToastType } from "./AlertToast"

const BudgetsCard = ({
  budgets,
  categories,
  refreshBudgets,
  setAlertToast,
}: {
  budgets: BudgetType[]
  categories: CategoryType[]
  refreshBudgets: () => Promise<void>
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false)
  const [budgetToEdit, setBudgetToEdit] = useState<BudgetType>()

  const deleteBudget = async (budget: BudgetType) => {
    await hardDeleteBudget({ categoryId: budget.category_id })
    setAlertToast({
      open: true,
      onClose: () => setAlertToast(undefined),
      severity: "success",
      message: "Budget deleted successfully!",
    })
    await refreshBudgets()
  }

  return (
    <Stack direction={"column"} spacing={2}>
      <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
        <Typography variant={"h5"}>Budgets</Typography>

        <IconButton
          size={"small"}
          disableRipple
          hidden={!budgets.length}
          onClick={() => {
            setShowBudgetForm(!showBudgetForm)
            setBudgetToEdit(undefined)
          }}
        >
          <AddIcon
            fontSize={"small"}
            sx={{
              transform: showBudgetForm ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </IconButton>
      </Stack>

      {(showBudgetForm || !budgets.length) && (
        <BudgetForm
          categories={categories}
          budgets={budgets}
          budgetToEdit={budgetToEdit}
          setBudgetToEdit={setBudgetToEdit}
          refreshBudgets={refreshBudgets}
          setAlertToast={setAlertToast}
        />
      )}

      <Stack direction={"column"} spacing={1}>
        {budgets.map((budget) => {
          return (
            <Stack
              key={budget.budget_id}
              direction={"row"}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stack direction={"column"}>
                <Typography variant={"body1"}>
                  {budget.category.name}
                </Typography>
                <Typography variant={"body2"}>
                  {currencyFormatter.format(budget.amount)}
                </Typography>
              </Stack>

              <Stack direction={"row"}>
                <Button
                  size={"small"}
                  sx={{ color: TEXT_COLOR }}
                  onClick={() => {
                    setBudgetToEdit(budget)
                    setShowBudgetForm(true)
                  }}
                >
                  Edit
                </Button>

                <Button
                  size={"small"}
                  sx={{ color: TEXT_COLOR }}
                  onClick={() => deleteBudget(budget)}
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
}

export default BudgetsCard
