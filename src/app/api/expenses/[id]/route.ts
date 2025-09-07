import { NextRequest } from 'next/server';
import { ExpenseController } from '@/lib/controllers/ExpenseController';

const expenseController = new ExpenseController();

interface Props {
  params: Promise<{ id: string }>;
}

// GET /api/expenses/[id]
export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;
  return expenseController.getExpenseById(id, request);
}

// PUT /api/expenses/[id]
export async function PUT(request: NextRequest, { params }: Props) {
  const { id } = await params;
  return expenseController.updateExpense(id, request);
}

// DELETE /api/expenses/[id]
export async function DELETE(request: NextRequest, { params }: Props) {
  const { id } = await params;
  return expenseController.deleteExpense(id, request);
}