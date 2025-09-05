"use client";

import { ArrowLeft, Share2, Download, Copy, FileText, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useRouter } from "next/navigation";

interface MonthlyReportProps {
  month: string; // Format: "2025-08"
}

// Mock data for charts and rankings
const categoryData = [
  { name: "食費", value: 45000, color: "var(--chart-1)" },
  { name: "交通費", value: 12000, color: "var(--chart-2)" },
  { name: "娯楽", value: 25000, color: "var(--chart-3)" },
  { name: "光熱費", value: 8000, color: "var(--chart-4)" },
  { name: "その他", value: 10000, color: "var(--chart-5)" }
];

const dailyData = Array.from({ length: 31 }, (_, i) => ({
  day: String(i + 1).padStart(2, '0'),
  amount: Math.floor(Math.random() * 8000) + 1000
}));

const topStores = [
  { name: "セブンイレブン", transactions: 15, amount: 12500 },
  { name: "イオン", transactions: 8, amount: 28000 },
  { name: "ファミリーマート", transactions: 12, amount: 9800 },
  { name: "スーパーマーケット", transactions: 6, amount: 15200 },
  { name: "ガソリンスタンド", transactions: 4, amount: 8500 }
];

const formatMonth = (monthStr: string) => {
  const [year, month] = monthStr.split('-');
  return `${year}年${month.padStart(2, '0')}月レポート`;
};

const formatCurrency = (amount: number, currency: 'JPY' | 'TWD') => {
  if (currency === 'JPY') {
    return `¥${amount.toLocaleString()}`;
  }
  return `NT$${amount.toLocaleString()}`;
};

export function MonthlyReport({ month }: MonthlyReportProps) {
  const router = useRouter();
  const totalJPY = categoryData.reduce((sum, item) => sum + item.value, 0);
  const totalTWD = Math.floor(totalJPY * 0.23); // Mock TWD conversion

  const handleBack = () => {
    router.push("/");
  };

  const handleShare = () => {
    console.log("Share report");
  };

  const handleExport = (type: string) => {
    console.log(`Export as ${type}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">{formatMonth(month)}</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleShare} className="p-2">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Summary Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">{formatCurrency(totalJPY, 'JPY')}</h2>
              <p className="text-lg text-muted-foreground">{formatCurrency(totalTWD, 'TWD')}</p>
              <p className="text-sm text-muted-foreground">前月比 -5.2%</p>
            </div>
          </CardContent>
        </Card>

        {/* Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>カテゴリ別内訳</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    labelLine={false}
                    fontSize={12}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number, 'JPY')} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.slice(0, 3).map((category, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                  <span className="ml-auto">{((category.value / totalJPY) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Trend Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>日別支出推移</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <XAxis 
                    dataKey="day" 
                    fontSize={10}
                    interval="preserveStartEnd"
                  />
                  <YAxis hide />
                  <Tooltip formatter={(value) => formatCurrency(value as number, 'JPY')} />
                  <Bar dataKey="amount" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Stores Ranking */}
        <Card>
          <CardHeader>
            <CardTitle>よく使うお店</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topStores.map((store, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground text-xs rounded-full">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{store.name}</p>
                      <p className="text-sm text-muted-foreground">{store.transactions}回</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatCurrency(store.amount, 'JPY')}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Actions */}
        <Card>
          <CardHeader>
            <CardTitle>エクスポート</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-12 flex flex-col gap-1"
                onClick={() => handleExport('copy')}
              >
                <Copy className="h-4 w-4" />
                <span className="text-xs">テキストコピー</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-12 flex flex-col gap-1"
                onClick={() => handleExport('image')}
              >
                <Download className="h-4 w-4" />
                <span className="text-xs">画像生成</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-12 flex flex-col gap-1"
                onClick={() => handleExport('pdf')}
              >
                <FileText className="h-4 w-4" />
                <span className="text-xs">PDF出力</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-12 flex flex-col gap-1"
                onClick={() => handleExport('line')}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs">LINE共有</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}