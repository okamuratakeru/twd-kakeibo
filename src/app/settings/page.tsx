import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">設定</h1>
      <div className="space-y-4">
        <Link href="/settings/categories" className="block p-4 border rounded hover:bg-gray-50">
          カテゴリ管理
        </Link>
        <Link href="/settings/profile" className="block p-4 border rounded hover:bg-gray-50">
          プロフィール設定
        </Link>
      </div>
    </div>
  );
}