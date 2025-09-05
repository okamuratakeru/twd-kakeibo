import { Settings } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b border-border">
      <div></div>
      <h1 className="text-lg font-medium">今月の家計簿</h1>
      <button className="p-2 rounded-lg hover:bg-accent transition-colors">
        <Settings className="w-5 h-5 text-muted-foreground" />
      </button>
    </header>
  );
}
