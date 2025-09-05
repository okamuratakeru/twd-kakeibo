"use client";

import { ExpenseForm } from "@/components/ExpenseForm";
import { useRouter } from "next/navigation";

export default function NewExpensePage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  const handleSave = () => {
    console.log("セーブ");
  };

  return (
    <div className="container mx-auto p-4">
      <ExpenseForm onBack={handleBack} onSave={handleSave} />
    </div>
  );
}
