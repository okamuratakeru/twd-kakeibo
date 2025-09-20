'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const result = await signUp(form)
    
    if (result.success) {
      setSuccess('アカウントが作成されました！ログインページに移動してください。')
      // 3秒後に自動でログインページに移動
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else {
      setError(result.error || 'サインアップに失敗しました')
    }
    
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    const result = await signInWithGoogle()
    
    if (!result.success) {
      setError(result.error || 'Googleログインに失敗しました')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">新規登録</CardTitle>
          <CardDescription>家計簿アプリのアカウントを作成</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">名前</Label>
              <Input
                id="name"
                type="text"
                placeholder="あなたの名前"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="パスワード（6文字以上）"
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                required
                minLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? '登録中...' : '新規登録'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">または</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Googleでサインアップ
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">すでにアカウントをお持ちの方は </span>
            <Link href="/login" className="text-blue-600 hover:underline">
              ログイン
            </Link>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <p className="ml-2 text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <p className="ml-2 text-sm text-green-600">{success}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}