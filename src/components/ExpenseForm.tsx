"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";

interface ExpenseFormProps {
  onBack: () => void;
  onSave: (expense: any) => void;
}

export function ExpenseForm({ onBack, onSave }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: "",
    currency: "TWD",
    category: "",
    date: new Date().toISOString().split("T")[0],
    storeName: "",
    memo: "",
  });
  const [continuousMode, setContinuousMode] = useState(false);

  // Exchange rate (mock - should come from API)
  const exchangeRate = 4.5; // 1 TWD = 4.5 JPY

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getConvertedAmount = () => {
    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) return 0;

    if (formData.currency === "TWD") {
      return Math.round(amount * exchangeRate);
    } else {
      return Math.round(amount / exchangeRate);
    }
  };

  const handleSave = (shouldContinue: boolean) => {
    if (!formData.amount || !formData.category) {
      alert("金額とカテゴリは必須です");
      return;
    }

    const expense = {
      ...formData,
      amount: parseFloat(formData.amount),
      convertedAmount: getConvertedAmount(),
      id: Date.now().toString(),
    };

    onSave(expense);

    if (shouldContinue || continuousMode) {
      // 連続入力用リセットフォーム
      setFormData({
        amount: "",
        currency: formData.currency,
        category: formData.category,
        date: new Date().toISOString().split("T")[0],
        storeName: "",
        memo: "",
      });
    } else {
      onBack();
    }
  };

  // Store name suggestions (mock data)
  const storeNameSuggestions = [
    "スターバックス",
    "セブンイレブン",
    "ファミリーマート",
    "ローソン",
    "台北101",
    "Netflix",
    "Uber",
    "MRT",
    "カルフール",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-background border-b border-border">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        <h1 className="text-lg font-medium">新規取引</h1>

        <button
          onClick={() => handleSave(false)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
          disabled={!formData.amount || !formData.category}
        >
          <Save
            className={`w-5 h-5 ${
              !formData.amount || !formData.category
                ? "text-muted-foreground"
                : "text-primary"
            }`}
          />
        </button>
      </header>

      {/* Form */}
      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Amount and Currency */}
        <div className="space-y-3">
          <Label>金額（必須）</Label>
          <div className="flex space-x-3">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className="text-lg h-12"
                inputMode="numeric"
              />
            </div>
            <div className="w-24">
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TWD">TWD</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Conversion Result */}
        {formData.amount && (
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <div className="text-lg font-medium">
              {formData.currency === "TWD"
                ? `NT$${parseFloat(
                    formData.amount
                  ).toLocaleString()} → ¥${getConvertedAmount().toLocaleString()}`
                : `¥${parseFloat(
                    formData.amount
                  ).toLocaleString()} → NT$${getConvertedAmount().toLocaleString()}`}
            </div>
          </div>
        )}

        {/* Category */}
        <div className="space-y-3">
          <Label>カテゴリ（必須）</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleInputChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="カテゴリを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="食費">食費</SelectItem>
              <SelectItem value="交通費">交通費</SelectItem>
              <SelectItem value="住居費">住居費</SelectItem>
              <SelectItem value="娯楽">娯楽</SelectItem>
              <SelectItem value="日用品">日用品</SelectItem>
              <SelectItem value="医療費">医療費</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-3">
          <Label>日付</Label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
          />
        </div>

        {/* Store Name */}
        <div className="space-y-3">
          <Label>店名</Label>
          <Input
            placeholder="店名を入力"
            value={formData.storeName}
            onChange={(e) => handleInputChange("storeName", e.target.value)}
            list="store-suggestions"
          />
          <datalist id="store-suggestions">
            {storeNameSuggestions.map((store, index) => (
              <option key={index} value={store} />
            ))}
          </datalist>
        </div>

        {/* Memo */}
        <div className="space-y-3">
          <Label>メモ</Label>
          <Textarea
            placeholder="メモを入力（任意）"
            value={formData.memo}
            onChange={(e) => handleInputChange("memo", e.target.value)}
            rows={3}
          />
        </div>

        {/* Continuous Mode */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label>連続登録モード</Label>
              <p className="text-sm text-muted-foreground mt-1">
                保存後に同じ画面で続けて登録
              </p>
            </div>
            <Switch
              checked={continuousMode}
              onCheckedChange={setContinuousMode}
            />
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="flex space-x-3">
          <Button
            className="flex-1"
            onClick={() => handleSave(true)}
            disabled={!formData.amount || !formData.category}
          >
            保存して次を追加
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleSave(false)}
            disabled={!formData.amount || !formData.category}
          >
            保存して閉じる
          </Button>
        </div>
      </div>
    </div>
  );
}
