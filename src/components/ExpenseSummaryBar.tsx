import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface ExpenseSummaryBarProps {
  totalTWD: number;
  totalJPY: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function ExpenseSummaryBar({ totalTWD, totalJPY, sortBy, onSortChange }: ExpenseSummaryBarProps) {
  return (
    <div className="px-4 py-3 bg-muted/30 border-b border-border flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">並び順:</span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-auto border-none bg-transparent p-0 h-auto text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">日付 (新しい順)</SelectItem>
            <SelectItem value="date-asc">日付 (古い順)</SelectItem>
            <SelectItem value="amount-desc">金額 (高い順)</SelectItem>
            <SelectItem value="amount-asc">金額 (安い順)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="text-sm">
        <span className="text-muted-foreground">合計: </span>
        <span className="font-medium">NT${totalTWD.toLocaleString()}</span>
        <span className="text-muted-foreground ml-1">(¥{totalJPY.toLocaleString()})</span>
      </div>
    </div>
  );
}