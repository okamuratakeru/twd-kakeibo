"use client";

import { Plus, Camera, BarChart3, Calendar } from "lucide-react";

interface QuickActionsProps {
  onNavigateToExpenseForm: () => void;
  onNavigateToReceiptForm: () => void;
  onNavigateToCalendar: () => void;
  onNavigateToReport: (month: string) => void;
}

export function QuickActions({ onNavigateToExpenseForm, onNavigateToReceiptForm, onNavigateToCalendar, onNavigateToReport }: QuickActionsProps) {
  const actions = [
    { 
      icon: Plus, 
      label: "手動登録", 
      onClick: onNavigateToExpenseForm,
      className: "bg-blue-50 text-blue-600 hover:bg-blue-100"
    },
    { 
      icon: Camera, 
      label: "レシート撮影", 
      onClick: onNavigateToReceiptForm,
      className: "bg-green-50 text-green-600 hover:bg-green-100"
    },
    { 
      icon: Calendar, 
      label: "カレンダー", 
      onClick: onNavigateToCalendar,
      className: "bg-teal-50 text-teal-600 hover:bg-teal-100"
    },
    { 
      icon: BarChart3, 
      label: "月次レポート", 
      onClick: () => onNavigateToReport("2025-08"),
      className: "bg-orange-50 text-orange-600 hover:bg-orange-100"
    },
  ];

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${action.className}`}
          >
            <action.icon className="w-6 h-6 mb-2" />
            <span className="text-xs font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}