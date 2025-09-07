import { supabase } from '../supabaseClient';

export interface User {
  id: string;
  email: string;
  name: string;
  provider: string;
  createdAt: string;
}

export class UserService {
  public async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('UserService getUserById error:', error);
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return this.mapToUser(data);
  }

  public async createUserIfNotExists(userId: string): Promise<User> {
    // まず既存ユーザーを確認
    const existingUser = await this.getUserById(userId);
    if (existingUser) {
      return existingUser;
    }

    // 存在しない場合はテストユーザーとして作成
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: `${userId}@example.com`,
        name: `Test User ${userId}`,
        provider: 'password',
      })
      .select()
      .single();

    if (error) {
      console.error('UserService createUser error:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return this.mapToUser(data);
  }

  private mapToUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      provider: data.provider,
      createdAt: data.created_at,
    };
  }
}