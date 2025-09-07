"use client";

import { useState, useEffect } from "react";
import { ExpenseListHeader } from "./ExpenseListHeader";
import { ExpenseFilters } from "./ExpenseFilters";
import { ExpenseSummaryBar } from "./ExpenseSummaryBar";
import { ExpenseItem } from "./ExpenseItem";
import { FloatingActionButton } from "./FloatingActionButton";
import { expenseApi, ExpenseResponse, ExpenseApiError } from "@/lib/api/expenses";

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
  const [transactions, setTransactions] = useState<ExpenseResponse[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<ExpenseResponse[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load expenses from API
  const loadExpenses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await expenseApi.getExpenses();
      setTransactions(response.expenses);
      setFilteredTransactions(response.expenses);
    } catch (error) {
      console.error('Failed to load expenses:', error);
      if (error instanceof ExpenseApiError) {
        setError(`エラー: ${error.message}`);
      } else {
        setError("支出データの読み込みに失敗しました。");
      }
      // Fallback to mock data on error
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    // Apply filters logic here
    let filtered = [...transactions];

    if (newFilters.category && newFilters.category !== "全て") {
      filtered = filtered.filter((t) => t.category === newFilters.category);
    }

    if (newFilters.storeName) {
      filtered = filtered.filter((t) =>
        t.storeName?.toLowerCase().includes(newFilters.storeName.toLowerCase())
      );
    }

    if (newFilters.minAmount) {
      filtered = filtered.filter(
        (t) => t.amount >= parseInt(newFilters.minAmount)
      );
    }

    if (newFilters.maxAmount) {
      filtered = filtered.filter(
        (t) => t.amount <= parseInt(newFilters.maxAmount)
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
        sorted.sort((a, b) => b.amount - a.amount);
        break;
      case "amount-asc":
        sorted.sort((a, b) => a.amount - b.amount);
        break;
    }

    setFilteredTransactions(sorted);
  };

  const handleEdit = (id: string) => {
    console.log("Edit transaction:", id);
    // TODO: Navigate to edit form
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この支出を削除しますか？")) return;

    try {
      await expenseApi.deleteExpense(id);
      setTransactions(prev => prev.filter((t) => t.id !== id));
      setFilteredTransactions(prev => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete expense:', error);
      if (error instanceof ExpenseApiError) {
        setError(`削除エラー: ${error.message}`);
      } else {
        setError("支出の削除に失敗しました。");
      }
    }
  };

  const totalTWD = filteredTransactions
    .filter(t => t.currency === "TWD")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalJPY = filteredTransactions
    .filter(t => t.currency === "JPY")
    .reduce((sum, t) => sum + t.amount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

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

      {error && (
        <div className="mx-4 mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

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
            transaction={{
              id: transaction.id,
              date: transaction.date,
              storeName: transaction.storeName || "",
              category: transaction.category,
              amountTWD: transaction.currency === "TWD" ? transaction.amount : 0,
              amountJPY: transaction.currency === "JPY" ? transaction.amount : 0,
              categoryColor: "#FF6B6B" // Default color for now
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {filteredTransactions.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <p>条件に合う取引が見つかりません</p>
          </div>
        )}
      </div>

      <FloatingActionButton onNavigateToExpenseForm={onNavigateToExpenseForm} />
    </div>
  );
}
