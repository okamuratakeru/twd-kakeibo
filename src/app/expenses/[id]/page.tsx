import { ExpenseForm } from "@/components/ExpenseForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditExpensePage({ params }: Props) {
  const { id } = await params;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">取引編集</h1>
      <ExpenseForm expenseId={id} />
    </div>
  );
}