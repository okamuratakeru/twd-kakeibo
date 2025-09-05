"use client";

import { DashboardHeader } from "./DashboardHeader";
import { MonthSelector } from "./MonthSelector";
import { MonthlyTotal } from "./MonthlyTotal";
import { CategoryChart } from "./CategoryChart";
import { UnclassifiedBanner } from "./UnclassifiedBanner";
import { QuickActions } from "./QuickActions";
import { FloatingActionButton } from "./FloatingActionButton";
import { useRouter } from "next/navigation";

// Mock data
const mockCategoryData = [
  { name: "食費", value: 45000, color: "#FF6B6B" },
  { name: "交通費", value: 25000, color: "#4ECDC4" },
  { name: "住居費", value: 80000, color: "#45B7D1" },
  { name: "娯楽", value: 30000, color: "#F9CA24" },
  { name: "その他", value: 20000, color: "#6C5CE7" },
];

export function Dashboard() {
  const router = useRouter();

  const handleNavigateToExpenseForm = () => {
    router.push("/expenses/new");
  };

  const handleNavigateToReceiptForm = () => {
    router.push("/receipts/new");
  };

  const handleNavigateToCalendar = () => {
    router.push("/calendar");
  };

  const handleNavigateToReport = (month: string) => {
    router.push(`/reports/${month}`);
  };

  const handleUnclassifiedTap = () => {
    console.log("Navigate to classification screen");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="pb-20">
        {" "}
        {/* Add bottom padding for FAB */}
        <MonthSelector />
        <MonthlyTotal
          twdAmount={15420}
          jpyAmount={200000}
          previousMonthChange={-5.2}
        />
        <UnclassifiedBanner count={3} onTap={handleUnclassifiedTap} />
        <CategoryChart data={mockCategoryData} />
        <QuickActions
          onNavigateToExpenseForm={handleNavigateToExpenseForm}
          onNavigateToReceiptForm={handleNavigateToReceiptForm}
          onNavigateToCalendar={handleNavigateToCalendar}
          onNavigateToReport={handleNavigateToReport}
        />
      </div>

      <FloatingActionButton
        onNavigateToExpenseForm={handleNavigateToExpenseForm}
      />
    </div>
  );
}
