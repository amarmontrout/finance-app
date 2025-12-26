import { TransactionData } from "@/utils/transactionStorage"

export const mockYears: string[] = [
  "2024", "2025", "2026"
]

export const mockIncomeData: TransactionData = {
  "2024": {
    January: [
      { id: "inc-2024-01-1", category: "Salary", amount: "4200.00" },
      { id: "inc-2024-01-2", category: "Freelance", amount: "650.50" },
    ],
    February: [
      { id: "inc-2024-02-1", category: "Salary", amount: "4200.00" },
      { id: "inc-2024-02-2", category: "Freelance", amount: "300.00" },
    ],
    March: [
      { id: "inc-2024-03-1", category: "Salary", amount: "4200.00" },
      { id: "inc-2024-03-2", category: "Bonus", amount: "500.00" },
    ],
    April: [
      { id: "inc-2024-04-1", category: "Salary", amount: "4200.00" },
    ],
    May: [
      { id: "inc-2024-05-1", category: "Salary", amount: "4200.00" },
      { id: "inc-2024-05-2", category: "Freelance", amount: "800.00" },
    ],
    June: [
      { id: "inc-2024-06-1", category: "Salary", amount: "4200.00" },
    ],
    July: [
      { id: "inc-2024-07-1", category: "Salary", amount: "4200.00" },
      { id: "inc-2024-07-2", category: "Side Hustle", amount: "350.00" },
    ],
    August: [
      { id: "inc-2024-08-1", category: "Salary", amount: "4200.00" },
    ],
    September: [
      { id: "inc-2024-09-1", category: "Salary", amount: "4200.00" },
      { id: "inc-2024-09-2", category: "Freelance", amount: "720.00" },
    ],
    October: [
      { id: "inc-2024-10-1", category: "Salary", amount: "4200.00" },
    ],
    November: [
      { id: "inc-2024-11-1", category: "Salary", amount: "4200.00" },
      { id: "inc-2024-11-2", category: "Bonus", amount: "1200.00" },
    ],
    December: [
      { id: "inc-2024-12-1", category: "Salary", amount: "4200.00" },
    ],
  },

  "2025": {
    January: [
      { id: "inc-2025-01-1", category: "Salary", amount: "4400.00" },
    ],
    February: [
      { id: "inc-2025-02-1", category: "Salary", amount: "4400.00" },
      { id: "inc-2025-02-2", category: "Freelance", amount: "400.00" },
    ],
    March: [
      { id: "inc-2025-03-1", category: "Salary", amount: "4400.00" },
      { id: "inc-2025-03-2", category: "Freelance", amount: "900.00" },
    ],
    April: [
      { id: "inc-2025-04-1", category: "Salary", amount: "4400.00" },
    ],
    May: [
      { id: "inc-2025-05-1", category: "Salary", amount: "4400.00" },
    ],
    June: [
      { id: "inc-2025-06-1", category: "Salary", amount: "4400.00" },
      { id: "inc-2025-06-2", category: "Side Hustle", amount: "500.00" },
    ],
    July: [
      { id: "inc-2025-07-1", category: "Salary", amount: "4400.00" },
    ],
    August: [
      { id: "inc-2025-08-1", category: "Salary", amount: "4400.00" },
    ],
    September: [
      { id: "inc-2025-09-1", category: "Salary", amount: "4400.00" },
      { id: "inc-2025-09-2", category: "Freelance", amount: "850.00" },
    ],
    October: [
      { id: "inc-2025-10-1", category: "Salary", amount: "4400.00" },
    ],
    November: [
      { id: "inc-2025-11-1", category: "Salary", amount: "4400.00" },
      { id: "inc-2025-11-2", category: "Bonus", amount: "1500.00" },
    ],
    December: [
      { id: "inc-2025-12-1", category: "Salary", amount: "4400.00" },
    ],
  },

  "2026": {
    January: [
      { id: "inc-2026-01-1", category: "Salary", amount: "4600.00" },
    ],
    February: [
      { id: "inc-2026-02-1", category: "Salary", amount: "4600.00" },
    ],
    March: [
      { id: "inc-2026-03-1", category: "Salary", amount: "4600.00" },
      { id: "inc-2026-03-2", category: "Freelance", amount: "600.00" },
    ],
    April: [
      { id: "inc-2026-04-1", category: "Salary", amount: "4600.00" },
    ],
    May: [
      { id: "inc-2026-05-1", category: "Salary", amount: "4600.00" },
      { id: "inc-2026-05-2", category: "Bonus", amount: "2000.00" },
    ],
    June: [
      { id: "inc-2026-06-1", category: "Salary", amount: "4600.00" },
    ],
    July: [
      { id: "inc-2026-07-1", category: "Salary", amount: "4600.00" },
    ],
    August: [
      { id: "inc-2026-08-1", category: "Salary", amount: "4600.00" },
    ],
    September: [
      { id: "inc-2026-09-1", category: "Salary", amount: "4600.00" },
      { id: "inc-2026-09-2", category: "Freelance", amount: "750.00" },
    ],
    October: [
      { id: "inc-2026-10-1", category: "Salary", amount: "4600.00" },
    ],
    November: [
      { id: "inc-2026-11-1", category: "Salary", amount: "4600.00" },
    ],
    December: [
      { id: "inc-2026-12-1", category: "Salary", amount: "4600.00" },
      { id: "inc-2026-12-2", category: "Bonus", amount: "1800.00" },
    ],
  },
}

