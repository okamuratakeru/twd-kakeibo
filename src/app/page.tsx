import { Dashboard } from "@/components/Dashboard";
import { AuthGuard } from "@/components/AuthGuard";
import Link from "next/link";

export default function Home() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto p-4">
          <Dashboard />
        </main>
      </div>
    </AuthGuard>
  );
}
