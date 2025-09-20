"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type {
  AuthState,
  AuthUser,
  UserProfile,
  LoginCredentials,
  SignupCredentials,
} from "@/types/auth";

interface AuthContextType extends AuthState {
  signUp: (
    credentials: SignupCredentials
  ) => Promise<{ success: boolean; error?: string }>;
  signIn: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }

      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        setState({
          user: session.user,
          profile,
          loading: false,
        });
      } else {
        setState({ user: null, profile: null, loading: false });
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        setState({
          user: session.user,
          profile,
          loading: false,
        });
      } else {
        setState({ user: null, profile: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserProfile = async (
    userId: string
  ): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile:", error);
        // プロファイルが存在しない場合、認証をクリアしてログイン画面へ
        await supabase.auth.signOut();
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // エラー時も認証をクリアしてログイン画面へ
      await supabase.auth.signOut();
      return null;
    }
  };

  const createUserProfile = async (
    user: AuthUser,
    name: string,
    provider: UserProfile["provider"]
  ): Promise<void | null> => {
    try {
      const profileData = {
        id: user.id,
        name,
        provider,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("users")
        .insert(profileData);

      if (error) {
        console.error("Error creating user profile:", error);
        return null;
      }

      // ユーザープロファイル作成成功後、初期カテゴリを作成
      await createDefaultCategories(user.id);

    } catch (error) {
      console.error("Error creating user profile:", error);
      return null;
    }
  };

  const createDefaultCategories = async (userId: string) => {
    try {
      // SQLファンクションを呼び出して初期カテゴリを作成
      const { error } = await supabase.rpc("create_default_categories", {
        user_uuid: userId,
      });

      if (error) {
        console.error("Error creating default categories:", error);
      } else {
        console.log(
          "Default categories created successfully for user:",
          userId
        );
      }
    } catch (error) {
      console.error("Error calling create_default_categories function:", error);
    }
  };

  const signUp = async (credentials: SignupCredentials) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await createUserProfile(data.user, credentials.name, "password");
        console.log("createUserProfileが実行された");
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "サインアップに失敗しました" };
    }
  };

  const signIn = async (credentials: LoginCredentials) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "ログインに失敗しました" };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Googleログインに失敗しました" };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
