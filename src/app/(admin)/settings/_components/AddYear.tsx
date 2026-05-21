import { ChoiceType } from "@/api/choices/models";
import { deleteYearChoice, saveYearChoice } from "@/api/choices/requests";
import { neutralColor } from "@/global/colors";
import ListItemSwipe from "@/global/components/ListItemSwipe";
import { makeId } from "@/global/infoFunctions";
import { useUser } from "@/hooks/use-user";
import { AlertToastType, HookSetter } from "@/types/types";
import { Divider, Stack } from "@mui/material";
import { useTheme } from "next-themes";
import { ChangeEvent, useState } from "react";
import SimpleForm from "./SimpleForm";

const AddYear = ({
  years,
  loadCategories,
  setAlertToast,
}: {
  years: ChoiceType[];
  loadCategories: () => Promise<void>;
  setAlertToast: HookSetter<AlertToastType | undefined>;
}) => {
  const user = useUser();
  const { theme: currentTheme } = useTheme();

  const [yearsInput, setYearsInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmSelection, setConfirmSelection] = useState<number | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setYearsInput(value);
  };

  const handleDeleteEntry = async (id: number) => {
    if (!user || !id) return;
    try {
      await deleteYearChoice({
        userId: user.id,
        rowId: id,
      });
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined);
        },
        severity: "success",
        message: "Year deleted successfully!",
      });
    } catch (error) {
      console.error(error);
      setAlertToast({
        open: true,
        onClose: () => {
          setAlertToast(undefined);
        },
        severity: "error",
        message: "Year could not be deleted.",
      });
    } finally {
      await loadCategories();
    }
  };

  const save = async () => {
    if (!user) return;
    const yearExists = years.some((y) => y.name === yearsInput);
    if (!/^\d{4}$/.test(yearsInput) || yearExists) return;
    setIsLoading(true);
    try {
      await saveYearChoice({
        userId: user.id,
        body: { id: makeId(), name: yearsInput },
      });

      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "success",
        message: "Year saved successfully!",
      });
    } catch (error) {
      console.error(error);
      setAlertToast({
        open: true,
        onClose: () => setAlertToast(undefined),
        severity: "error",
        message: "Year could not be saved.",
      });
    } finally {
      await loadCategories();
      setYearsInput("");
      setIsLoading(false);
    }
  };

  return (
    <Stack spacing={1} sx={{ height: "406px" }}>
      <SimpleForm
        placeholder={"Add A Year"}
        value={yearsInput}
        onChange={handleChange}
        onSubmit={save}
        isLoading={isLoading}
        isDisabled={
          !/^\d{4}$/.test(yearsInput) ||
          years.some((y) => y.name === yearsInput)
        }
      />

      <Stack
        divider={
          <Divider
            orientation={"horizontal"}
            sx={{ borderColor: neutralColor.bg }}
          />
        }
      >
        {years.map((entry, index) => {
          return (
            <ListItemSwipe
              key={entry.id}
              mainTitle={entry.name}
              secondaryTitle={""}
              amount={""}
              amountColor={"inherit"}
              buttonCondition={confirmSelection === entry.id}
              onDelete={async () => {
                handleDeleteEntry(entry.id);
              }}
              onSetDelete={() => {
                setConfirmSelection(entry.id);
              }}
              onCancelDelete={() => {
                setConfirmSelection(null);
              }}
              onEdit={() => {}}
              noEdit={true}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

export default AddYear;
