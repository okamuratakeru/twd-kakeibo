import { MonthlyReport } from "@/components/MonthlyReport";

interface Props {
  params: Promise<{ yyyymm: string }>;
}

export default async function MonthlyReportPage({ params }: Props) {
  const { yyyymm } = await params;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">月次レポート - {yyyymm}</h1>
      <MonthlyReport month={yyyymm} />
    </div>
  );
}
