import { AccountType } from "@/app/(api)/accounts/models"
import { CategoryType } from "@/app/(api)/categories/models"
import { softDeleteCategory } from "@/app/(api)/categories/requests"
import { TEXT_COLOR } from "@/app/data/colors"
import { HookSetter } from "@/app/lib/types"
import AddIcon from "@mui/icons-material/Add"
import { Box, Button, IconButton, Stack, Typography } from "@mui/material"
import { useState } from "react"
import CategoryForm from "../forms/CategoryForm"
import { AlertToastType } from "./AlertToast"

const CategoriesCard = ({
  categories,
  refreshCategories,
  accounts,
  setAlertToast,
}: {
  categories: CategoryType[]
  refreshCategories: () => Promise<void>
  accounts: AccountType[]
  setAlertToast: HookSetter<AlertToastType | undefined>
}) => {
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false)
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryType>()

  const deleteCategory = async (category: CategoryType) => {
    await softDeleteCategory({ categoryId: category.category_id })
    setAlertToast({
      open: true,
      onClose: () => setAlertToast(undefined),
      severity: "success",
      message: "Category deleted successfully!",
    })
    await refreshCategories()
  }

  return (
    <Stack direction={"column"} spacing={2}>
      <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
        <Typography variant={"h5"}>Categories</Typography>

        <IconButton
          size={"small"}
          disableRipple
          hidden={!categories.length}
          onClick={() => {
            setShowCategoryForm(!showCategoryForm)
            setCategoryToEdit(undefined)
          }}
        >
          <AddIcon
            fontSize={"small"}
            sx={{
              transform: showCategoryForm ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </IconButton>
      </Stack>

      {(showCategoryForm || !categories.length) && (
        <CategoryForm
          categoryToEdit={categoryToEdit}
          setCategoryToEdit={setCategoryToEdit}
          refreshCategories={refreshCategories}
          accounts={accounts}
          setAlertToast={setAlertToast}
        />
      )}

      <Stack direction={"column"} spacing={1}>
        {categories.map((category) => {
          return (
            <Stack
              key={category.category_id}
              direction={"row"}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stack
                direction={"row"}
                spacing={1}
                sx={{ alignItems: "center" }}
              >
                <Box
                  sx={{
                    height: "10px",
                    width: "10px",
                    borderRadius: "50%",
                    bgcolor: category.color ?? "black",
                  }}
                />
                <Typography variant={"body1"}>{category.name}</Typography>
              </Stack>

              <Stack direction={"row"}>
                <Button
                  size={"small"}
                  sx={{ color: TEXT_COLOR }}
                  onClick={() => {
                    setCategoryToEdit(category)
                    setShowCategoryForm(true)
                  }}
                >
                  Edit
                </Button>

                <Button
                  size={"small"}
                  sx={{ color: TEXT_COLOR }}
                  onClick={() => deleteCategory(category)}
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

export default CategoriesCard
