import { TransactionData } from "@/utils/saveTransaction";

export const mockYears: string[] = [
  "2024",
  "2025"
]

export const mockIncomeData: TransactionData = {
  "2024": {
    January: [
      { id: "inc-2024-01-1", category: "Salary", amount: "4200.00" },
      { id: "inc-2024-01-2", category: "Freelance", amount: "650.50" },
    ],
    February: [
      { id: "inc-2024-02-1", category: "Salary", amount: "4200.00" },
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
};

export const mockExpenseData: TransactionData = {
  "2024": {
    January: [
      { id: "exp-2024-01-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-01-2", category: "Groceries", amount: "420.35" },
      { id: "exp-2024-01-3", category: "Utilities", amount: "180.22" },
    ],
    February: [
      { id: "exp-2024-02-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-02-2", category: "Groceries", amount: "395.80" },
      { id: "exp-2024-02-3", category: "Water", amount: "48.75" },
    ],
    March: [
      { id: "exp-2024-03-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-03-2", category: "Groceries", amount: "460.10" },
      { id: "exp-2024-03-3", category: "Internet", amount: "89.99" },
    ],
    April: [
      { id: "exp-2024-04-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-04-2", category: "Utilities", amount: "210.40" },
    ],
    May: [
      { id: "exp-2024-05-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-05-2", category: "Groceries", amount: "445.00" },
    ],
    June: [
      { id: "exp-2024-06-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-06-2", category: "Water", amount: "50.10" },
    ],
    July: [
      { id: "exp-2024-07-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-07-2", category: "Electric", amount: "230.45" },
    ],
    August: [
      { id: "exp-2024-08-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-08-2", category: "Groceries", amount: "480.90" },
    ],
    September: [
      { id: "exp-2024-09-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-09-2", category: "Utilities", amount: "195.30" },
    ],
    October: [
      { id: "exp-2024-10-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-10-2", category: "Internet", amount: "89.99" },
    ],
    November: [
      { id: "exp-2024-11-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-11-2", category: "Groceries", amount: "510.00" },
    ],
    December: [
      { id: "exp-2024-12-1", category: "Rent", amount: "1650.00" },
      { id: "exp-2024-12-2", category: "Gifts", amount: "600.00" },
    ],
  },

  "2025": {
    January: [
      { id: "exp-2025-01-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-01-2", category: "Groceries", amount: "430.00" },
    ],
    February: [
      { id: "exp-2025-02-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-02-2", category: "Water", amount: "52.10" },
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
    ],
    June: [
      { id: "exp-2025-06-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-06-2", category: "Water", amount: "55.00" },
    ],
    July: [
      { id: "exp-2025-07-1", category: "Rent", amount: "1700.00" },
      { id: "exp-2025-07-2", category: "Groceries", amount: "495.00" },
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
    ],
  },
};
