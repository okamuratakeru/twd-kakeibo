"use client";

import { CalendarView } from "@/components/CalendarView";
import { useRouter } from "next/navigation";

export default function CalendarPage() {
  const router = useRouter();
  const onBack = () => {
    router.push("/");
  };

  const onSave = () => {
    console.log("セーブ");
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">カレンダー</h1>
      <CalendarView onBack={onBack} />
    </div>
  );
}
