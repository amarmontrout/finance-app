import { ChoiceType } from "@/api/choices/models";
import { DateType, TransactionType } from "@/api/transactions/models";
import { HookSetter } from "@/types/types";
import { Box, Checkbox, Divider, Stack, Typography } from "@mui/material";
import { RefObject, useEffect, useMemo, useState } from "react";
import { neutralColor } from "../colors";
import {
  dateTypeToTimestamp,
  timestampToDateString,
} from "../formattingFunctions";
import { getDaysInMonth } from "../infoFunctions";
import CategoryAutocomplete from "./CategoryAutocomplete";
import MoneyInput from "./MoneyInput";
import NoteAutocomplete from "./NoteAutocomplete";
import TransactionDatePicker from "./TransactionDatePicker";

const Row = ({
  active,
  label,
  display,
  edit,
  onClick,
}: {
  active?: boolean;
  label: string;
  display: React.ReactNode;
  edit?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}) => {
  return (
    <Stack
      direction={"row"}
      sx={{
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Typography sx={{ flex: 1 }}>{label}</Typography>
      <Box onClick={onClick} sx={{ minWidth: 0, flex: 1, textAlign: "right" }}>
        {active ? edit : display}
      </Box>
    </Stack>
  );
};

const NewTransactionForm = ({
  transaction,
  setTransaction,
  allNotes,
  categories,
  openDialog,
  inputRef,
  currentYear,
}: {
  transaction: TransactionType;
  setTransaction: HookSetter<TransactionType>;
  allNotes: string[];
  categories: ChoiceType[];
  openDialog: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  currentYear: number;
}) => {
  const { month, year } = transaction.date;

  const [activeField, setActiveField] = useState<
    "date" | "category" | "note" | "payment_method" | null
  >(null);

  const { days, years } = useMemo(() => {
    const days = Array.from(
      { length: getDaysInMonth(month, year) },
      (_, i) => i + 1,
    );
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
    return { days, years };
  }, [month, year, currentYear]);

  const sortedNotes = useMemo(() => [...allNotes].sort(), [allNotes]);

  useEffect(() => {
    if (transaction.is_return && transaction.is_paid) {
      setTransaction((prev) => ({
        ...prev,
        is_paid: false,
      }));
    }
  }, [transaction.is_return, setTransaction]);

  useEffect(() => {
    const maxDay = getDaysInMonth(month, year);
    if ((transaction.date.day ?? 1) > maxDay) {
      updateDate("day")(maxDay);
    }
  }, [month, year, setTransaction, transaction.date.day]);

  useEffect(() => {
    if (!inputRef.current) return;

    if (transaction.amount === 0) {
      inputRef.current.focus();
    }
  }, [transaction.type]);

  const updateTransaction =
    (field: keyof TransactionType) => (value: string | number | boolean) =>
      setTransaction((prev) => ({
        ...prev,
        [field]: value,
      }));

  const updateDate = (field: keyof DateType) => (value: string | number) =>
    setTransaction((prev) => ({
      ...prev,
      date: {
        ...prev.date,
        [field]: value,
      },
    }));

  const handleOpen = (field: typeof activeField) => {
    setActiveField(field);
  };

  const handleClose = () => {
    setActiveField(null);
  };

  return (
    <Stack className="md:w-[50%] 2xl:w-[30%]" spacing={2}>
      {openDialog && (
        <MoneyInput
          value={transaction.amount}
          setValue={setTransaction}
          inputRef={inputRef}
          autoFocus={openDialog}
        />
      )}

      <Stack
        direction={"column"}
        divider={<Divider sx={{ borderColor: neutralColor.color }} />}
        spacing={1.5}
      >
        <Row
          active={activeField === "date"}
          label={"Date"}
          display={
            <Typography>
              {timestampToDateString(dateTypeToTimestamp(transaction.date))}
            </Typography>
          }
          edit={
            <TransactionDatePicker
              date={transaction.date}
              days={days}
              years={years}
              onChange={(field, value) => updateDate(field)(value)}
            />
          }
          onClick={
            activeField !== "date" ? () => handleOpen("date") : undefined
          }
        />

        <Row
          active={activeField === "category"}
          label={"Category"}
          display={
            <Typography>{transaction.category || "Select Category"}</Typography>
          }
          edit={
            <CategoryAutocomplete
              transaction={transaction}
              setTransaction={setTransaction}
              categories={categories}
              handleClose={handleClose}
            />
          }
          onClick={
            activeField !== "category"
              ? () => handleOpen("category")
              : undefined
          }
        />

        <Row
          active={activeField === "note"}
          label={"Note"}
          display={
            transaction.note !== "" ? (
              <Typography
                sx={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                {transaction.note}
              </Typography>
            ) : (
              <Typography>Add Note</Typography>
            )
          }
          edit={
            <NoteAutocomplete
              transaction={transaction}
              setTransaction={setTransaction}
              sortedNotes={sortedNotes}
              handleClose={handleClose}
            />
          }
          onClick={
            activeField !== "note" ? () => handleOpen("note") : undefined
          }
        />

        {transaction.type === "expense" && (
          <Row
            active={activeField === "payment_method"}
            label={"Payment Method"}
            display={
              <Typography>{transaction.payment_method || "Debit"}</Typography>
            }
            onClick={() =>
              updateTransaction("payment_method")(
                transaction.payment_method === "Debit" ? "Credit" : "Debit",
              )
            }
          />
        )}

        {transaction.type === "expense" && (
          <Row
            label={"Return"}
            display={
              <Checkbox
                sx={{ p: 0 }}
                size={"small"}
                disableRipple
                checked={transaction.is_return}
                onChange={(e) =>
                  updateTransaction("is_return")(e.target.checked)
                }
              />
            }
          />
        )}

        {transaction.type === "expense" && !transaction.is_return && (
          <Row
            label={"Paid"}
            display={
              <Checkbox
                sx={{ p: 0 }}
                size={"small"}
                disableRipple
                checked={transaction.is_paid}
                onChange={(e) => updateTransaction("is_paid")(e.target.checked)}
              />
            }
          />
        )}
      </Stack>
    </Stack>
  );
};

export default NewTransactionForm;
