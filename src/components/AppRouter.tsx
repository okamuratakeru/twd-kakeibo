// "use client";
// import { useState } from "react";
// import { Dashboard } from "./Dashboard";
// import { ExpenseForm } from "./ExpenseForm";
// import { ReceiptForm } from "./ReceiptForm";
// import { CalendarView } from "./CalendarView";
// import { MonthlyReport } from "./MonthlyReport";

// type Screen =
//   | "dashboard"
//   | "expense-form"
//   | "receipt-form"
//   | "calendar"
//   | "monthly-report";

// export function AppRouter() {
//   const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
//   const [reportMonth, setReportMonth] = useState<string>("2025-08");

//   const navigateTo = (screen: Screen) => {
//     setCurrentScreen(screen);
//   };

//   const navigateToReport = (month: string) => {
//     setReportMonth(month);
//     setCurrentScreen("monthly-report");
//   };

//   const handleBack = () => {
//     setCurrentScreen("dashboard");
//   };

//   const handleExpenseSave = (expense: any) => {
//     console.log("Saved expense:", expense);
//     // Here you would typically save to your data store
//   };

//   const handleReceiptSave = (receiptData: any) => {
//     console.log("Saved receipt:", receiptData);
//     // Here you would typically save to your data store
//   };

//   switch (currentScreen) {
//     case "dashboard":
//       return (
//         <Dashboard
//           onNavigateToExpenseForm={() => navigateTo("expense-form")}
//           onNavigateToReceiptForm={() => navigateTo("receipt-form")}
//           onNavigateToCalendar={() => navigateTo("calendar")}
//           onNavigateToReport={navigateToReport}
//         />
//       );
//     case "expense-form":
//       return <ExpenseForm onBack={handleBack} onSave={handleExpenseSave} />;
//     case "receipt-form":
//       return <ReceiptForm onBack={handleBack} onSave={handleReceiptSave} />;
//     case "calendar":
//       return <CalendarView onBack={handleBack} />;
//     case "monthly-report":
//       return <MonthlyReport onBack={handleBack} month={reportMonth} />;
//     default:
//       return (
//         <Dashboard
//           onNavigateToExpenseForm={() => navigateTo("expense-form")}
//           onNavigateToReceiptForm={() => navigateTo("receipt-form")}
//           onNavigateToCalendar={() => navigateTo("calendar")}
//           onNavigateToReport={navigateToReport}
//         />
//       );
//   }
// }
