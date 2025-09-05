import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onNavigateToExpenseForm?: () => void;
}

export function FloatingActionButton({ onNavigateToExpenseForm }: FloatingActionButtonProps) {
  const handleClick = () => {
    if (onNavigateToExpenseForm) {
      onNavigateToExpenseForm();
    } else {
      console.log("Navigate to /expenses/new");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}