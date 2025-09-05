import { AlertTriangle, ChevronRight } from "lucide-react";

interface UnclassifiedBannerProps {
  count: number;
  onTap: () => void;
}

export function UnclassifiedBanner({ count, onTap }: UnclassifiedBannerProps) {
  if (count === 0) return null;

  return (
    <div className="mx-4 mb-4">
      <button 
        onClick={onTap}
        className="w-full flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800 font-medium">
            未分類の取引が{count}件あります
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-yellow-600" />
      </button>
    </div>
  );
}