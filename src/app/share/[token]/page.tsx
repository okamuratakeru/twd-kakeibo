interface Props {
  params: Promise<{ token: string }>;
}

export default async function SharePage({ params }: Props) {
  const { token } = await params;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">閲覧専用リンク</h1>
      <p>トークン: {token}</p>
      {/* 将来実装 */}
    </div>
  );
}