import { V2CategoryType } from "@/api/v2/models"
import { updateCategoryV2 } from "@/api/v2/requests"
import AddIcon from "@mui/icons-material/Add"
import { Box, Button, IconButton, Stack, Typography } from "@mui/material"
import { useState } from "react"
import AddCategory from "../forms/AddCategory"
import { getToday } from "../utils"

const CategorySettingsCard = ({
  categories,
}: {
  categories: V2CategoryType[]
}) => {
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false)
  const [categoryToEdit, setCategoryToEdit] = useState<V2CategoryType>()

  const softDeleteCategory = async (category: V2CategoryType) => {
    await updateCategoryV2({
      rowId: category.category_id,
      body: {
        deleted_at: getToday(),
      },
    })
  }

  return (
    <Stack
      direction={"column"}
      spacing={1}
      divider={<hr />}
      bgcolor={"white"}
      borderRadius={2}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        paddingX={1}
        paddingTop={1}
      >
        <Typography variant={"h5"}>Categories</Typography>

        <IconButton
          size={"small"}
          disableRipple
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

      {(showCategoryForm || categories.length === 0) && (
        <Box paddingX={1}>
          <AddCategory
            categoryToEdit={categoryToEdit}
            setCategoryToEdit={setCategoryToEdit}
          />
        </Box>
      )}

      <Stack direction={"column"} spacing={1} paddingX={1} paddingBottom={1}>
        {categories.map((category) => {
          return (
            <Stack
              key={category.category_id}
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Box
                  height={"10px"}
                  width={"10px"}
                  borderRadius={"50%"}
                  bgcolor={category.color ?? "black"}
                />
                <Typography variant={"body1"}>{category.name}</Typography>
              </Stack>

              <Stack direction={"row"}>
                <Button
                  size={"small"}
                  onClick={() => {
                    setCategoryToEdit(category)
                    setShowCategoryForm(true)
                  }}
                >
                  Edit
                </Button>

                {/* <Button
                  size={"small"}
                  onClick={() => {
                    softDeleteCategory(category)
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

export default CategorySettingsCard
