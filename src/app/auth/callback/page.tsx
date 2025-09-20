'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Authentication error:', error)
          router.push('/login?error=認証に失敗しました')
          return
        }

        if (data.session?.user) {
          // Googleログインの場合、プロファイルが存在しない可能性があるのでチェック
          const { data: existingProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single()

          if (!existingProfile) {
            // プロファイルが存在しない場合は作成
            const { error: profileError } = await supabase
              .from('users')
              .insert({
                id: data.session.user.id,
                name: data.session.user.user_metadata.name || data.session.user.email?.split('@')[0] || 'ユーザー',
                provider: 'google',
                created_at: new Date().toISOString()
              })

            if (profileError) {
              console.error('Error creating profile:', profileError)
            }
          }

          router.push('/')
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Callback error:', error)
        router.push('/login?error=認証処理でエラーが発生しました')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">認証処理中...</p>
      </div>
    </div>
  )
}