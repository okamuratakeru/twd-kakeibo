import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface ExpenseFiltersProps {
  isVisible: boolean;
  onFiltersChange: (filters: any) => void;
}

export function ExpenseFilters({ isVisible, onFiltersChange }: ExpenseFiltersProps) {
  const [filters, setFilters] = useState({
    period: "今月",
    category: "全て",
    currency: "全て",
    storeName: "",
    minAmount: "",
    maxAmount: ""
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  if (!isVisible) return null;

  return (
    <div className="px-4 py-4 bg-card border-b border-border space-y-3">
      {/* Period and Category Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Select value={filters.period} onValueChange={(value) => handleFilterChange('period', value)}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="今月">今月</SelectItem>
              <SelectItem value="先月">先月</SelectItem>
              <SelectItem value="今年">今年</SelectItem>
              <SelectItem value="全期間">全期間</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全て">全て</SelectItem>
              <SelectItem value="食費">食費</SelectItem>
              <SelectItem value="交通費">交通費</SelectItem>
              <SelectItem value="住居費">住居費</SelectItem>
              <SelectItem value="娯楽">娯楽</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Currency and Store Name Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Select value={filters.currency} onValueChange={(value) => handleFilterChange('currency', value)}>
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全て">全て</SelectItem>
              <SelectItem value="TWD">TWD</SelectItem>
              <SelectItem value="JPY">JPY</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Input
            placeholder="店名で検索"
            value={filters.storeName}
            onChange={(e) => handleFilterChange('storeName', e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Amount Range Row */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="最小金額"
          value={filters.minAmount}
          onChange={(e) => handleFilterChange('minAmount', e.target.value)}
          className="text-sm flex-1"
          type="number"
        />
        <span className="text-muted-foreground">-</span>
        <Input
          placeholder="最大金額"
          value={filters.maxAmount}
          onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
          className="text-sm flex-1"
          type="number"
        />
      </div>
    </div>
  );
}