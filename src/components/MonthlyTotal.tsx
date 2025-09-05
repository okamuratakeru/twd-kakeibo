import { TrendingUp, TrendingDown } from "lucide-react";

interface MonthlyTotalProps {
  twdAmount: number;
  jpyAmount: number;
  previousMonthChange: number;
}

export function MonthlyTotal({ twdAmount, jpyAmount, previousMonthChange }: MonthlyTotalProps) {
  const isIncrease = previousMonthChange > 0;
  
  return (
    <div className="px-4 py-6 bg-card">
      <div className="space-y-4">
        {/* TWD Amount */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            TWD {twdAmount.toLocaleString()}
          </div>
        </div>
        
        {/* JPY Amount with comparison */}
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 mb-2">
            ¥{jpyAmount.toLocaleString()}
          </div>
          
          <div className={`flex items-center justify-center space-x-1 text-sm ${
            isIncrease ? 'text-red-500' : 'text-green-500'
          }`}>
            {isIncrease ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              前月比 {isIncrease ? '+' : ''}{previousMonthChange.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}