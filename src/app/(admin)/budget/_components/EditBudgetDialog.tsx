import { BudgetType } from "@/api/choices/models";
import { updateBudgetCategory } from "@/api/choices/requests";
import { useCategoryContext } from "@/contexts/categories-context";
import { positiveColor } from "@/global/colors";
import MoneyInput from "@/global/components/MoneyInput";
import { useUser } from "@/hooks/use-user";
import { AlertToastType, HookSetter } from "@/types/types";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { RefObject, useEffect, useState } from "react";

const UPDATE_BUDGET_INIT: BudgetType = {
  id: 0,
  category: "",
  amount: 0,
};

const EditBudgetDialog = ({
  budgetEditDialogOpen,
  setBudgetEditDialogOpen,
  confirmEdit,
  setAlertToast,
  inputRef,
}: {
  budgetEditDialogOpen: boolean;
  setBudgetEditDialogOpen: HookSetter<boolean>;
  confirmEdit: BudgetType | null;
  setAlertToast: HookSetter<AlertToastType | undefined>;
  inputRef: RefObject<HTMLInputElement | null>;
}) => {
  const { loadCategories } = useCategoryContext();
  const user = useUser();

  const [updateBudget, setUpdateBudget] =
    useState<BudgetType>(UPDATE_BUDGET_INIT);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!confirmEdit) return;
    setUpdateBudget(confirmEdit);
  }, [confirmEdit]);

  const handleUpdateBudgetData = async () => {
    if (!user || !updateBudget || !confirmEdit) return;
    setIsLoading(true);
    try {
      await updateBudgetCategory({
        userId: user.id,
        rowId: confirmEdit.id,
        body: updateBudget,
      });
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "success",
        message: "Budget updated successfully!",
      });
    } catch (error) {
      console.error(error);
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: "Budget could not be updated.",
      });
    } finally {
      await loadCategories();
      setIsLoading(false);
      setBudgetEditDialogOpen(false);
    }
  };

  if (!updateBudget) return null;

  return (
    <Dialog open={budgetEditDialogOpen}>
      <DialogTitle>
        <Stack
          direction={"row"}
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ width: "100%", textAlign: "center" }}
          >{`Edit ${confirmEdit?.category} Budget`}</Typography>
          <IconButton
            onClick={() => {
              setBudgetEditDialogOpen(false);
              if (!confirmEdit) return;
              setUpdateBudget(confirmEdit);
            }}
            sx={{ position: "absolute", right: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack direction={"column"} spacing={2}>
          <MoneyInput
            value={updateBudget.amount}
            setValue={setUpdateBudget}
            inputRef={inputRef}
            autoFocus={budgetEditDialogOpen}
          />

          <Button
            variant={"contained"}
            onClick={handleUpdateBudgetData}
            disabled={updateBudget.amount === 0}
            sx={{ backgroundColor: positiveColor.color }}
            loading={isLoading}
          >
            {"Update"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default EditBudgetDialog;
