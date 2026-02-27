import { accentColorPrimary } from "@/globals/colors"
import { HookSetter } from "@/utils/type"
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import { useMemo, useState } from "react"
import ShowCaseCard from "@/components/ShowCaseCard"
import {
  INITIAL_EXPENSE_CATEGORIES,
  INITIAL_INCOME_CATEGORIES,
} from "@/globals/globals"
import { useUser } from "@/hooks/useUser"
import {
  saveExpenseCategory,
  saveIncomeCategory,
  saveYearChoice,
} from "../api/Choices/requests"
import { makeId } from "@/utils/helperFunctions"
import { doLogout } from "../api/Auth/requests"
import { AuthError } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

const SelectYearChoices = ({
  initialYears,
  yearChoices,
  handleSelectYearChoices,
}: {
  initialYears: number[]
  yearChoices: number[]
  handleSelectYearChoices: (
    event: React.MouseEvent<HTMLElement>,
    newFormats: number[],
  ) => void
}) => {
  return (
    <ShowCaseCard title={"Select Transaction Years"}>
      <Stack spacing={1}>
        <ToggleButtonGroup
          value={yearChoices}
          onChange={handleSelectYearChoices}
          color="primary"
          fullWidth
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
            gap={1}
            width={"100%"}
            height={"325px"}
          >
            {initialYears.map((year) => (
              <ToggleButton
                key={year}
                value={year}
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                {year}
              </ToggleButton>
            ))}
          </Box>
        </ToggleButtonGroup>
        <Typography textAlign={"center"}>
          *Add more years in settings
        </Typography>
      </Stack>
    </ShowCaseCard>
  )
}

const SelectIncomeCategories = ({
  incomeChoices,
  handleSelectIncomeChoices,
}: {
  incomeChoices: string[]
  handleSelectIncomeChoices: (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => void
}) => {
  return (
    <ShowCaseCard title={"Select Income Categories"}>
      <Stack spacing={1}>
        <ToggleButtonGroup
          value={incomeChoices}
          onChange={handleSelectIncomeChoices}
          color="secondary"
          fullWidth
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
            gap={1}
            width={"100%"}
            height={"325px"}
          >
            {INITIAL_INCOME_CATEGORIES.map((category) => (
              <ToggleButton
                key={category}
                value={category}
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                {category}
              </ToggleButton>
            ))}
          </Box>
        </ToggleButtonGroup>

        <Typography textAlign={"center"}>
          *Add custom income categories in settings
        </Typography>
      </Stack>
    </ShowCaseCard>
  )
}

const SelectExpenseCategories = ({
  expenseChoices,
  handleSelectExpenseChoices,
}: {
  expenseChoices: string[]
  handleSelectExpenseChoices: (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => void
}) => {
  return (
    <ShowCaseCard title={"Select Expense Categories"}>
      <Stack spacing={1}>
        <ToggleButtonGroup
          value={expenseChoices}
          onChange={handleSelectExpenseChoices}
          color="error"
          fullWidth
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
            gap={1}
            width={"100%"}
            height={"325px"}
          >
            {INITIAL_EXPENSE_CATEGORIES.map((category) => (
              <ToggleButton
                key={category}
                value={category}
                fullWidth
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                {category}
              </ToggleButton>
            ))}
          </Box>
        </ToggleButtonGroup>
        <Typography textAlign={"center"}>
          *Add custom expense categories in settings
        </Typography>
      </Stack>
    </ShowCaseCard>
  )
}

const SetUpDialog = ({
  setUpDialogOpen,
  setSetUpDialogOpen,
  currentYear,
  loadCategories,
}: {
  setUpDialogOpen: boolean
  setSetUpDialogOpen: HookSetter<boolean>
  currentYear: number
  loadCategories: () => void
}) => {
  const user = useUser()
  const router = useRouter()

  const [yearChoices, setYearChoices] = useState<number[]>([currentYear])
  const [incomeChoices, setIncomeChoices] = useState<string[]>([])
  const [expenseChoices, setExpenseChoices] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSelectIncomeChoices = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => {
    setIncomeChoices(newFormats)
  }

  const handleSelectExpenseChoices = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => {
    setExpenseChoices(newFormats)
  }

  const handleSelectYearChoices = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: number[],
  ) => {
    setYearChoices(newFormats)
  }

  const save = async () => {
    if (!user) return
    setIsLoading(true)

    const yearSaves = yearChoices
      .filter((choice) => choice !== undefined)
      .map((choice) =>
        saveYearChoice({
          userId: user.id,
          body: {
            id: Number(makeId(8)),
            name: String(choice),
          },
        }),
      )

    const expenseSaves = expenseChoices
      .filter((choice) => choice !== "")
      .map((choice) =>
        saveExpenseCategory({
          userId: user.id,
          body: {
            id: Number(makeId(8)),
            name: choice,
          },
        }),
      )

    const incomeSaves = incomeChoices
      .filter((choice) => choice !== "")
      .map((choice) =>
        saveIncomeCategory({
          userId: user.id,
          body: {
            id: Number(makeId(8)),
            name: choice,
          },
        }),
      )
    await Promise.all([...yearSaves, ...expenseSaves, ...incomeSaves])
    loadCategories()
    setIsLoading(false)
    setSetUpDialogOpen(false)
  }

  const initialYears = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => currentYear + 1 - i)
  }, [currentYear])

  return (
    <Dialog open={setUpDialogOpen} fullScreen>
      <DialogTitle textAlign={"center"}>
        <Stack>
          <Typography variant="h5">{"Initial Account Setup"}</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack
          sx={{
            paddingTop: 0,
          }}
          direction={"column"}
          padding={"24px 0"}
          gap={2}
        >
          <SelectYearChoices
            initialYears={initialYears}
            yearChoices={yearChoices}
            handleSelectYearChoices={handleSelectYearChoices}
          />

          <SelectIncomeCategories
            incomeChoices={incomeChoices}
            handleSelectIncomeChoices={handleSelectIncomeChoices}
          />

          <SelectExpenseCategories
            expenseChoices={expenseChoices}
            handleSelectExpenseChoices={handleSelectExpenseChoices}
          />
          <Stack direction={"row"} spacing={1}>
            <Button
              variant={"outlined"}
              size="large"
              color="error"
              onClick={() => {
                doLogout({
                  router: router,
                  errorHandler: (error: AuthError) => {
                    console.error(error.message)
                  },
                })
              }}
            >
              {"Logout"}
            </Button>

            <Button
              fullWidth
              variant={"contained"}
              size="large"
              loading={isLoading}
              disabled={
                yearChoices.length === 0 ||
                incomeChoices.length === 0 ||
                expenseChoices.length === 0
              }
              onClick={() => {
                save()
              }}
              sx={{
                backgroundColor: accentColorPrimary,
              }}
            >
              {"Save"}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default SetUpDialog