export const mockIncomeCategories: string[] = [
  "Salary",
  "Freelance",
  "Bonus",
  "Side Hustle"
]

export const mockExpenseData: TransactionData = {
  "2024": {
    January: [
      { id: "exp-2024-01-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-01-2", category: "Groceries", amount: "420.35" },
      { id: "exp-2024-01-3", category: "Utilities", amount: "180.22" },
      { id: "exp-2024-01-4", category: "Car Insurance", amount: "145.00" },
    ],
    February: [
      { id: "exp-2024-02-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-02-2", category: "Groceries", amount: "395.80" },
      { id: "exp-2024-02-3", category: "Medical", amount: "280.00" },
    ],
    March: [
      { id: "exp-2024-03-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-03-2", category: "Groceries", amount: "460.10" },
      { id: "exp-2024-03-3", category: "Internet", amount: "89.99" },
      { id: "exp-2024-03-4", category: "Car Repair", amount: "750.00" },
    ],
    April: [
      { id: "exp-2024-04-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-04-2", category: "Utilities", amount: "210.40" },
      { id: "exp-2024-04-3", category: "Dining Out", amount: "320.00" },
    ],
    May: [
      { id: "exp-2024-05-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-05-2", category: "Groceries", amount: "445.00" },
      { id: "exp-2024-05-3", category: "Vacation", amount: "1200.00" },
    ],
    June: [
      { id: "exp-2024-06-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-06-2", category: "Water", amount: "50.10" },
      { id: "exp-2024-06-3", category: "Electric", amount: "240.00" },
    ],
    July: [
      { id: "exp-2024-07-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-07-2", category: "Electric", amount: "230.45" },
      { id: "exp-2024-07-3", category: "Entertainment", amount: "410.00" },
    ],
    August: [
      { id: "exp-2024-08-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-08-2", category: "Groceries", amount: "480.90" },
      { id: "exp-2024-08-3", category: "Travel", amount: "900.00" },
    ],
    September: [
      { id: "exp-2024-09-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-09-2", category: "Utilities", amount: "195.30" },
    ],
    October: [
      { id: "exp-2024-10-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-10-2", category: "Internet", amount: "89.99" },
      { id: "exp-2024-10-3", category: "Medical", amount: "600.00" },
    ],
    November: [
      { id: "exp-2024-11-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-11-2", category: "Groceries", amount: "510.00" },
    ],
    December: [
      { id: "exp-2024-12-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-12-2", category: "Gifts", amount: "600.00" },
      { id: "exp-2024-12-3", category: "Travel", amount: "850.00" },
    ],
  },

  "2025": {
    January: [
      { id: "exp-2025-01-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-01-2", category: "Groceries", amount: "430.00" },
      { id: "exp-2025-01-3", category: "Gym", amount: "75.00" },
    ],
    February: [
      { id: "exp-2025-02-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-02-2", category: "Medical", amount: "900.00" },
    ],
    March: [
      { id: "exp-2025-03-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-03-2", category: "Utilities", amount: "215.00" },
    ],
    April: [
      { id: "exp-2025-04-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-04-2", category: "Groceries", amount: "460.25" },
    ],
    May: [
      { id: "exp-2025-05-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-05-2", category: "Electric", amount: "245.60" },
      { id: "exp-2025-05-3", category: "Car Repair", amount: "1200.00" },
    ],
    June: [
      { id: "exp-2025-06-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-06-2", category: "Water", amount: "55.00" },
    ],
    July: [
      { id: "exp-2025-07-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-07-2", category: "Vacation", amount: "1800.00" },
    ],
    August: [
      { id: "exp-2025-08-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-08-2", category: "Utilities", amount: "205.80" },
    ],
    September: [
      { id: "exp-2025-09-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-09-2", category: "Internet", amount: "89.99" },
    ],
    October: [
      { id: "exp-2025-10-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-10-2", category: "Electric", amount: "260.00" },
    ],
    November: [
      { id: "exp-2025-11-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-11-2", category: "Groceries", amount: "520.00" },
    ],
    December: [
      { id: "exp-2025-12-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-12-2", category: "Gifts", amount: "650.00" },
      { id: "exp-2025-12-3", category: "Travel", amount: "1100.00" },
    ],
  },
}

export const mockExpenseCategories: string[] = [
  "Rent",
  "Groceries",
  "Utilities",
  "Car Insurance",
  "Medical",
  "Internet",
  "Car Repair",
  "Dining Out",
  "Vacation",
  "Water",
  "Electric",
  "Entertainment",
  "Travel",
  "Gifts",
  "Gym",
]