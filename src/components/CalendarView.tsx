"use client";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";

interface CalendarViewProps {
  onBack: () => void;
}

interface Transaction {
  id: string;
  store: string;
  category: string;
  amount: number;
  currency: "TWD" | "JPY";
}

interface DayData {
  date: number;
  total: number;
  transactions: Transaction[];
}

export function CalendarView({ onBack }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 1)); // December 2024
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // Mock data for calendar
  const mockCalendarData: { [key: number]: DayData } = {
    1: {
      date: 1,
      total: 850,
      transactions: [
        {
          id: "1",
          store: "セブンイレブン",
          category: "食費",
          amount: 450,
          currency: "TWD",
        },
        {
          id: "2",
          store: "MRT",
          category: "交通費",
          amount: 400,
          currency: "TWD",
        },
      ],
    },
    5: {
      date: 5,
      total: 2100,
      transactions: [
        {
          id: "3",
          store: "全聯",
          category: "食費",
          amount: 1200,
          currency: "TWD",
        },
        {
          id: "4",
          store: "スターバックス",
          category: "娯楽",
          amount: 900,
          currency: "TWD",
        },
      ],
    },
    10: {
      date: 10,
      total: 1650,
      transactions: [
        {
          id: "5",
          store: "鼎泰豊",
          category: "食費",
          amount: 1650,
          currency: "TWD",
        },
      ],
    },
    15: {
      date: 15,
      total: 3200,
      transactions: [
        {
          id: "6",
          store: "誠品書店",
          category: "娯楽",
          amount: 800,
          currency: "TWD",
        },
        {
          id: "7",
          store: "家楽福",
          category: "食費",
          amount: 2400,
          currency: "TWD",
        },
      ],
    },
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDayClick = (day: number) => {
    const dayData = mockCalendarData[day];
    if (dayData) {
      setSelectedDay(dayData);
      setIsBottomSheetOpen(true);
    } else {
      // Empty day - show add transaction option
      setSelectedDay({
        date: day,
        total: 0,
        transactions: [],
      });
      setIsBottomSheetOpen(true);
    }
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
    });
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = mockCalendarData[day];
      const hasExpenses = dayData && dayData.total > 0;

      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          className="h-16 border border-border rounded-lg p-1 hover:bg-accent transition-colors flex flex-col items-center justify-center relative"
        >
          <span className={`text-sm ${hasExpenses ? "font-medium" : ""}`}>
            {day}
          </span>
          {hasExpenses && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                {dayData.total.toLocaleString()}
              </span>
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-background border-b border-border">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        <h1>カレンダー</h1>

        <button className="p-2 rounded-lg hover:bg-accent transition-colors">
          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      <div className="p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2>{formatMonthYear(currentDate)}</h2>

          <button
            onClick={() => navigateMonth("next")}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-card rounded-lg border border-border p-4">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">{renderCalendarGrid()}</div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <Sheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
        <SheetContent side="bottom" className="h-[70vh]">
          <SheetHeader className="pb-4">
            <SheetTitle>
              {selectedDay && (
                <div className="flex items-center justify-between mt-3">
                  <span></span>
                  {selectedDay.total > 0 && (
                    <span className="text-lg text-blue-600 mr-2">
                      合計 TWD {selectedDay.total.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {selectedDay && selectedDay.transactions.length > 0 ? (
              <>
                {/* Transaction List */}
                <div className="space-y-3">
                  {selectedDay.transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">
                            {transaction.store}
                          </span>
                          <span>
                            {transaction.currency}{" "}
                            {transaction.amount.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {transaction.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-1 rounded hover:bg-accent transition-colors">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1 rounded hover:bg-accent transition-colors">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Transaction Button */}
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    console.log(
                      "Navigate to expense form for date:",
                      selectedDay.date
                    );

                    setIsBottomSheetOpen(false);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  この日に追加
                </Button>
              </>
            ) : (
              // Empty Day State
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  この日の支出はありません
                </p>
                <Button
                  className="w-full"
                  onClick={() => {
                    console.log(
                      "Navigate to expense form for date:",
                      selectedDay?.date
                    );
                    setIsBottomSheetOpen(false);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新規取引を追加
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
