import { Dashboard } from "@/components/Dashboard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-4">
        <Dashboard />
      </main>
    </div>
  );
}
