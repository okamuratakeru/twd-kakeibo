"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function MonthSelector() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: '2-digit'
    }).replace('/', '年') + '月';
  };

  return (
    <div className="flex items-center justify-center px-4 py-4">
      <button 
        onClick={goToPreviousMonth}
        className="p-2 rounded-lg hover:bg-accent transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
      </button>
      
      <div className="mx-6 text-lg font-medium min-w-[120px] text-center">
        {formatMonth(currentDate)}
      </div>
      
      <button 
        onClick={goToNextMonth}
        className="p-2 rounded-lg hover:bg-accent transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
}