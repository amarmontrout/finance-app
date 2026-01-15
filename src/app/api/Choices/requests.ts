import { dbRequestBrowser } from "../dbRequest"
import { BudgetTypeV2, ChoiceTypeV2 } from "@/utils/type"

export const saveIncomeCategory = async ({
  userId,
  body
}: {
  userId: string
  body: ChoiceTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<ChoiceTypeV2>({
    schema: "Choices",
    table: "incomeCategories",
    method: "POST",
    userId: userId,
    body: body
  })

  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const getIncomeCategories = async ({
  userId,
}: {
  userId: string
}) => {
  const {data, error} = await dbRequestBrowser<ChoiceTypeV2>({
    schema: "Choices",
    table: "incomeCategories",
    method: "GET",
    userId: userId
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const updateIncomeCategory = async ({
  userId,
  rowId,
  body
}: {
  userId: string
  rowId: number
  body: ChoiceTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<ChoiceTypeV2>({
    schema: "Choices",
    table: "incomeCategories",
    method: "PATCH",
    userId: userId,
    rowId: rowId,
    body: body
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const deleteIncomeCategory = async ({
  userId,
  rowId,
}: {
  userId: string
  rowId: number
}) => {
  const {data, error} = await dbRequestBrowser<ChoiceTypeV2>({
    schema: "Choices",
    table: "incomeCategories",
    method: "DELETE",
    userId: userId,
    rowId: rowId
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}


export const saveExpenseCategory = async ({
  userId,
  body
}: {
  userId: string
  body: ChoiceTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<ChoiceTypeV2>({
    schema: "Choices",
    table: "expenseCategories",
    method: "POST",
    userId: userId,
    body: body
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const getExpenseCategories = async ({
  userId,
}: {
  userId: string
}) => {
  const {data, error} = await dbRequestBrowser<ChoiceTypeV2>({
    schema: "Choices",
    table: "expenseCategories",
    method: "GET",
    userId: userId
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const updateExpenseCategory = async ({
  userId,
  rowId,
  body
}: {
  userId: string
  rowId: number
  body: ChoiceTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<ChoiceTypeV2>({
    schema: "Choices",
    table: "expenseCategories",
    method: "PATCH",
    userId: userId,
    rowId: rowId,
    body: body
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const deleteExpenseCategory = async ({
  userId,
  rowId,
}: {
  userId: string
  rowId: number
}) => {
  const {data, error} = await dbRequestBrowser<ChoiceTypeV2>({
    schema: "Choices",
    table: "expenseCategories",
    method: "DELETE",
    userId: userId,
    rowId: rowId
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}


export const saveYearChoice = async ({
  userId,
  body
}: {
  userId: string
  body: ChoiceTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<ChoiceTypeV2>({
    schema: "Choices",
    table: "years",
    method: "POST",
    userId: userId,
    body: body
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const getYearChoices = async ({
  userId,
}: {
  userId: string
}) => {
  const {data, error} = await dbRequestBrowser<ChoiceTypeV2>({
    schema: "Choices",
    table: "years",
    method: "GET",
    userId: userId
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const updateYearChoice = async ({
  userId,
  rowId,
  body
}: {
  userId: string
  rowId: number
  body: ChoiceTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<ChoiceTypeV2>({
    schema: "Choices",
    table: "years",
    method: "PATCH",
    userId: userId,
    rowId: rowId,
    body: body
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const deleteYearChoice = async ({
  userId,
  rowId,
}: {
  userId: string
  rowId: number
}) => {
  const {data, error} = await dbRequestBrowser<ChoiceTypeV2>({
    schema: "Choices",
    table: "years",
    method: "DELETE",
    userId: userId,
    rowId: rowId
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}


export const saveBudgetCategory = async ({
  userId,
  body
}: {
  userId: string
  body: BudgetTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<BudgetTypeV2>({
    schema: "Choices",
    table: "budgetCategories",
    method: "POST",
    userId: userId,
    body: body
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const getBudgetCategories = async ({
  userId,
}: {
  userId: string
}) => {
  const {data, error} = await dbRequestBrowser<BudgetTypeV2>({
    schema: "Choices",
    table: "budgetCategories",
    method: "GET",
    userId: userId
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const updateBudgetCategory = async ({
  userId,
  rowId,
  body
}: {
  userId: string
  rowId: number
  body: BudgetTypeV2
}) => {
  const {data, error} = await dbRequestBrowser<BudgetTypeV2>({
    schema: "Choices",
    table: "budgetCategories",
    method: "PATCH",
    userId: userId,
    rowId: rowId,
    body: body
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}

export const deleteBudgetCategory = async ({
  userId,
  rowId,
}: {
  userId: string
  rowId: number
}) => {
  const {data, error} = await dbRequestBrowser<BudgetTypeV2>({
    schema: "Choices",
    table: "budgetCategories",
    method: "DELETE",
    userId: userId,
    rowId: rowId
  })
  
  if (error) {
    console.error(error)
    return null
  }

  return data
}