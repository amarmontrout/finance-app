import { Box, Stack, Typography } from "@mui/material"
import { useDataContext } from "../contexts/data-context"
import { useTransactionContext } from "../contexts/transaction-context"
import { ACCENT_COLOR } from "../data/colors"
import { formatDate } from "../lib/functions/formatters"
import FullScreenDialog from "./dialogs/FullScreenDialog"
import HoverDialog from "./dialogs/HoverDialog"
import AccountForm from "./forms/AccountForm"
import BudgetForm from "./forms/BudgetForm"
import CategoryForm from "./forms/CategoryForm"
import MerchantForm from "./forms/MerchantForm"
import ReturnForm from "./forms/ReturnForm"
import TransactionForm from "./forms/TransactionForm"

const AllDialogs = () => {
  const {
    setAlertToast,
    updateExistingTransaction,
    selectedTransaction,
    setSelectedTransaction,
    openNewTransactionDialog,
    setOpenNewTransactionDialog,
    newTransaction,
    setNewTransaction,
    saveNewTransaction,
    createInitialTransaction,
    openEditTransactionDialog,
    setOpenEditTransactionDialog,
    openAddReturn,
    setOpenAddReturn,
    moneyInputRef,
    refreshTransactions,
  } = useTransactionContext()

  const {
    categories,
    refreshCategories,
    accounts,
    refreshAccounts,
    budgets,
    refreshBudgets,
    refreshMerchants,
    openAddMerchant,
    setOpenAddMerchant,
    openAddCategory,
    setOpenAddCategory,
    openAddAccount,
    setOpenAddAccount,
    openAddBudget,
    setOpenAddBudget,
    budgetToEdit,
    setBudgetToEdit,
    recommendedBudget,
    merchantMap,
    categoryMap,
  } = useDataContext()

  return (
    <Box>
      {openNewTransactionDialog && (
        <FullScreenDialog
          open={openNewTransactionDialog}
          onClose={() => {
            setOpenNewTransactionDialog(false)
            setNewTransaction(createInitialTransaction())
            setAlertToast(undefined)
          }}
          onSave={saveNewTransaction}
          disableSave={
            newTransaction.amount === 0 ||
            newTransaction.merchant_id === "" ||
            newTransaction.category_id === "" ||
            newTransaction.account_id === ""
          }
          title={"NEW TRANSACTION"}
          content={
            <TransactionForm
              isEditing={false}
              transaction={newTransaction}
              setTransaction={setNewTransaction}
              inputRef={moneyInputRef}
              setOpenAddMerchant={setOpenAddMerchant}
              setOpenAddCategory={setOpenAddCategory}
              setOpenAddAccount={setOpenAddAccount}
            />
          }
        />
      )}

      {openEditTransactionDialog && (
        <FullScreenDialog
          open={openEditTransactionDialog}
          onClose={() => {
            setOpenEditTransactionDialog(false)
            setSelectedTransaction(null)
            setAlertToast(undefined)
          }}
          onSave={updateExistingTransaction}
          title={"UPDATE TRANSACTION"}
          content={
            selectedTransaction && (
              <TransactionForm
                isEditing={true}
                transaction={selectedTransaction}
                setTransaction={setSelectedTransaction}
                inputRef={moneyInputRef}
                setOpenAddMerchant={setOpenAddMerchant}
                setOpenAddCategory={setOpenAddCategory}
                setOpenAddAccount={setOpenAddAccount}
              />
            )
          }
        />
      )}

      {openAddMerchant && (
        <HoverDialog
          open={openAddMerchant}
          showButtons={false}
          onClose={() => setOpenAddMerchant(false)}
          title={"NEW MERCHANT"}
          content={
            <MerchantForm
              categories={categories}
              refreshMerchants={refreshMerchants}
              setAlertToast={setAlertToast}
            />
          }
        />
      )}

      {openAddCategory && (
        <HoverDialog
          open={openAddCategory}
          showButtons={false}
          onClose={() => setOpenAddCategory(false)}
          title={"NEW CATEGORY"}
          content={
            <CategoryForm
              refreshCategories={refreshCategories}
              accounts={accounts}
              setAlertToast={setAlertToast}
            />
          }
        />
      )}

      {openAddAccount && (
        <HoverDialog
          open={openAddAccount}
          showButtons={false}
          onClose={() => setOpenAddAccount(false)}
          title={"NEW ACCOUNT"}
          content={
            <AccountForm
              refreshAccounts={refreshAccounts}
              setAlertToast={setAlertToast}
            />
          }
        />
      )}

      {openAddBudget && (
        <HoverDialog
          open={openAddBudget}
          showButtons={false}
          onClose={() => {
            setOpenAddBudget(false)
            if (setBudgetToEdit) {
              setBudgetToEdit(undefined)
            }
          }}
          title={`${budgetToEdit ? "UPDATE" : "NEW"} BUDGET`}
          content={
            <Stack direction={"column"} spacing={2}>
              {budgetToEdit && (
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{
                    height: "24px",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: `1px solid ${ACCENT_COLOR}`,
                    borderRadius: 3,
                    p: 2,
                  }}
                >
                  <Typography variant={"body2"}>Recommended budget:</Typography>
                  <Typography variant={"body1"} sx={{ fontWeight: 700 }}>
                    {recommendedBudget}
                  </Typography>
                </Stack>
              )}

              <BudgetForm
                categories={categories}
                budgets={budgets}
                refreshBudgets={refreshBudgets}
                setAlertToast={setAlertToast}
                budgetToEdit={budgetToEdit}
                setBudgetToEdit={setBudgetToEdit}
                onClose={() => setOpenAddBudget(false)}
              />
            </Stack>
          }
        />
      )}

      {openAddReturn && (
        <HoverDialog
          open={openAddReturn}
          showButtons={false}
          onClose={() => setOpenAddReturn(false)}
          title={"NEW RETURN"}
          content={
            <Stack direction={"column"} spacing={2}>
              <Stack
                direction={"column"}
                sx={{
                  width: "100%",
                  textAlign: "center",
                  border: `1px solid ${ACCENT_COLOR}`,
                  borderRadius: 3,
                  p: 1,
                }}
              >
                <Typography>
                  {`${formatDate(selectedTransaction?.transaction_date!)}`}
                </Typography>
                <Typography>
                  {`${merchantMap.get(selectedTransaction?.merchant_id!)?.name} - 
                    ${categoryMap.get(selectedTransaction?.category_id!)?.name}`}
                </Typography>
              </Stack>

              <ReturnForm
                refreshTransactions={refreshTransactions}
                setAlertToast={setAlertToast}
              />
            </Stack>
          }
        />
      )}
    </Box>
  )
}

export default AllDialogs
