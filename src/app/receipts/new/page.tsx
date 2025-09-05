"use client";

import { ReceiptForm } from "@/components/ReceiptForm";
import { useRouter } from "next/navigation";

export default function NewReceiptPage() {
  const router = useRouter();
  const onBack = () => {
    router.push("/");
  };

  const onSave = () => {
    console.log("セーブ");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">レシート取り込み</h1>
      <ReceiptForm onBack={onBack} onSave={onSave} />
    </div>
  );
}
