import { NextRequest } from "next/server";
import { ExpenseController } from "@/lib/controllers/ExpenseController";

const expenseController = new ExpenseController();

// GET /api/expenses
export async function GET(request: NextRequest) {
  return expenseController.getExpenses(request);
}

// POST /api/expenses
export async function POST(request: NextRequest) {
  console.log("ここコモっこいkジョッっjkじゃdkfjdkljf亜kdfじゃkdfじゃ");
  return expenseController.createExpense(request);
}

// DELETE /api/expenses (バルク削除)
export async function DELETE(request: NextRequest) {
  return expenseController.bulkDelete(request);
}
