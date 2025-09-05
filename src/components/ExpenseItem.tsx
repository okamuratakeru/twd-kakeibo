import { useState, useRef, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  storeName: string;
  category: string;
  amountTWD: number;
  amountJPY: number;
  categoryColor: string;
}

interface ExpenseItemProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ExpenseItem({ transaction, onEdit, onDelete }: ExpenseItemProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    
    // Limit swipe distance
    const maxSwipe = 80;
    const constrainedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff));
    setSwipeX(constrainedDiff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Snap to action if swiped enough
    if (swipeX > 40) {
      console.log("Edit transaction:", transaction.id);
      onEdit(transaction.id);
    } else if (swipeX < -40) {
      console.log("Delete transaction:", transaction.id);
      onDelete(transaction.id);
    }
    
    setSwipeX(0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Action Buttons Background */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 bg-blue-500 flex items-center justify-start pl-4">
          <Edit3 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 bg-red-500 flex items-center justify-end pr-4">
          <Trash2 className="w-5 h-5 text-white" />
        </div>
      </div>
      
      {/* Main Content */}
      <div
        ref={itemRef}
        className="relative bg-background px-4 py-3 border-b border-border"
        style={{ transform: `translateX(${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center">
          {/* Date */}
          <div className="w-12 text-xs text-muted-foreground">
            {formatDate(transaction.date)}
          </div>
          
          {/* Content */}
          <div className="flex-1 mx-3">
            <div className="font-medium text-sm mb-1">
              {transaction.storeName}
            </div>
            <div className="flex items-center">
              <span 
                className="inline-block px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: transaction.categoryColor }}
              >
                {transaction.category}
              </span>
            </div>
          </div>
          
          {/* Amount */}
          <div className="text-right">
            <div className="font-medium text-sm">
              NT${transaction.amountTWD.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              ¥{transaction.amountJPY.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}