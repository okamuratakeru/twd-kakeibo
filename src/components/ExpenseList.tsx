"use client";

import { useState, useEffect } from "react";
import { ExpenseListHeader } from "./ExpenseListHeader";
import { ExpenseFilters } from "./ExpenseFilters";
import { ExpenseSummaryBar } from "./ExpenseSummaryBar";
import { ExpenseItem } from "./ExpenseItem";
import { FloatingActionButton } from "./FloatingActionButton";

// Mock data
const mockTransactions = [
  {
    id: "1",
    date: "2024-12-15",
    storeName: "スターバックス",
    category: "食費",
    amountTWD: 150,
    amountJPY: 675,
    categoryColor: "#FF6B6B",
  },
  {
    id: "2",
    date: "2024-12-14",
    storeName: "セブンイレブン",
    category: "食費",
    amountTWD: 80,
    amountJPY: 360,
    categoryColor: "#FF6B6B",
  },
  {
    id: "3",
    date: "2024-12-14",
    storeName: "MRT",
    category: "交通費",
    amountTWD: 25,
    amountJPY: 113,
    categoryColor: "#4ECDC4",
  },
  {
    id: "4",
    date: "2024-12-13",
    storeName: "Netflix",
    category: "娯楽",
    amountTWD: 390,
    amountJPY: 1755,
    categoryColor: "#F9CA24",
  },
  {
    id: "5",
    date: "2024-12-12",
    storeName: "ファミリーマート",
    category: "食費",
    amountTWD: 120,
    amountJPY: 540,
    categoryColor: "#FF6B6B",
  },
  {
    id: "6",
    date: "2024-12-11",
    storeName: "台北101",
    category: "娯楽",
    amountTWD: 600,
    amountJPY: 2700,
    categoryColor: "#F9CA24",
  },
  {
    id: "7",
    date: "2024-12-10",
    storeName: "Uber",
    category: "交通費",
    amountTWD: 200,
    amountJPY: 900,
    categoryColor: "#4ECDC4",
  },
  {
    id: "8",
    date: "2024-12-09",
    storeName: "カルフール",
    category: "食費",
    amountTWD: 450,
    amountJPY: 2025,
    categoryColor: "#FF6B6B",
  },
];

interface ExpenseListProps {
  onBack: () => void;
  onNavigateToExpenseForm: () => void;
}

export function ExpenseList({
  onBack,
  onNavigateToExpenseForm,
}: ExpenseListProps) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [sortBy, setSortBy] = useState("date-desc");
  const [filteredTransactions, setFilteredTransactions] =
    useState(mockTransactions);
  const [filters, setFilters] = useState<any>({});

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    // Apply filters logic here
    let filtered = [...mockTransactions];

    if (newFilters.category && newFilters.category !== "全て") {
      filtered = filtered.filter((t) => t.category === newFilters.category);
    }

    if (newFilters.storeName) {
      filtered = filtered.filter((t) =>
        t.storeName.toLowerCase().includes(newFilters.storeName.toLowerCase())
      );
    }

    if (newFilters.minAmount) {
      filtered = filtered.filter(
        (t) => t.amountTWD >= parseInt(newFilters.minAmount)
      );
    }

    if (newFilters.maxAmount) {
      filtered = filtered.filter(
        (t) => t.amountTWD <= parseInt(newFilters.maxAmount)
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    const sorted = [...filteredTransactions];

    switch (newSort) {
      case "date-desc":
        sorted.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "date-asc":
        sorted.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "amount-desc":
        sorted.sort((a, b) => b.amountTWD - a.amountTWD);
        break;
      case "amount-asc":
        sorted.sort((a, b) => a.amountTWD - b.amountTWD);
        break;
    }

    setFilteredTransactions(sorted);
  };

  const handleEdit = (id: string) => {
    console.log("Edit transaction:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete transaction:", id);
    setFilteredTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const totalTWD = filteredTransactions.reduce(
    (sum, t) => sum + t.amountTWD,
    0
  );
  const totalJPY = filteredTransactions.reduce(
    (sum, t) => sum + t.amountJPY,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <ExpenseListHeader
        onBack={onBack}
        onSearchToggle={handleSearchToggle}
        isSearchVisible={isSearchVisible}
      />

      <ExpenseFilters
        isVisible={isSearchVisible}
        onFiltersChange={handleFiltersChange}
      />

      <ExpenseSummaryBar
        totalTWD={totalTWD}
        totalJPY={totalJPY}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <div className="pb-20">
        {filteredTransactions.map((transaction) => (
          <ExpenseItem
            key={transaction.id}
            transaction={transaction}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>条件に合う取引が見つかりません</p>
          </div>
        )}
      </div>

      <FloatingActionButton onNavigateToExpenseForm={onNavigateToExpenseForm} />
    </div>
  );
}
