"use client";

import { useState, useRef } from "react";
import { ArrowLeft, Camera, Image, Scissors, Save } from "lucide-react";
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
import { Checkbox } from "./ui/checkbox";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ReceiptFormProps {
  onBack: () => void;
  onSave: (receiptData: any) => void;
}

interface OCRResult {
  amount: string;
  date: string;
  storeName: string;
  confidence: {
    amount: number;
    date: number;
    storeName: number;
  };
}

export function ReceiptForm({ onBack, onSave }: ReceiptFormProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResults, setOcrResults] = useState<OCRResult | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    currency: "TWD",
    date: new Date().toISOString().split("T")[0],
    storeName: "",
    category: "",
    memo: "",
  });
  const [saveImageWithTransaction, setSaveImageWithTransaction] =
    useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Mock OCR processing
  const processOCR = async (imageFile: File): Promise<OCRResult> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock OCR results with varying confidence levels
    return {
      amount: "320",
      date: "2024-12-15",
      storeName: "スターバックス 台北101店",
      confidence: {
        amount: 0.95, // High confidence
        date: 0.85, // Medium confidence
        storeName: 0.65, // Low confidence - will be highlighted
      },
    };
  };

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);

    // Process OCR
    setIsProcessing(true);
    try {
      const results = await processOCR(file);
      setOcrResults(results);

      // Auto-fill form with OCR results
      setFormData((prev) => ({
        ...prev,
        amount: results.amount,
        date: results.date,
        storeName: results.storeName,
      }));
    } catch (error) {
      console.error("OCR processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleGallerySelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getInputClassName = (field: keyof OCRResult["confidence"]) => {
    if (!ocrResults) return "";

    const confidence = ocrResults.confidence[field];
    if (confidence < 0.7) {
      return "bg-yellow-50 border-yellow-300 focus:border-yellow-400 focus:ring-yellow-200";
    }
    return "";
  };

  const handleSave = () => {
    if (!formData.amount || !formData.category) {
      alert("金額とカテゴリは必須です");
      return;
    }

    const receiptData = {
      ...formData,
      amount: parseFloat(formData.amount),
      image: selectedImage,
      ocrConfidence: ocrResults?.confidence,
      saveImage: saveImageWithTransaction,
      id: Date.now().toString(),
    };

    onSave(receiptData);
  };

  const switchToManualEntry = () => {
    // Navigate to manual entry form
    console.log("Switch to manual entry");
  };

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
        <h1 className="text-lg font-medium">レシート登録</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Action Area */}
        {!selectedImage && (
          <div className="space-y-3">
            <Button
              onClick={handleCameraCapture}
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white"
            >
              <Camera className="w-5 h-5 mr-2" />
              📷 カメラで撮影
            </Button>

            <Button
              onClick={handleGallerySelect}
              variant="outline"
              className="w-full h-12"
            >
              <Image className="w-5 h-5 mr-2" />
              🖼 画像を選ぶ
            </Button>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageSelect}
          className="hidden"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Preview Area */}
        {selectedImage && (
          <div className="space-y-3">
            <div className="relative border-2 border-dashed border-border rounded-lg p-4">
              <ImageWithFallback
                src={selectedImage}
                alt="Receipt preview"
                className="w-full h-48 object-contain rounded-lg"
              />
              <button className="absolute top-2 right-2 p-2 bg-background rounded-full shadow-lg hover:bg-accent transition-colors">
                <Scissors className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {isProcessing && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                  OCR処理中...
                </p>
              </div>
            )}
          </div>
        )}

        {/* OCR Results Form */}
        {ocrResults && !isProcessing && (
          <div className="space-y-6">
            {/* Amount and Currency */}
            <div className="space-y-3">
              <Label>金額*</Label>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    className={`text-lg h-12 ${getInputClassName("amount")}`}
                    inputMode="numeric"
                  />
                  {ocrResults.confidence.amount < 0.7 && (
                    <p className="text-xs text-yellow-600 mt-1">
                      ⚠️ 信頼度が低いため確認してください
                    </p>
                  )}
                </div>
                <div className="w-24">
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      handleInputChange("currency", value)
                    }
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

            {/* Date */}
            <div className="space-y-3">
              <Label>日付*</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={getInputClassName("date")}
              />
              {ocrResults.confidence.date < 0.7 && (
                <p className="text-xs text-yellow-600">
                  ⚠️ 信頼度が低いため確認してください
                </p>
              )}
            </div>

            {/* Store Name */}
            <div className="space-y-3">
              <Label>店名</Label>
              <Input
                placeholder="店名"
                value={formData.storeName}
                onChange={(e) => handleInputChange("storeName", e.target.value)}
                className={getInputClassName("storeName")}
              />
              {ocrResults.confidence.storeName < 0.7 && (
                <p className="text-xs text-yellow-600">
                  ⚠️ 信頼度が低いため確認してください
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-3">
              <Label>カテゴリ*</Label>
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

            {/* Save Options */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="save-image"
                  checked={saveImageWithTransaction}
                  onCheckedChange={setSaveImageWithTransaction}
                />
                <Label htmlFor="save-image" className="text-sm">
                  ✓ 画像と取引を同時保存
                </Label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Actions */}
      {selectedImage && ocrResults && !isProcessing && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={!formData.amount || !formData.category}
            >
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>

            <button
              onClick={switchToManualEntry}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              手入力に切替
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
