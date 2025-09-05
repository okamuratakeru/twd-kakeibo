import { ExpenseList } from "@/components/ExpenseList";

export default function ExpensesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">取引一覧</h1>
      <ExpenseList />
    </div>
  );
}