import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";

interface ExpenseListHeaderProps {
  onBack: () => void;
  onSearchToggle: () => void;
  isSearchVisible: boolean;
}

export function ExpenseListHeader({ onBack, onSearchToggle, isSearchVisible }: ExpenseListHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b border-border">
      <button 
        onClick={onBack}
        className="p-2 rounded-lg hover:bg-accent transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
      </button>
      
      <h1 className="text-lg font-medium">取引一覧</h1>
      
      <button 
        onClick={onSearchToggle}
        className={`p-2 rounded-lg transition-colors ${
          isSearchVisible ? 'bg-accent text-primary' : 'hover:bg-accent text-muted-foreground'
        }`}
      >
        <Search className="w-5 h-5" />
      </button>
    </header>
  );
}