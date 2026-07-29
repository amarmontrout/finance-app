import { V2CategoryType, V2HydratedBudgetType } from "@/api/v2/models"
import { updateBudgetV2 } from "@/api/v2/requests"
import { currencyFormatter } from "@/global/formattingFunctions"
import AddIcon from "@mui/icons-material/Add"
import { Box, Button, IconButton, Stack, Typography } from "@mui/material"
import { useState } from "react"
import AddBudget from "../forms/AddBudget"
import { getToday } from "../utils"

const BudgetSettingsCard = ({
  budgets,
  categories,
  refreshBudgets,
}: {
  budgets: V2HydratedBudgetType[]
  categories: V2CategoryType[]
  refreshBudgets: () => Promise<void>
}) => {
  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false)
  const [budgetToEdit, setBudgetToEdit] = useState<V2HydratedBudgetType>()

  const softDeleteBudget = async (budget: V2HydratedBudgetType) => {
    await updateBudgetV2({
      rowId: budget.budget_id,
      body: {
        deleted_at: getToday(),
      },
    })
  }

  return (
    <Stack
      direction={"column"}
      spacing={1}
      divider={
        <hr
          style={{
            borderColor: "#102A1B",
          }}
        />
      }
      bgcolor={"rgba(255,255,255,0.15)"}
      borderRadius={5}
      padding={2}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        paddingX={1}
        paddingTop={1}
      >
        <Typography
          variant={"h5"}
          sx={{
            color: "#102A1B",
          }}
        >
          Budgets
        </Typography>

        <IconButton
          size={"small"}
          sx={{
            color: "#102A1B",
          }}
          disableRipple
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

      {(showBudgetForm || budgets.length === 0) && (
        <Box paddingX={1}>
          <AddBudget
            categories={categories}
            budgets={budgets}
            budgetToEdit={budgetToEdit}
            setBudgetToEdit={setBudgetToEdit}
            refreshBudgets={refreshBudgets}
          />
        </Box>
      )}

      <Stack direction={"column"} spacing={1} paddingX={1} paddingBottom={1}>
        {budgets.map((budget) => {
          return (
            <Stack
              key={budget.budget_id}
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack direction={"column"}>
                <Typography variant={"body1"}>
                  {budget.category_name}
                </Typography>
                <Typography variant={"body2"}>
                  {currencyFormatter.format(budget.amount)}
                </Typography>
              </Stack>

              <Stack direction={"row"}>
                <Button
                  size={"small"}
                  sx={{
                    color: "#F5F1E8",
                    bgcolor: "#102A1B",
                  }}
                  onClick={() => {
                    setBudgetToEdit(budget)
                    setShowBudgetForm(true)
                  }}
                >
                  Edit
                </Button>

                {/* <Button
                  size={"small"}
                  onClick={() => {
                    softDeleteBudget(budget)
                  }}
                >
                  Delete
                </Button> */}
              </Stack>
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
}

export default BudgetSettingsCard
